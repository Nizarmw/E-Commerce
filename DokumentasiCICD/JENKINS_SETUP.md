# Setup Jenkins untuk E-Commerce Project

## Informasi VPS
- **IP**: 10.34.100.141
- **Username**: devsec5
- **Password**: XYCqrifrp5
- **Spesifikasi**: 2 CPU cores, 2GB RAM, 16GB disk
- **Database**: MariaDB (bukan PostgreSQL)

---

## PART 1: SETUP VPS ENVIRONMENT

### Step 1: Connect to VPS

```bash
# Connect to VPS
ssh devsec5@10.34.100.141
# Password: XYCqrifrp5
```

### Step 2: Upload dan Run Setup Script

```bash
# Dari Windows, upload script ke VPS
scp setup-vps.sh devsec5@10.34.100.141:~/

# Connect ke VPS
ssh devsec5@10.34.100.141

# Jalankan setup script
chmod +x setup-vps.sh
sudo ./setup-vps.sh
```

Script `setup-vps.sh` akan otomatis menginstall:
- ✅ Java 21 (OpenJDK)
- ✅ Node.js 18.x LTS
- ✅ Go 1.21
- ✅ Docker + Docker Registry
- ✅ kubectl
- ✅ Security tools (Trivy, gosec)
- ✅ Firewall configuration
- ✅ System monitoring scripts

### Step 3: Install Jenkins

```bash
sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
  
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
  
sudo apt-get update
sudo apt-get install jenkins

# Start Jenkins service
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

### Step 4: Initial Jenkins Setup

1. Akses Jenkins: `http://10.34.100.141:8080`
2. Get initial password:
   ```bash
   sudo cat /var/lib/jenkins/secrets/initialAdminPassword
   ```
3. Install suggested plugins + additional plugins berikut

---

## PART 2: JENKINS CONFIGURATION

### Required Plugins

Install plugins berikut melalui **Manage Jenkins → Plugins**:
- ✅ Docker Pipeline
- ✅ Git Plugin  
- ✅ Kubernetes CLI Plugin
- ✅ Credentials Plugin
- ✅ Pipeline
- ✅ NodeJS Plugin
- ✅ Go Plugin
- ✅ Security Scanner Plugin

### Credentials Setup

1. **Docker Registry Credentials**:
   - Go to **Manage Jenkins → Credentials → (global)**
   - Add **Username/Password**
   - **ID**: `docker-registry-creds`
   - **Username**: admin (atau sesuai registry config)
   - **Password**: your-registry-password

2. **Git Credentials** (jika private repo):
   - Add **Username/Password** atau **SSH Key**
   - **ID**: `git-credentials`

### Environment Configuration

Jenkins sudah dikonfigurasi otomatis oleh `setup-vps.sh` dengan:
- Docker access untuk jenkins user
- Go environment variables
- Node.js dan npm global tools
- kubectl access

---

## PART 3: PROJECT STRUCTURE

### Environment Variables Configuration

**Backend (.env)**:
```bash
DB_USER=ecom_user
DB_PASS=ecom123
DB_HOST=db
DB_PORT=3306
DB_NAME=ecommerce
JWT_SECRET=f9a4b3e2d5c8f7e1a0b6c3d4e8f9a2b7c6d0e5f1b4a8c9d7e2f6a3b0c8d4e9
MIDTRANS_SERVER_KEY=SB-Mid-server-nEvTUg-zOhdLQaN0uy_t9JoQ
MIDTRANS_CLIENT_KEY=SB-Mid-client-vZ1KhHbjaNBsy60c
SUPABASE_URL=https://ssiayuddvhunioreofxl.supabase.co
SUPABASE_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzaWF5dWRkdmh1bmlvcmVvZnhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDAxNDEyMywiZXhwIjoyMDU5NTkwMTIzfQ.jASXkzysve9iOHtkqMINVsvl7rP3N3osqdy1GMpPEoY
SUPABASE_BUCKET=product-image
```

**Frontend (.env)**:
```bash
VITE_API_URL=http://localhost:8080
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-vZ1KhHbjaNBsy60c
```

### Kubernetes Deployments

**Backend Deployment** sudah dikonfigurasi dengan:
- MariaDB connection (bukan PostgreSQL)
- Environment variables untuk Midtrans payment gateway
- Supabase cloud storage configuration
- Resource limits yang optimal

**Frontend Deployment** sudah dikonfigurasi dengan:
- Vite environment variables (bukan React)
- API endpoint ke backend service
- Midtrans client key untuk payment

---

## PART 4: DEVELOPMENT WORKFLOW

### Quick Start Development

Untuk development lokal, gunakan script yang sudah disediakan:

```bash
# Setup dan start development environment
./quick-start.sh
```

Script akan:
1. ✅ Check environment files
2. ✅ Start MariaDB dan backend services via Docker
3. ✅ Install frontend dependencies
4. ✅ Start frontend dev server
5. ✅ Provide useful monitoring commands

### Manual Development

Jika ingin run manual:

```bash
# Backend services
cd back-end
docker-compose up -d

# Frontend
cd front-end
npm install
npm run dev
```

### Upload Project ke VPS

```bash
# Dari Windows, upload project files ke VPS
scp -r . devsec5@10.34.100.141:~/e-commerce/

# Atau gunakan git
ssh devsec5@10.34.100.141
git clone [YOUR_REPO_URL] e-commerce
cd e-commerce
```

---

## PART 5: CI/CD PIPELINE

### Pipeline Features

Jenkinsfile sudah dikonfigurasi dengan:

1. **Build Stages**:
   - ✅ Go backend build dengan proper module handling
   - ✅ React/Vite frontend build
   - ✅ Parallel Docker image building

2. **Security Scanning**:
   - ✅ **gosec** untuk Go vulnerability scanning
   - ✅ **npm audit** untuk Node.js dependencies
   - ✅ **Trivy** untuk container image scanning
   - ✅ **DAST** testing pada deployed application

3. **Deployment**:
   - ✅ Push ke local Docker registry (port 5000)
   - ✅ Deploy ke Kubernetes dengan environment variables
   - ✅ Health checks dan readiness probes
   - ✅ Automatic rollback pada failure

4. **Post-deployment Testing**:
   - ✅ Application accessibility tests
   - ✅ API endpoint validation
   - ✅ Basic vulnerability testing

### Create Pipeline Job

1. **New Item** → **Pipeline**
2. **Name**: `ecommerce-cicd-pipeline`
3. **Pipeline Definition**:
   - **Pipeline script from SCM**
   - **SCM**: Git
   - **Repository URL**: [YOUR_REPO_URL]
   - **Branch**: `*/main`
   - **Script Path**: `Jenkinsfile`

---

## PART 6: MONITORING & TROUBLESHOOTING

### System Status Monitoring

Gunakan script monitoring yang sudah dibuat:

```bash
# Check system status
system-status.sh

# Check Jenkins logs
journalctl -u jenkins -f

# Backup Jenkins configuration
backup-jenkins.sh
```

### Application Endpoints

Setelah deployment:
- **Frontend**: http://10.34.100.141:30081
- **Backend API**: http://10.34.100.141:30080
- **Docker Registry**: http://10.34.100.141:5000
- **Jenkins**: http://10.34.100.141:8080

### Common Issues & Solutions

1. **Connection Issues**:
   ```bash
   # Pastikan bisa SSH ke VPS
   ssh devsec5@10.34.100.141
   
   # Check services running
   sudo systemctl status jenkins
   sudo systemctl status docker
   ```

2. **Database Connection Issues**:
   ```bash
   # Check MariaDB service in Kubernetes
   kubectl get pods -l app=mariadb
   kubectl logs deployment/mariadb
   ```

3. **Docker Registry Issues**:
   ```bash
   # Restart registry container
   docker restart registry
   
   # Check registry status
   curl http://10.34.100.141:5000/v2/
   ```

4. **Environment Variable Issues**:
   ```bash
   # Verify Kubernetes ConfigMaps
   kubectl get configmaps
   kubectl describe configmap ecommerce-config
   ```

### Security Best Practices

1. **Credentials Management**:
   - Gunakan Jenkins Credentials Plugin
   - Jangan hardcode secrets di Jenkinsfile
   - Regular rotation untuk API keys

2. **Container Security**:
   - Scan images dengan Trivy sebelum push
   - Use non-root users di containers
   - Implement pod security standards

3. **Network Security**:
   - Firewall sudah dikonfigurasi oleh setup script
   - Limit access ke sensitive ports
   - Use HTTPS untuk production

---

## PART 7: SECURITY SCANNING WORKFLOW

### Automated Security Pipeline

1. **SAST (Static Analysis)**:
   - **gosec** scan untuk Go code vulnerabilities
   - **npm audit** untuk frontend dependencies
   - **Semgrep** untuk additional code analysis

2. **Container Security**:
   - **Trivy** scan untuk OS dan library vulnerabilities
   - **Docker bench** untuk container best practices
   - **CIS Kubernetes benchmark** untuk cluster security

3. **DAST (Dynamic Analysis)**:
   - Application accessibility testing
   - API endpoint security testing
   - Basic penetration testing tools

### Vulnerability Management

1. **Critical Issues**: Auto-fail build
2. **High Issues**: Require approval untuk deploy
3. **Medium/Low**: Log dan monitor untuk future fixes

---

## QUICK IMPLEMENTATION CHECKLIST

### ✅ **Step-by-Step Implementation**

1. **Connect to VPS**:
   ```bash
   ssh devsec5@10.34.100.141
   # Password: XYCqrifrp5
   ```

2. **Upload dan run setup script**:
   ```bash
   scp setup-vps.sh devsec5@10.34.100.141:~/
   ssh devsec5@10.34.100.141
   sudo ./setup-vps.sh
   ```

3. **Upload project**:
   ```bash
   scp -r . devsec5@10.34.100.141:~/e-commerce/
   ```

4. **Install Jenkins** (sesuai step di atas)

5. **Configure Jenkins** dengan plugins dan credentials

6. **Create Pipeline job** pointing ke repository

7. **Run first build** dan monitor output

8. **Verify deployment** di http://10.34.100.141:30081

---

Setup ini memberikan complete CI/CD pipeline dengan comprehensive security scanning untuk e-commerce application menggunakan MariaDB, Supabase storage, dan Midtrans payment gateway.