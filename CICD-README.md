# E-Commerce CI/CD Pipeline

This repository contains a complete CI/CD pipeline for deploying an e-commerce application using Jenkins and Kubernetes.

## Architecture

- **Backend**: Go (Gin framework) API server
- **Frontend**: React (Vite) application
- **Database**: MariaDB
- **Container Registry**: Private registry at `10.34.7.115:30500`
- **Orchestration**: Kubernetes
- **CI/CD**: Jenkins Pipeline
- **VPS IP**: `10.34.100.141`
- **Jenkins**: `http://10.34.100.141:8081`

## Prerequisites

1. Jenkins server with the following plugins:
   - Docker Pipeline
   - Git
   - Kubernetes CLI Plugin
   - Credentials Plugin
   - Pipeline

2. Jenkins node with Docker and kubectl installed
3. Access to Kubernetes cluster
4. Docker registry credentials configured in Jenkins

## Jenkins Setup

### 1. Access Jenkins
```
Jenkins URL: http://10.34.100.141:8081
```

### 2. Create Docker Registry Credentials
```bash
# In Jenkins: Manage Jenkins → Credentials → (global)
# Add Username/Password with ID: docker-registry-creds
```

### 3. Configure Jenkins Node
```bash
# Install Docker
sudo apt install -y docker.io
sudo usermod -aG docker jenkins
sudo systemctl restart docker

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Configure kubeconfig
sudo mkdir -p /var/lib/jenkins/.kube
sudo cp ~/.kube/config /var/lib/jenkins/.kube/config
sudo chown -R jenkins:jenkins /var/lib/jenkins/.kube
```

## Pipeline Stages

### 1. Checkout
- Retrieves source code from SCM

### 2. Security Scanning
- **Backend**: Uses `gosec` for Go security analysis
- **Frontend**: Runs `npm audit` and ESLint security checks

### 3. Build Applications
- **Backend**: Compiles Go binary
- **Frontend**: Builds React production bundle

### 4. Build Docker Images
- Creates Docker images for both frontend and backend
- Tags with build number and latest

### 5. Push to Registry
- Pushes images to private Docker registry

### 6. Deploy to Kubernetes
- Updates deployment files with new image tags
- Applies all Kubernetes manifests
- Waits for rollout completion

### 7. Health Check
- Verifies all services are running
- Displays service endpoints

## Kubernetes Resources

### Namespaces
- `ecommerce`: Main application namespace

### Database
- **Deployment**: `ecommerce-database`
- **Service**: `ecommerce-database-service` (ClusterIP)
- **Storage**: Persistent Volume Claim for data persistence
- **Config**: ConfigMap and Secret for database credentials

### Backend API
- **Deployment**: `ecommerce-backend` (2 replicas)
- **Service**: `ecommerce-backend-service` (NodePort 30080)
- **Config**: Environment variables via ConfigMap and Secret
- **Security**: Non-root user, read-only filesystem, dropped capabilities

### Frontend
- **Deployment**: `ecommerce-frontend` (2 replicas)  
- **Service**: `ecommerce-frontend-service` (NodePort 30090)
- **Config**: Environment variables via ConfigMap

## Accessing the Application

After successful deployment:

- **Frontend**: `http://10.34.100.141:30090`
- **Backend API**: `http://10.34.100.141:30080`
- **Health Check**: `http://10.34.100.141:30080/health`
- **Jenkins**: `http://10.34.100.141:8081`

## Security Features

### 1. Container Security
- Non-root user execution
- Read-only root filesystem (where possible)
- Dropped Linux capabilities
- Security context enforcement

### 2. Secret Management
- Database credentials stored in Kubernetes Secrets
- JWT secrets managed securely
- Base64 encoded sensitive data

### 3. Network Security
- ClusterIP for internal database communication
- NodePort only for external access requirements
- CORS configured for VPS IP: 10.34.100.141

### 4. Security Scanning
- Automated vulnerability scanning in CI pipeline
- Go security analysis with gosec
- NPM package vulnerability checking

## Environment Variables

### Backend Configuration
```
DB_HOST=ecommerce-database-service
DB_PORT=3306
DB_NAME=ecommerce
DB_USER=ecommerce_user
DB_PASS=<from-secret>
JWT_SECRET=<from-secret>
GIN_MODE=release
```

### Frontend Configuration
```
VITE_API_URL=http://10.34.100.141:30080
NODE_ENV=production
```

## Monitoring and Logging

### Health Checks
- Backend: `/health` endpoint
- Frontend: Root path `/`
- Database: mysqladmin ping

### Resource Limits
- **Backend**: 256Mi memory, 200m CPU
- **Frontend**: 256Mi memory, 200m CPU  
- **Database**: 512Mi memory, 500m CPU

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check Jenkins logs
   # Verify Docker registry connectivity
   # Ensure Go modules are properly configured
   ```

2. **Deployment Issues**
   ```bash
   kubectl get pods -n ecommerce
   kubectl describe pod <pod-name> -n ecommerce
   kubectl logs <pod-name> -n ecommerce
   ```

3. **Service Access**
   ```bash
   kubectl get services -n ecommerce
   kubectl port-forward service/ecommerce-frontend-service 3000:3000 -n ecommerce
   ```

### Scaling
```bash
# Scale backend
kubectl scale deployment ecommerce-backend --replicas=3 -n ecommerce

# Scale frontend  
kubectl scale deployment ecommerce-frontend --replicas=3 -n ecommerce
```

## Development Workflow

1. **Make Changes**: Commit code to repository
2. **Trigger Build**: Jenkins automatically builds on push
3. **Security Scan**: Automated vulnerability checking
4. **Deploy**: Automatic deployment to Kubernetes
5. **Verify**: Check health endpoints and application functionality

## Production Considerations

1. **Change Default Secrets**: Update all passwords and JWT secrets
2. **Enable TLS**: Add HTTPS/TLS termination
3. **Use Ingress**: Replace NodePort with Ingress controller
4. **Monitoring**: Add Prometheus/Grafana monitoring
5. **Backup**: Implement database backup strategy
6. **Resource Limits**: Adjust based on actual usage patterns

## Security Best Practices Implemented

1. **Container Security**
   - Non-privileged containers
   - Minimal base images
   - Security context restrictions

2. **Secret Management**
   - Kubernetes Secrets for sensitive data
   - No hardcoded credentials

3. **Network Security**
   - Internal service communication via ClusterIP
   - Minimal port exposure

4. **Vulnerability Management**
   - Automated security scanning
   - Dependency vulnerability checking
   - Regular security updates

## Quick Setup Guide

### 1. Access Jenkins Dashboard
```
URL: http://10.34.100.141:8081
```

### 2. Create New Pipeline Job
- Job Name: `ecommerce-cicd`
- Type: Pipeline
- Pipeline Definition: Pipeline script from SCM
- SCM: Git
- Repository URL: [Your Git Repository URL]
- Script Path: `Jenkinsfile`

### 3. Configure Credentials
Add Docker registry credentials with ID: `docker-registry-creds`

### 4. Run the Pipeline
Click "Build Now" - the pipeline will:
- Scan for security vulnerabilities
- Build Docker images
- Deploy to Kubernetes
- Verify deployment health

### 5. Access Your Application
- **E-Commerce App**: http://10.34.100.141:30090
- **API Endpoints**: http://10.34.100.141:30080
- **Health Status**: http://10.34.100.141:30080/health

## CORS Configuration
The backend is pre-configured to accept requests from:
- `http://10.34.100.141:30090` (Frontend)
- `http://10.34.100.141:30080` (Backend)
- Local development environments