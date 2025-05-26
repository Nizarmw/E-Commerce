# Jenkins Optimization for Limited Resources (2GB RAM, 2 Core CPU, 16GB Disk)

## System Optimization Commands

### 1. Optimize Jenkins JVM Settings
```bash
# Edit Jenkins service file
sudo systemctl edit jenkins

# Add these JVM options:
[Service]
Environment="JAVA_OPTS=-Xmx512m -Xms256m -XX:MaxMetaspaceSize=128m -XX:+UseG1GC -XX:+UseStringDeduplication -Djava.awt.headless=true"
```

### 2. Docker Optimization
```bash
# Limit Docker daemon memory usage
sudo nano /etc/docker/daemon.json
```

Add this configuration:
```json
{
  "storage-driver": "overlay2",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "default-runtime": "runc",
  "data-root": "/var/lib/docker"
}
```

### 3. System Swap Configuration
```bash
# Add swap space for memory relief
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Optimize swappiness
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

### 4. Jenkins Build Optimization
```bash
# Limit concurrent builds
# In Jenkins: Manage Jenkins → Configure System
# Set "# of executors" to 1
```

### 5. Kubernetes Resource Monitoring
```bash
# Monitor resource usage
kubectl top nodes
kubectl top pods --all-namespaces

# Check cluster resource capacity
kubectl describe nodes
```

## Resource Allocation Summary

### Current Optimized Allocation:
- **Database**: 128Mi-256Mi RAM, 100m-300m CPU
- **Backend**: 64Mi-128Mi RAM, 50m-200m CPU  
- **Frontend**: 32Mi-64Mi RAM, 25m-100m CPU
- **Total**: ~224Mi-448Mi RAM, ~175m-600m CPU

### Available for System:
- **Remaining RAM**: ~1.5GB for OS, Jenkins, Docker
- **Storage**: 1GB for database, rest for images/logs

## Performance Tips

1. **Sequential Builds**: Docker images build one at a time
2. **Aggressive Cleanup**: Automatic cleanup after each build
3. **Memory Limits**: Node.js build limited to 512MB
4. **Timeouts**: Reduced timeouts for faster failure detection
5. **Reduced Replicas**: All services run single replica

## Monitoring Commands

```bash
# Check system resources
free -h
df -h
top

# Check Docker usage
docker system df
docker stats

# Check Kubernetes resources
kubectl get pods -n ecommerce -o wide
kubectl describe nodes
```

## Troubleshooting Low Resource Issues

### If builds fail due to memory:
```bash
# Increase swap
sudo swapoff /swapfile
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo mkswap /swapfile
sudo swapon /swapfile
```

### If disk space runs out:
```bash
# Clean Docker aggressively
docker system prune -af --volumes
docker builder prune -af

# Clean old Kubernetes resources
kubectl delete pods --field-selector=status.phase=Succeeded -A
kubectl delete pods --field-selector=status.phase=Failed -A
```

### If Jenkins becomes unresponsive:
```bash
# Restart Jenkins with lower memory
sudo systemctl stop jenkins
sudo systemctl start jenkins

# Check logs
sudo journalctl -u jenkins -f
```