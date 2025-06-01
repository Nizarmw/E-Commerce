#!/bin/bash

echo "🌐 Running comprehensive network diagnostics..."

# Function to test connectivity with timeout
test_connection() {
    local url=$1
    local name=$2
    echo -n "Testing $name ($url): "
    
    if curl -s --connect-timeout 10 --max-time 30 --head "$url" >/dev/null 2>&1; then
        echo "✅ OK"
        return 0
    else
        echo "❌ FAILED"
        return 1
    fi
}

# Test DNS resolution
echo "🔍 Testing DNS resolution..."
nslookup google.com
nslookup registry.npmjs.org
nslookup proxy.golang.org
nslookup dl-cdn.alpinelinux.org

echo ""
echo "🌍 Testing external connectivity..."

# Test key external services
test_connection "https://google.com" "Google"
test_connection "https://registry.npmjs.org/" "NPM Registry"
test_connection "https://proxy.golang.org" "Go Proxy"
test_connection "http://dl-cdn.alpinelinux.org/alpine/latest-stable/main/" "Alpine Main Repo"
test_connection "http://mirrors.edge.kernel.org/alpine/latest-stable/main/" "Alpine Mirror"
test_connection "https://nginx.org/" "Nginx"

echo ""
echo "🐳 Testing Docker daemon..."
docker version
docker info | grep -E "(Registry|DNS|Storage|Network)"

echo ""
echo "📊 Network interface info..."
ip route show
cat /etc/resolv.conf

echo ""
echo "🔧 Suggested fixes if connections are failing:"
echo "1. Configure Docker daemon with better DNS: cp docker-daemon-config.json /etc/docker/daemon.json && systemctl restart docker"
echo "2. Use --network=host flag for Docker builds"
echo "3. Check firewall/proxy settings"
echo "4. Try alternative registry mirrors"

echo ""
echo "✅ Network diagnostics complete"
