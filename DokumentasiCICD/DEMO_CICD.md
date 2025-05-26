# Demo CI/CD Pipeline untuk E-Commerce Project

## 🎯 **OVERVIEW**

Demo ini menunjukkan implementasi complete CI/CD pipeline dengan security scanning untuk aplikasi e-commerce menggunakan:
- **Backend**: Go dengan MariaDB, Midtrans payment, Supabase storage
- **Frontend**: React/Vite dengan Material-UI
- **Infrastructure**: Jenkins, Docker, Kubernetes
- **Security**: Multiple vulnerability scanning tools

## 📋 **VPS Information**
- **IP**: 10.34.100.141
- **Username**: devsec5
- **Password**: redactedpassword

---

## 🚀 **TAHAP 1: PERSIAPAN INFRASTRUKTUR**

### **1. Connect ke VPS**

```bash
# Connect to VPS
ssh devsec5@10.34.100.141
# Password: redactedpassword
```

### **2. Upload Setup Script**

```bash
# Dari Windows, upload script setup otomatis ke VPS
scp setup-vps.sh devsec5@10.34.100.141:~/

# Connect dan jalankan setup
ssh devsec5@10.34.100.141
chmod +x setup-vps.sh
sudo ./setup-vps.sh
```

**Script `setup-vps.sh` akan install:**
- ✅ Java 21 (OpenJDK) untuk Jenkins
- ✅ Node.js 18.x LTS untuk frontend
- ✅ Go 1.21 untuk backend
- ✅ Docker + Docker Registry lokal
- ✅ kubectl untuk Kubernetes
- ✅ Security tools: Trivy, gosec
- ✅ Firewall configuration
- ✅ System monitoring scripts

### **3. Upload Project Files**

```bash
# Upload entire project ke VPS
scp -r . devsec5@10.34.100.141:~/e-commerce/

# Atau clone dari repository
ssh devsec5@10.34.100.141
git clone [YOUR_REPO_URL] e-commerce
cd e-commerce
```

### **4. Install Jenkins**

```bash
# Add Jenkins repository
sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
  
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
  
# Install dan start Jenkins
sudo apt-get update
sudo apt-get install jenkins -y
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

### **5. Initial Jenkins Setup**

1. **Access Jenkins**: http://10.34.100.141:8080
2. **Get password**: `sudo cat /var/lib/jenkins/secrets/initialAdminPassword`
3. **Install suggested plugins**
4. **Create admin user**

---

## 🔧 **TAHAP 2: KONFIGURASI JENKINS**

### **6. Install Required Plugins**

Go to **Manage Jenkins → Plugins**, install:
- ✅ Docker Pipeline
- ✅ Git Plugin
- ✅ Kubernetes CLI Plugin
- ✅ Credentials Plugin
- ✅ Pipeline
- ✅ NodeJS Plugin
- ✅ Go Plugin

### **7. Setup Credentials**

**Docker Registry Credentials:**
- **Path**: Manage Jenkins → Credentials → (global)
- **Type**: Username with password
- **ID**: `docker-registry-creds`
- **Username**: admin
- **Password**: admin

**Git Credentials (jika private repo):**
- **Type**: Username with password
- **ID**: `git-credentials`
- **Username**: [GitHub username]
- **Password**: [GitHub token]

---

## 🏗️ **TAHAP 3: PROJECT STRUCTURE**

### **8. Environment Variables**

[redacted env]

### **9. Kubernetes Deployments Updated**

**Backend deployment** sekarang menggunakan:
- MariaDB connection (bukan PostgreSQL)
- Complete environment variables untuk payment gateway
- Supabase cloud storage configuration
- Proper resource limits

**Frontend deployment** menggunakan:
- Vite environment variables (bukan React)
- API URL pointing ke backend service
- Midtrans client key untuk payment processing

---

## 🔄 **TAHAP 4: CI/CD PIPELINE IMPLEMENTATION**

### **10. Create Pipeline Job**

1. **Jenkins Dashboard → New Item**
2. **Name**: `ecommerce-security-cicd`
3. **Type**: Pipeline
4. **Configuration**:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: [YOUR_REPO_URL]
   - **Branch**: `*/main`
   - **Script Path**: `Jenkinsfile`

### **11. Pipeline Stages Overview**

**Jenkinsfile sudah dikonfigurasi dengan stages:**

1. **Checkout**: Pull latest code
2. **Backend Build**: Go build dengan dependency management
3. **Frontend Build**: React/Vite build dengan npm
4. **Security Scans**: 
   - gosec untuk Go vulnerabilities
   - npm audit untuk frontend dependencies
   - Trivy untuk container scanning
5. **Docker Build**: Parallel build backend & frontend images
6. **Push Images**: Push ke local Docker registry
7. **Deploy**: Deploy ke Kubernetes dengan updated configs
8. **DAST Testing**: Dynamic security testing
9. **Vulnerability Assessment**: Comprehensive security report

---

## 🔍 **TAHAP 5: SECURITY TESTING CYCLE**

### **12. Run Initial Pipeline**

```bash
# Go to pipeline job → "Build Now"
# Monitor console output untuk setiap stage
# Expected output: All stages pass with security reports generated
```

### **13. Review Security Reports**

Pipeline akan generate reports:
- `gosec-report.json` - Static code analysis
- `npm-audit-report.json` - Dependency vulnerabilities
- `trivy-report.json` - Container image security
- `dast-report.txt` - Dynamic application testing
- `vulnerability-report.txt` - Summary assessment

### **14. Vulnerability Fix Cycle**

**Pre-implemented fixes dalam codebase:**
1. ✅ **SQL Injection di Auth Controller** - Fixed dengan parameterized queries
2. ✅ **SQL Injection di User Search** - Fixed dengan prepared statements
3. ✅ **Unsafe Raw SQL Updates** - Fixed dengan ORM methods

### **15. Verification Pipeline**

```bash
# Commit any additional fixes
git add .
git commit -m "Additional security improvements"
git push origin main

# Pipeline auto-triggers
# Verify reduced vulnerabilities in new reports
```

---

## 🎯 **TAHAP 6: TESTING & VERIFICATION**

### **16. Application Access**

After successful deployment:
- **Frontend**: http://10.34.100.141:30081
- **Backend API**: http://10.34.100.141:30080
- **Health Check**: http://10.34.100.141:30080/health
- **Jenkins Dashboard**: http://10.34.100.141:8080

### **17. Local Development Testing**

Untuk local development testing:
```bash
# On VPS, test quick start script
ssh devsec5@10.34.100.141
cd e-commerce
./quick-start.sh

# Manual development testing
cd back-end && docker-compose up -d
cd front-end && npm run dev
```

### **18. End-to-End Testing**

```bash
# Test application functionality
curl http://10.34.100.141:30080/health
curl http://10.34.100.141:30080/api/categories
curl http://10.34.100.141:30081

# Check Kubernetes deployments
kubectl get pods
kubectl get services
kubectl get deployments
```

---

## 📊 **TAHAP 7: MONITORING & MAINTENANCE**

### **19. System Monitoring**

```bash
# Check services status
sudo systemctl status jenkins
sudo systemctl status docker

# Monitor Jenkins logs
sudo journalctl -u jenkins -f

# Check application logs
kubectl logs -f deployment/ecommerce-backend
kubectl logs -f deployment/ecommerce-frontend
```

### **20. Security Report Analysis**

**Automated security checks include:**
- **SAST**: Static code analysis dengan gosec
- **Dependency Scanning**: npm audit untuk frontend
- **Container Security**: Trivy scanning
- **DAST**: Runtime security testing
- **Compliance**: Best practices verification

---

## ✅ **IMPLEMENTATION CHECKLIST**

### **Infrastructure Setup**
- [ ] VPS accessible (ssh devsec5@10.34.100.141)
- [ ] setup-vps.sh executed successfully
- [ ] Jenkins installed & accessible (http://10.34.100.141:8080)
- [ ] Docker registry running (port 5000)
- [ ] Project files uploaded ke VPS

### **Pipeline Configuration**
- [ ] Git repository accessible
- [ ] Jenkins credentials configured
- [ ] Pipeline job created dan configured
- [ ] Environment variables properly set

### **Security Testing**
- [ ] First pipeline run successful
- [ ] All security scans completed
- [ ] Vulnerability reports generated
- [ ] Fixed vulnerabilities verified
- [ ] Application deployed successfully

### **Final Verification**
- [ ] Frontend accessible: http://10.34.100.141:30081
- [ ] Backend API responding: http://10.34.100.141:30080
- [ ] Security reports show improvements
- [ ] Complete vulnerability testing cycle demonstrated

---

## 🎯 **EXPECTED DEMO RESULTS**

**Completed implementation provides:**

1. **Complete CI/CD Pipeline**:
   - Automated build & test untuk Go backend dan React frontend
   - Multi-stage security scanning (SAST, dependency, container, DAST)
   - Automated deployment ke Kubernetes dengan proper configurations

2. **Security Testing Cycle**:
   - Vulnerability detection dengan multiple tools
   - Automated security report generation
   - Fix implementation dan verification
   - Continuous security monitoring

3. **Production-Ready Application**:
   - E-commerce dengan payment gateway (Midtrans)
   - Cloud storage integration (Supabase)
   - Database dengan proper security configurations
   - Scalable Kubernetes deployment

---

## 🚨 **TROUBLESHOOTING GUIDE**

### **Common Issues & Solutions**

1. **SSH Connection Issues**:
   ```bash
   # Pastikan credentials benar
   ssh devsec5@10.34.100.141
   # Password: redactedpassword
   ```

2. **Jenkins Not Accessible**:
   ```bash
   # Check Jenkins service
   sudo systemctl status jenkins
   sudo systemctl restart jenkins
   
   # Check if port 8080 is open
   sudo netstat -tlnp | grep :8080
   ```

3. **Pipeline Build Failures**:
   ```bash
   # Check Jenkins logs
   sudo journalctl -u jenkins -f
   
   # Check Docker daemon
   sudo systemctl status docker
   ```

4. **Application Deployment Issues**:
   ```bash
   # Check Kubernetes pods
   kubectl get pods
   kubectl describe pod [POD_NAME]
   kubectl logs [POD_NAME]
   ```

**Demo ini memenuhi requirement tugas DevSec untuk menunjukkan complete vulnerability testing cycle dalam CI/CD environment dengan Jenkins menggunakan credentials: devsec5@10.34.100.141**