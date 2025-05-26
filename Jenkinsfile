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
        
        stage('Configure Docker') {
            steps {
                script {
                    echo "🔧 Configuring Docker to use insecure registry..."
                    sh '''
                        # Create or update Docker daemon config to handle insecure registry
                        echo "Configuring Docker daemon to use insecure registry at ${REGISTRY}..."
                        
                        # Check if daemon.json exists and contains our registry
                        if [ -f /etc/docker/daemon.json ] && grep -q "${REGISTRY}" /etc/docker/daemon.json; then
                            echo "Insecure registry already configured."
                        else
                            # Create docker config dir if it doesn't exist
                            sudo mkdir -p /etc/docker
                            
                            # Create or update the daemon.json file
                            if [ -f /etc/docker/daemon.json ]; then
                                # File exists, need to merge configs
                                TMP_FILE=$(mktemp)
                                jq '. + {"insecure-registries": ["'${REGISTRY}'"]} | if .["insecure-registries"] | type == "array" and contains(["'${REGISTRY}'"]) | not then .["insecure-registries"] += ["'${REGISTRY}'"] else . end' /etc/docker/daemon.json > $TMP_FILE
                                sudo mv $TMP_FILE /etc/docker/daemon.json
                            else
                                # Create new config file
                                echo '{"insecure-registries": ["'${REGISTRY}'"]}' | sudo tee /etc/docker/daemon.json
                            fi
                            
                            # Restart Docker to apply changes
                            sudo systemctl restart docker
                            
                            # Wait for Docker to restart
                            sleep 10
                            echo "Docker daemon configured. Verifying docker service is running..."
                            sudo systemctl status docker --no-pager
                        fi
                    '''
                }
            }
        }

        stage('Security Scan - Backend') {
            steps {
                script {
                    echo "🔍 Running basic security checks on Go backend..."
                    sh '''
                        cd back-end
                        
                        echo "=== Basic Security Checks ==="
                        
                        # Check for hardcoded secrets/credentials
                        echo "Checking for hardcoded secrets..."
                        grep -r -i "password\\|secret\\|token\\|key\\|credential" --include="*.go" . || echo "✅ No obvious hardcoded secrets found"
                        
                        # Check for SQL injection patterns
                        echo "Checking for potential SQL injection patterns..."
                        grep -r "fmt\\.Sprintf.*SELECT\\|fmt\\.Sprintf.*INSERT\\|fmt\\.Sprintf.*UPDATE\\|fmt\\.Sprintf.*DELETE" --include="*.go" . || echo "✅ No obvious SQL injection patterns found"
                        
                        # Check for dangerous functions
                        echo "Checking for potentially dangerous functions..."
                        grep -r "exec\\.Command\\|os\\.Exec\\|unsafe\\." --include="*.go" . || echo "✅ No dangerous functions found"
                        
                        # Create basic security report
                        echo '{"status":"completed","type":"basic_security_check","findings":"manual_review_required"}' > security-report.json
                        
                        echo "✅ Basic security checks completed"
                    '''
                }
            }
        }

        stage('Build Backend') {
            steps {
                echo "🔨 Building Go backend..."
                sh '''
                    cd back-end
                    # Clean module cache to save space
                    go clean -modcache || true
                    
                    # Initialize go.mod if needed
                    go mod tidy
                    
                    # Build Go binary with optimizations for small size
                    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o server ./main.go
                    
                    # Verify binary size
                    ls -lh server
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo "🐳 Building Docker images..."
                    
                    sh '''
                        cd back-end
                        echo "Building backend image..."
                        docker build -t ${REGISTRY}/${BACKEND_IMAGE}:${BUILD_NUMBER} .
                        docker tag ${REGISTRY}/${BACKEND_IMAGE}:${BUILD_NUMBER} ${REGISTRY}/${BACKEND_IMAGE}:latest
                        
                        # Clean up build cache
                        docker system prune -f --filter "until=24h"
                    '''
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-registry-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                        echo "$PASS" | docker login ${REGISTRY} -u "$USER" --password-stdin
                        
                        echo "Pushing backend images..."
                        docker push ${REGISTRY}/${BACKEND_IMAGE}:${BUILD_NUMBER}
                        docker push ${REGISTRY}/${BACKEND_IMAGE}:latest
                        
                        docker logout ${REGISTRY}
                        
                        # Clean up local images after push to save space
                        docker rmi ${REGISTRY}/${BACKEND_IMAGE}:${BUILD_NUMBER} || true
                        docker rmi ${REGISTRY}/${BACKEND_IMAGE}:latest || true
                    '''
                }
            }
        }

        stage('Configure Kubernetes') {
            steps {
                script {
                    echo "🔧 Configuring Kubernetes to use insecure registry..."
                    sh '''
                        # Verify kubeconfig exists
                        if [ ! -f ${KUBECONFIG} ]; then
                            echo "Error: KUBECONFIG file not found at ${KUBECONFIG}!"
                            exit 1
                        fi
                        
                        # Configure k3s to use insecure registry if needed
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
                            
                            # Wait for k3s to restart
                            sleep 10
                        else
                            echo "K3s already configured for insecure registry."
                        fi
                        
                        # Verify kubectl access
                        echo "Testing kubectl connection..."
                        kubectl get nodes
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "🚀 Deploying to Kubernetes..."
                    sh '''
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
                        kubectl get pods -n ecommerce
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                // Archive security reports
                archiveArtifacts artifacts: '**/security-report.json', allowEmptyArchive: true
                
                // Aggressive cleanup to manage disk space
                sh '''
                    echo "Cleaning up to save disk space..."
                    
                    # Clean Docker resources but keep running containers
                    docker system prune -f --filter "until=24h"
                    docker builder prune -af
                    
                    # Clean Go cache
                    go clean -cache -modcache -testcache 2>/dev/null || true
                    
                    # Remove old build artifacts
                    find . -name "build" -type d -exec rm -rf {} + 2>/dev/null || true
                    
                    echo "Cleanup completed"
                '''
            }
        }
        success {
            echo "✅ Application successfully deployed!"
            script {
                sh '''
                    echo "🎉 Deployment successful!"
                    echo "Backend pods status:"
                    kubectl get pods -n ecommerce
                    
                    # Get backend service nodePort for information
                    BACKEND_PORT=$(kubectl get service ecommerce-backend-service -n ecommerce -o jsonpath="{.spec.ports[0].nodePort}")
                    echo "Backend API accessible at: http://10.34.100.141:$BACKEND_PORT"
                '''
            }
        }
        failure {
            echo "❌ Deployment failed!"
            script {
                sh '''
                    echo "Checking for issues..."
                    kubectl get pods -n ecommerce
                    kubectl logs -l app=ecommerce-backend -n ecommerce --tail=50 || true
                '''
            }
        }
    }
}