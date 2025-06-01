#!/bin/bash

# E-Commerce Full Stack Deployment Verification Script
echo "🔍 E-Commerce Deployment Verification Script"
echo "============================================="

# Get node IP and ports
NODE_IP=$(hostname -I | awk '{print $1}')
BACKEND_PORT=$(kubectl get service ecommerce-backend-service -n ecommerce -o jsonpath="{.spec.ports[0].nodePort}" 2>/dev/null || echo "30080")
FRONTEND_PORT=$(kubectl get service ecommerce-frontend-service -n ecommerce -o jsonpath="{.spec.ports[0].nodePort}" 2>/dev/null || echo "30090")

echo "📊 Current Deployment Status:"
echo "   Node IP: $NODE_IP"
echo "   Backend Port: $BACKEND_PORT"
echo "   Frontend Port: $FRONTEND_PORT"
echo ""

# Check Kubernetes pods
echo "🔍 Checking Kubernetes Pods..."
kubectl get pods -n ecommerce -o wide

echo ""
echo "🔍 Checking Kubernetes Services..."
kubectl get services -n ecommerce

echo ""
echo "🔍 Checking Kubernetes Endpoints..."
kubectl get endpoints -n ecommerce

echo ""
echo "🌐 Testing Backend API..."
if curl -f -s --max-time 10 "http://$NODE_IP:$BACKEND_PORT/health" > /dev/null; then
    echo "✅ Backend API is accessible at: http://$NODE_IP:$BACKEND_PORT"
    echo "   Health endpoint: http://$NODE_IP:$BACKEND_PORT/health"
else
    echo "❌ Backend API is NOT accessible"
    echo "🔍 Backend logs:"
    kubectl logs -l app=ecommerce-backend -n ecommerce --tail=20
fi

echo ""
echo "🌐 Testing Frontend Web App..."
if curl -f -s --max-time 10 "http://$NODE_IP:$FRONTEND_PORT/" > /dev/null; then
    echo "✅ Frontend Web App is accessible at: http://$NODE_IP:$FRONTEND_PORT"
else
    echo "❌ Frontend Web App is NOT accessible"
    echo "🔍 Frontend logs:"
    kubectl logs -l app=ecommerce-frontend -n ecommerce --tail=20
fi

echo ""
echo "🔍 Testing API Endpoints..."
echo "Testing categories endpoint..."
if curl -f -s --max-time 10 "http://$NODE_IP:$BACKEND_PORT/categories/" > /dev/null; then
    echo "✅ Categories API working"
else
    echo "❌ Categories API not working"
fi

echo ""
echo "🔍 Network Diagnostics..."
echo "Checking if ports are listening:"
netstat -tulpn | grep ":$BACKEND_PORT\|:$FRONTEND_PORT" || echo "Ports not found in netstat"

echo ""
echo "🔍 Docker Images in Registry..."
echo "Backend images:"
curl -s "http://10.34.100.141:30500/v2/ecommerce-backend/tags/list" | jq . 2>/dev/null || echo "Cannot access backend images"

echo "Frontend images:"
curl -s "http://10.34.100.141:30500/v2/ecommerce-frontend/tags/list" | jq . 2>/dev/null || echo "Cannot access frontend images"

echo ""
echo "📋 Summary:"
echo "Frontend URL: http://$NODE_IP:$FRONTEND_PORT"
echo "Backend API: http://$NODE_IP:$BACKEND_PORT"
echo ""
echo "If you see any ❌ errors above, check the troubleshooting section below."
echo ""
echo "🛠️ Troubleshooting Commands:"
echo "   kubectl get pods -n ecommerce -o wide"
echo "   kubectl logs -l app=ecommerce-frontend -n ecommerce"
echo "   kubectl logs -l app=ecommerce-backend -n ecommerce"
echo "   kubectl describe service ecommerce-frontend-service -n ecommerce"
echo "   kubectl describe service ecommerce-backend-service -n ecommerce"
