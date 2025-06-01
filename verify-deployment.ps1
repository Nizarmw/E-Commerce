# E-Commerce Full Stack Deployment Verification Script (PowerShell)
Write-Host "🔍 E-Commerce Deployment Verification Script" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Get node IP and ports
$NODE_IP = (hostname -I).Split(' ')[0]
$BACKEND_PORT = try { kubectl get service ecommerce-backend-service -n ecommerce -o jsonpath="{.spec.ports[0].nodePort}" 2>$null } catch { "30080" }
$FRONTEND_PORT = try { kubectl get service ecommerce-frontend-service -n ecommerce -o jsonpath="{.spec.ports[0].nodePort}" 2>$null } catch { "30090" }

Write-Host "📊 Current Deployment Status:" -ForegroundColor Yellow
Write-Host "   Node IP: $NODE_IP"
Write-Host "   Backend Port: $BACKEND_PORT"
Write-Host "   Frontend Port: $FRONTEND_PORT"
Write-Host ""

# Check Kubernetes pods
Write-Host "🔍 Checking Kubernetes Pods..." -ForegroundColor Blue
kubectl get pods -n ecommerce -o wide

Write-Host ""
Write-Host "🔍 Checking Kubernetes Services..." -ForegroundColor Blue
kubectl get services -n ecommerce

Write-Host ""
Write-Host "🔍 Checking Kubernetes Endpoints..." -ForegroundColor Blue
kubectl get endpoints -n ecommerce

Write-Host ""
Write-Host "🌐 Testing Backend API..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://$NODE_IP:$BACKEND_PORT/health" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend API is accessible at: http://$NODE_IP:$BACKEND_PORT" -ForegroundColor Green
        Write-Host "   Health endpoint: http://$NODE_IP:$BACKEND_PORT/health"
    }
} catch {
    Write-Host "❌ Backend API is NOT accessible" -ForegroundColor Red
    Write-Host "🔍 Backend logs:" -ForegroundColor Yellow
    kubectl logs -l app=ecommerce-backend -n ecommerce --tail=20
}

Write-Host ""
Write-Host "🌐 Testing Frontend Web App..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://$NODE_IP:$FRONTEND_PORT/" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend Web App is accessible at: http://$NODE_IP:$FRONTEND_PORT" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend Web App is NOT accessible" -ForegroundColor Red
    Write-Host "🔍 Frontend logs:" -ForegroundColor Yellow
    kubectl logs -l app=ecommerce-frontend -n ecommerce --tail=20
}

Write-Host ""
Write-Host "🔍 Testing API Endpoints..." -ForegroundColor Blue
Write-Host "Testing categories endpoint..."
try {
    $response = Invoke-WebRequest -Uri "http://$NODE_IP:$BACKEND_PORT/categories/" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Categories API working" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Categories API not working" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔍 Network Diagnostics..." -ForegroundColor Blue
Write-Host "Checking if ports are listening:"
netstat -an | Select-String ":$BACKEND_PORT|:$FRONTEND_PORT"

Write-Host ""
Write-Host "🔍 Docker Images in Registry..." -ForegroundColor Blue
Write-Host "Backend images:"
try {
    $backendImages = Invoke-RestMethod -Uri "http://10.34.100.141:30500/v2/ecommerce-backend/tags/list" -TimeoutSec 5
    $backendImages | ConvertTo-Json
} catch {
    Write-Host "Cannot access backend images" -ForegroundColor Red
}

Write-Host "Frontend images:"
try {
    $frontendImages = Invoke-RestMethod -Uri "http://10.34.100.141:30500/v2/ecommerce-frontend/tags/list" -TimeoutSec 5
    $frontendImages | ConvertTo-Json
} catch {
    Write-Host "Cannot access frontend images" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "Frontend URL: http://$NODE_IP:$FRONTEND_PORT" -ForegroundColor Green
Write-Host "Backend API: http://$NODE_IP:$BACKEND_PORT" -ForegroundColor Green
Write-Host ""
Write-Host "If you see any ❌ errors above, check the troubleshooting section below."
Write-Host ""
Write-Host "🛠️ Troubleshooting Commands:" -ForegroundColor Yellow
Write-Host "   kubectl get pods -n ecommerce -o wide"
Write-Host "   kubectl logs -l app=ecommerce-frontend -n ecommerce"
Write-Host "   kubectl logs -l app=ecommerce-backend -n ecommerce"
Write-Host "   kubectl describe service ecommerce-frontend-service -n ecommerce"
Write-Host "   kubectl describe service ecommerce-backend-service -n ecommerce"
