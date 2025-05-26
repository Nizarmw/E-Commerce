#!/bin/bash

# Setup VPS Script untuk Jenkins CI/CD E-Commerce
# VPS IP: 10.34.100.141
# Author: DevSec Team

set -e  # Exit on any error

echo "🚀 Starting VPS Setup for Jenkins CI/CD Pipeline..."
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Update system packages
print_header "Updating System Packages"
apt update && apt upgrade -y
print_status "System packages updated successfully"

# Install essential packages
print_header "Installing Essential Packages"
apt install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    build-essential \
    htop \
    vim \
    nano

print_status "Essential packages installed"

# Install Node.js 18.x LTS
print_header "Installing Node.js 18.x LTS"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Verify Node.js installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_status "Node.js installed: $NODE_VERSION"
print_status "NPM installed: $NPM_VERSION"

# Install Go 1.21
print_header "Installing Go 1.21"
cd /tmp
wget -q https://go.dev/dl/go1.21.0.linux-amd64.tar.gz
rm -rf /usr/local/go
tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz

# Add Go to PATH
echo 'export PATH=$PATH:/usr/local/go/bin' >> /etc/profile
echo 'export PATH=$PATH:/usr/local/go/bin' >> /home/jenkins/.bashrc || true
echo 'export GOPATH=/home/jenkins/go' >> /home/jenkins/.bashrc || true
echo 'export PATH=$PATH:/home/jenkins/go/bin' >> /home/jenkins/.bashrc || true

# Set Go environment for current session
export PATH=$PATH:/usr/local/go/bin
export GOPATH=/home/jenkins/go
export PATH=$PATH:/home/jenkins/go/bin

# Verify Go installation
GO_VERSION=$(go version)
print_status "Go installed: $GO_VERSION"

# Create Go workspace for jenkins user
if id "jenkins" &>/dev/null; then
    mkdir -p /home/jenkins/go/{bin,pkg,src}
    chown -R jenkins:jenkins /home/jenkins/go
    print_status "Go workspace created for jenkins user"
fi

# Install Docker (if not already installed)
print_header "Installing/Configuring Docker"
if ! command -v docker &> /dev/null; then
    # Install Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    print_status "Docker installed"
else
    print_status "Docker already installed"
fi

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Add jenkins user to docker group
if id "jenkins" &>/dev/null; then
    usermod -aG docker jenkins
    print_status "Jenkins user added to docker group"
fi

# Configure Docker for insecure registry
print_header "Configuring Docker Registry"
mkdir -p /etc/docker
cat > /etc/docker/daemon.json << EOF
{
  "insecure-registries": ["10.34.100.141:5000", "localhost:5000"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

systemctl restart docker
print_status "Docker configured for insecure registry"

# Start local Docker registry
print_header "Starting Local Docker Registry"
docker run -d -p 5000:5000 --restart=always --name registry registry:2 || print_warning "Registry container might already be running"
print_status "Local Docker registry started on port 5000"

# Install kubectl
print_header "Installing kubectl"
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
mv kubectl /usr/local/bin/
print_status "kubectl installed"

# Install additional security tools
print_header "Installing Security Tools"

# Install Trivy (container security scanner)
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | apt-key add -
echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | tee -a /etc/apt/sources.list.d/trivy.list
apt-get update
apt-get install -y trivy

print_status "Trivy container scanner installed"

# Create Jenkins workspace directories
print_header "Setting up Jenkins Workspace"
if id "jenkins" &>/dev/null; then
    mkdir -p /var/lib/jenkins/.kube
    mkdir -p /var/lib/jenkins/workspace
    mkdir -p /var/lib/jenkins/tools
    
    # Set proper permissions
    chown -R jenkins:jenkins /var/lib/jenkins
    chmod -R 755 /var/lib/jenkins
    
    print_status "Jenkins workspace directories created"
else
    print_warning "Jenkins user not found. Create Jenkins workspace manually after Jenkins installation."
fi

# Install additional Node.js security tools
print_header "Installing Node.js Security Tools"
npm install -g npm@latest
npm install -g audit-ci
npm install -g retire
print_status "Node.js security tools installed"

# Configure firewall (basic setup)
print_header "Configuring Firewall"
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# Allow SSH
ufw allow ssh

# Allow Jenkins (8080)
ufw allow 8080

# Allow Docker Registry (5000)
ufw allow 5000

# Allow application ports
ufw allow 30080  # Backend NodePort
ufw allow 30081  # Frontend NodePort

# Allow HTTP/HTTPS
ufw allow 80
ufw allow 443

# Enable firewall
ufw --force enable
print_status "Firewall configured"

# Create useful aliases
print_header "Creating Useful Aliases"
cat >> /home/jenkins/.bashrc << 'EOF' || true

# Useful aliases for Jenkins CI/CD
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias grep='grep --color=auto'
alias dockerps='docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgs='kubectl get services'
alias kgd='kubectl get deployments'
alias logs='journalctl -f'
alias jenkinslogs='journalctl -u jenkins -f'
EOF

# Create monitoring script
print_header "Creating System Monitoring Script"
cat > /usr/local/bin/system-status.sh << 'EOF'
#!/bin/bash

echo "=== SYSTEM STATUS REPORT ==="
echo "Date: $(date)"
echo ""

echo "=== SYSTEM RESOURCES ==="
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print "CPU Usage: " 100 - $1"%"}'

echo ""
echo "Memory Usage:"
free -h

echo ""
echo "Disk Usage:"
df -h / | tail -1

echo ""
echo "=== DOCKER STATUS ==="
echo "Docker Service:"
systemctl is-active docker

echo ""
echo "Running Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "=== JENKINS STATUS ==="
echo "Jenkins Service:"
systemctl is-active jenkins 2>/dev/null || echo "not installed"

echo ""
echo "=== NETWORK CONNECTIONS ==="
echo "Active connections on key ports:"
ss -tulpn | grep -E ':(8080|5000|30080|30081)'

echo ""
echo "=== RECENT SYSTEM LOGS ==="
echo "Last 5 system messages:"
journalctl --no-pager -n 5 --output=short
EOF

chmod +x /usr/local/bin/system-status.sh
print_status "System monitoring script created at /usr/local/bin/system-status.sh"

# Create backup script for Jenkins
print_header "Creating Jenkins Backup Script"
cat > /usr/local/bin/backup-jenkins.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/home/jenkins/backups"
DATE=$(date +%Y%m%d_%H%M%S)
JENKINS_HOME="/var/lib/jenkins"

mkdir -p $BACKUP_DIR

echo "Creating Jenkins backup..."
tar -czf "$BACKUP_DIR/jenkins_backup_$DATE.tar.gz" \
    --exclude="$JENKINS_HOME/workspace/*" \
    --exclude="$JENKINS_HOME/logs/*" \
    --exclude="$JENKINS_HOME/war/*" \
    "$JENKINS_HOME"

echo "Backup created: $BACKUP_DIR/jenkins_backup_$DATE.tar.gz"

# Keep only last 5 backups
cd $BACKUP_DIR
ls -t jenkins_backup_*.tar.gz | tail -n +6 | xargs -r rm

echo "Backup completed successfully"
EOF

chmod +x /usr/local/bin/backup-jenkins.sh
print_status "Jenkins backup script created at /usr/local/bin/backup-jenkins.sh"

# Setup log rotation
print_header "Configuring Log Rotation"
cat > /etc/logrotate.d/jenkins-custom << EOF
/var/log/jenkins/*.log {
    daily
    rotate 30
    compress
    missingok
    notifempty
    create 0644 jenkins jenkins
}
EOF

print_status "Log rotation configured"

# Create environment setup script
print_header "Creating Environment Setup Script"
cat > /home/jenkins/setup-env.sh << 'EOF'
#!/bin/bash
# Environment setup for Jenkins builds

export PATH=$PATH:/usr/local/go/bin
export GOPATH=/home/jenkins/go
export PATH=$PATH:/home/jenkins/go/bin
export NODE_OPTIONS="--max-old-space-size=2048"

# Docker environment
export DOCKER_HOST=unix:///var/run/docker.sock

# Kubernetes environment  
export KUBECONFIG=/home/jenkins/.kube/config

echo "Environment variables set up for Jenkins builds"
EOF

chmod +x /home/jenkins/setup-env.sh
chown jenkins:jenkins /home/jenkins/setup-env.sh 2>/dev/null || true
print_status "Environment setup script created"

# Final system cleanup
print_header "Final System Cleanup"
apt autoremove -y
apt autoclean
print_status "System cleanup completed"

# Display final status
print_header "Setup Complete - System Information"
echo ""
print_status "VPS IP: 10.34.100.141"
print_status "Java Version: $(java -version 2>&1 | head -n 1)"
print_status "Node.js Version: $(node --version)"
print_status "NPM Version: $(npm --version)"
print_status "Go Version: $(go version)"
print_status "Docker Version: $(docker --version)"
print_status "kubectl Version: $(kubectl version --client --short 2>/dev/null)"

echo ""
print_header "Next Steps"
echo "1. Restart the system: sudo reboot"
echo "2. Install Jenkins following the documentation"
echo "3. Configure Jenkins plugins and credentials"
echo "4. Create and run the CI/CD pipeline"
echo ""
print_status "VPS setup completed successfully!"
print_status "You can run 'system-status.sh' anytime to check system status"
echo ""