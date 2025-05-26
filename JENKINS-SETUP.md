# Jenkins Setup Guide for E-Commerce Pipeline

## Required Credentials Setup

### 1. Docker Registry Credentials
```
Manage Jenkins → Credentials → (global) → Add Credentials
```

**Credential Details:**
- **Kind**: Username with password
- **ID**: `docker-registry-creds` (exactly this name - pipeline depends on it)
- **Username**: Your Docker registry username
- **Password**: Your Docker registry password
- **Description**: Docker Registry Access for E-Commerce

### 2. GitHub Access (if using private repo)
```
Manage Jenkins → Credentials → (global) → Add Credentials
```

**Credential Details:**
- **Kind**: Username with password or GitHub App
- **ID**: `github-access`
- **Username**: Your GitHub username
- **Password**: GitHub Personal Access Token
- **Description**: GitHub Access for E-Commerce

## Jenkins System Configuration

### 1. Configure Git
```bash
# On Jenkins server
sudo apt update
sudo apt install -y git
git --version
```

### 2. Configure Docker
```bash
# Add jenkins user to docker group
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins

# Test docker access
sudo -u jenkins docker ps
```

### 3. Configure kubectl
```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Setup kubeconfig for jenkins user
sudo mkdir -p /var/lib/jenkins/.kube
sudo cp ~/.kube/config /var/lib/jenkins/.kube/config
sudo chown -R jenkins:jenkins /var/lib/jenkins/.kube
sudo chmod 600 /var/lib/jenkins/.kube/config
```

### 4. Install Go (for security scanning)
```bash
# Download and install Go
wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz

# Add to PATH for jenkins user
echo 'export PATH=$PATH:/usr/local/go/bin' | sudo tee -a /var/lib/jenkins/.bashrc
echo 'export GOPATH=/var/lib/jenkins/go' | sudo tee -a /var/lib/jenkins/.bashrc
```

## Docker Registry Setup

### Option 1: Local Registry (Recommended for VPS)
```bash
# Run local Docker registry
docker run -d -p 30500:5000 --restart=always --name registry registry:2

# Test registry
curl http://10.34.100.141:30500/v2/_catalog
```

### Option 2: Docker Hub
Use your Docker Hub credentials in the Jenkins credentials setup.

## Pipeline Testing

### Manual Test Commands
```bash
# Test Docker build
cd back-end
docker build -t test-backend .

cd ../front-end  
docker build -t test-frontend .

# Test Kubernetes connectivity
kubectl get nodes
kubectl get namespaces
```

### First Pipeline Run
1. Go to your Jenkins job
2. Click "Build Now"
3. Monitor Console Output for any issues
4. Check each stage completion

## Troubleshooting Common Issues

### Build Fails - Docker Permission
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Build Fails - Kubectl Access
```bash
sudo chown -R jenkins:jenkins /var/lib/jenkins/.kube
kubectl --kubeconfig=/var/lib/jenkins/.kube/config get nodes
```

### Build Fails - Go Not Found
```bash
sudo ln -s /usr/local/go/bin/go /usr/bin/go
sudo ln -s /usr/local/go/bin/gofmt /usr/bin/gofmt
```

### Registry Connection Issues
```bash
# Test registry connectivity
docker pull hello-world
docker tag hello-world 10.34.100.141:30500/hello-world
docker push 10.34.100.141:30500/hello-world
```

## Expected Pipeline Flow

1. **Checkout**: Pull latest code from GitHub
2. **Security Scan**: Scan Go and Node.js for vulnerabilities  
3. **Build Apps**: Compile backend and build frontend
4. **Build Images**: Create Docker images
5. **Push Images**: Upload to registry
6. **Deploy K8s**: Apply Kubernetes manifests
7. **Health Check**: Verify deployment success

## Access URLs After Successful Deploy

- **Frontend**: http://10.34.100.141:30090
- **Backend API**: http://10.34.100.141:30080  
- **Health Check**: http://10.34.100.141:30080/health
- **Jenkins**: http://10.34.100.141:8081