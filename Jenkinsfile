pipeline {
    agent any

    environment {
        REGISTRY = "10.34.100.141:30500"
        BACKEND_IMAGE = "ecommerce-backend"
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
        KUBECONFIG = "/var/lib/jenkins/.kube/config"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Check Registry Connection') {
            steps {
                script {
                    echo "🔍 Checking Docker Registry connection..."
                    sh '''
                        # Test connection to the registry
                        curl -f http://${REGISTRY}/v2/ || {
                            echo "⚠️ Cannot connect to Docker registry at ${REGISTRY}"
                            echo "Ensuring registry container is running..."
                            
                            # Check if registry container is running
                            if ! docker ps | grep -q "registry:2"; then
                                echo "Registry container not found or not running!"
                                echo "Starting registry container..."
                                docker run -d -p 30500:5000 --restart=always --name registry registry:2
                                sleep 5
                            fi
                            
                            # Check connection again
                            curl -f http://${REGISTRY}/v2/ || {
                                echo "⚠️ Still cannot connect to Docker registry at ${REGISTRY}"
                                echo "Please ensure the registry service is properly configured and accessible"
                                exit 1
                            }
                        }
                        
                        # Check if Docker daemon is configured for insecure registry
                        if [ -f /etc/docker/daemon.json ]; then
                            if ! grep -q "${REGISTRY}" /etc/docker/daemon.json; then
                                echo "Configuring Docker daemon for insecure registry..."
                                sudo mkdir -p /etc/docker
                                echo '{"insecure-registries": ["'${REGISTRY}'"]}' | sudo tee /etc/docker/daemon.json
                                sudo systemctl restart docker
                                sleep 10
                            fi
                        else
                            echo "Configuring Docker daemon for insecure registry..."
                            sudo mkdir -p /etc/docker
                            echo '{"insecure-registries": ["'${REGISTRY}'"]}' | sudo tee /etc/docker/daemon.json
                            sudo systemctl restart docker
                            sleep 10
                        fi
                    '''
                }
            }
        }

        stage('Build Go Binary') {
            steps {
                echo "🔨 Building Go backend..."
                sh '''
                    cd back-end
                    
                    # Initialize go.mod if needed
                    go mod tidy
                    
                    # Build Go binary with optimizations for small size
                    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o server ./main.go
                    
                    # Verify binary size
                    ls -lh server
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "🐳 Building Docker image..."
                    
                    sh '''
                        cd back-end
                        echo "Building backend image..."
                        docker build -t ${REGISTRY}/${BACKEND_IMAGE}:${BUILD_NUMBER} .
                        docker tag ${REGISTRY}/${BACKEND_IMAGE}:${BUILD_NUMBER} ${REGISTRY}/${BACKEND_IMAGE}:latest
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    echo "📤 Pushing Docker image to registry..."
                    sh '''
                        # Direct push without login for local insecure registry
                        docker push ${REGISTRY}/${BACKEND_IMAGE}:${BUILD_NUMBER}
                        docker push ${REGISTRY}/${BACKEND_IMAGE}:latest
                        
                        # Verify image exists in registry
                        curl -s http://${REGISTRY}/v2/${BACKEND_IMAGE}/tags/list || echo "⚠️ Could not verify image in registry"
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "🚀 Deploying to Kubernetes..."
                    sh '''
                        # Configure k3s to use insecure registry
                        sudo mkdir -p /etc/rancher/k3s
                        
                        if [ ! -f /etc/rancher/k3s/registries.yaml ] || ! grep -q "${REGISTRY}" /etc/rancher/k3s/registries.yaml; then
                            echo "Configuring k3s to use insecure registry at ${REGISTRY}..."
                            cat > /tmp/registries.yaml << EOL
mirrors:
  "${REGISTRY}":
    endpoint:
      - "http://${REGISTRY}"
EOL
                            sudo mv /tmp/registries.yaml /etc/rancher/k3s/registries.yaml
                            sudo systemctl restart k3s
                            sleep 10
                        fi
                        
                        # Update the build number in yaml files
                        sed -i "s/\\${BUILD_NUMBER}/$BUILD_NUMBER/g" kubernetes/backend-deployment.yaml
                        
                        # Create namespace if it doesn't exist
                        kubectl create namespace ecommerce --dry-run=client -o yaml | kubectl apply -f -
                        
                        # Apply Kubernetes configurations
                        kubectl apply -f kubernetes/namespace.yaml
                        kubectl apply -f kubernetes/database-deployment.yaml
                        kubectl apply -f kubernetes/database-service.yaml
                        kubectl apply -f kubernetes/backend-deployment.yaml
                        kubectl apply -f kubernetes/backend-service.yaml
                        
                        # Wait for pods to be ready
                        echo "⏳ Waiting for pods to be ready..."
                        kubectl wait --for=condition=ready pod -l app=ecommerce-database -n ecommerce --timeout=120s || true
                        kubectl wait --for=condition=ready pod -l app=ecommerce-backend -n ecommerce --timeout=120s || true
                        
                        # Show pod status
                        echo "📊 Pod status:"
                        kubectl get pods -n ecommerce
                        
                        # Check services
                        echo "🔍 Service details:"
                        kubectl get services -n ecommerce
                        
                        # Check backend service details
                        echo "🔍 Backend service details:"
                        kubectl describe service ecommerce-backend-service -n ecommerce
                        
                        # Check if backend service is accessible
                        echo "🔌 Testing backend service connectivity..."
                        curl -v http://localhost:30080/health || echo "⚠️ Cannot connect to backend service on localhost:30080"
                        curl -v http://${REGISTRY%:*}:30080/health || echo "⚠️ Cannot connect to backend service on ${REGISTRY%:*}:30080"
                        
                        # Check pod logs
                        echo "📜 Backend pod logs:"
                        kubectl logs -l app=ecommerce-backend -n ecommerce --tail=50 || echo "⚠️ Cannot retrieve backend logs"
                        
                        # Check firewall status
                        echo "🧱 Firewall status:"
                        sudo ufw status || echo "No UFW firewall"
                        sudo iptables -L | grep 30080 || echo "No explicit iptables rules for port 30080"
                    '''
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                script {
                    echo "✅ Verifying deployment..."
                    sh '''
                        echo "Waiting for service to stabilize..."
                        sleep 15
                        
                        # Get NodePort information
                        NODE_IP=$(hostname -I | awk '{print $1}')
                        NODE_PORT=$(kubectl get service ecommerce-backend-service -n ecommerce -o jsonpath="{.spec.ports[0].nodePort}")
                        
                        echo "Backend API should be accessible at: http://${NODE_IP}:${NODE_PORT}"
                        echo "Testing API endpoint..."
                        curl -v http://${NODE_IP}:${NODE_PORT}/health || echo "⚠️ Backend API is not responding. Check pod logs and network configuration."
                        
                        # Check if port is actually listening
                        echo "Checking if port ${NODE_PORT} is listening:"
                        netstat -tulpn | grep ${NODE_PORT} || echo "⚠️ No process is listening on port ${NODE_PORT}"
                        
                        # Explicitly check if k3s is properly forwarding traffic to NodePort
                        echo "Checking k3s service forwarding:"
                        sudo iptables-save | grep ${NODE_PORT} || echo "⚠️ No iptables rules found for k3s NodePort ${NODE_PORT}"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful! Backend application has been deployed."
        }
        failure {
            echo "❌ Deployment failed! Check the logs for more information."
        }
    }
}