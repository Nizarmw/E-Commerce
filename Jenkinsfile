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
                                sleep 10
                            fi
                            
                            # Check connection again
                            curl -f http://${REGISTRY}/v2/ || {
                                echo "⚠️ Still cannot connect to Docker registry at ${REGISTRY}"
                                exit 1
                            }
                        }
                        echo "✅ Registry connection successful"
                    '''
                }
            }
        }

        stage('Build Go Binary') {
            steps {
                echo "🔨 Building Go backend..."
                sh '''
                    cd back-end
                    
                    # Clean previous builds
                    rm -f server
                    
                    # Initialize go.mod if needed
                    go mod tidy
                    
                    # Build Go binary with optimizations
                    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o server ./main.go
                    
                    # Verify binary
                    ls -lh server
                    file server
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "🐳 Building Docker image..."
                    
                    sh '''
                        cd back-end
                        echo "Building backend image with tag: ${BUILD_NUMBER}"
                        docker build -t ${REGISTRY}/${BACKEND_IMAGE}:${BUILD_NUMBER} .
                        docker tag ${REGISTRY}/${BACKEND_IMAGE}:${BUILD_NUMBER} ${REGISTRY}/${BACKEND_IMAGE}:latest
                        
                        # Show image size
                        docker images ${REGISTRY}/${BACKEND_IMAGE}:${BUILD_NUMBER}
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    echo "📤 Pushing Docker image to registry..."
                    sh '''
                        # Push images to registry
                        docker push ${REGISTRY}/${BACKEND_IMAGE}:${BUILD_NUMBER}
                        docker push ${REGISTRY}/${BACKEND_IMAGE}:latest
                        
                        # Verify image exists in registry
                        echo "✅ Verifying image in registry..."
                        curl -s http://${REGISTRY}/v2/${BACKEND_IMAGE}/tags/list | jq .
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "🚀 Deploying to Kubernetes..."
                    sh '''
                        cd back-end
                        
                        # Create namespace if it doesn't exist
                        kubectl create namespace ecommerce --dry-run=client -o yaml | kubectl apply -f -
                        
                        # Update image tag in deployment files
                        sed -i "s|image: 10.34.100.141:30500/ecommerce-backend:.*|image: 10.34.100.141:30500/ecommerce-backend:${BUILD_NUMBER}|g" kubernetes/backend-deployment.yaml
                        
                        # Apply configurations in order
                        echo "📋 Applying namespace..."
                        kubectl apply -f kubernetes/namespace.yaml
                        
                        echo "🗄️ Deploying database..."
                        kubectl apply -f kubernetes/database-deployment.yaml
                        kubectl apply -f kubernetes/database-service.yaml
                        
                        echo "⏳ Waiting for database to be ready..."
                        kubectl wait --for=condition=ready pod -l app=ecommerce-database -n ecommerce --timeout=180s || {
                            echo "⚠️ Database pod not ready, checking status..."
                            kubectl get pods -n ecommerce
                            kubectl logs -l app=ecommerce-database -n ecommerce --tail=20 || true
                        }
                        
                        echo "🔧 Deploying backend..."
                        kubectl apply -f kubernetes/backend-deployment.yaml
                        kubectl apply -f kubernetes/backend-service.yaml
                        
                        echo "⏳ Waiting for backend to be ready..."
                        kubectl wait --for=condition=ready pod -l app=ecommerce-backend -n ecommerce --timeout=120s || {
                            echo "⚠️ Backend pod not ready, checking status..."
                            kubectl get pods -n ecommerce
                            kubectl logs -l app=ecommerce-backend -n ecommerce --tail=20 || true
                        }
                        
                        # Show final status
                        echo "📊 Final deployment status:"
                        kubectl get pods,svc,endpoints -n ecommerce
                    '''
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                script {
                    echo "✅ Verifying deployment..."
                    sh '''
                        echo "⏳ Waiting for services to stabilize..."
                        sleep 20
                        
                        # Get service details
                        NODE_IP=$(hostname -I | awk '{print $1}')
                        NODE_PORT=$(kubectl get service ecommerce-backend-service -n ecommerce -o jsonpath="{.spec.ports[0].nodePort}" 2>/dev/null || echo "30080")
                        
                        echo "🌐 Backend API should be accessible at: http://${NODE_IP}:${NODE_PORT}"
                        
                        # Test API endpoint with retries
                        echo "🔍 Testing API endpoint..."
                        for i in {1..5}; do
                            if curl -f -s --max-time 10 http://${NODE_IP}:${NODE_PORT}/health; then
                                echo "✅ API health check successful!"
                                break
                            else
                                echo "⚠️ Attempt $i failed, retrying in 10 seconds..."
                                sleep 10
                            fi
                        done
                        
                        # Additional diagnostics
                        echo "🔍 Service endpoints:"
                        kubectl get endpoints -n ecommerce
                        
                        echo "🔍 Pod logs (last 10 lines):"
                        kubectl logs -l app=ecommerce-backend -n ecommerce --tail=10 || echo "No backend logs available"
                        
                        # Check if NodePort is accessible
                        echo "🔍 Checking if port ${NODE_PORT} is accessible:"
                        netstat -tulpn | grep ":${NODE_PORT}" || echo "Port ${NODE_PORT} not found in netstat"
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                echo "🧹 Cleaning up..."
                sh '''
                    # Clean up old Docker images (keep last 3 builds)
                    docker images ${REGISTRY}/${BACKEND_IMAGE} --format "table {{.Tag}}" | grep -E "^[0-9]+$" | sort -nr | tail -n +4 | xargs -r -I {} docker rmi ${REGISTRY}/${BACKEND_IMAGE}:{} || true
                    
                    # Show final status
                    echo "📊 Final cluster status:"
                    kubectl get all -n ecommerce || true
                '''
            }
        }
        success {
            echo "✅ Backend deployment successful! 🎉"
            script {
                sh '''
                    NODE_IP=$(hostname -I | awk '{print $1}')
                    NODE_PORT=$(kubectl get service ecommerce-backend-service -n ecommerce -o jsonpath="{.spec.ports[0].nodePort}" 2>/dev/null || echo "30080")
                    echo "🌐 Backend API is running at: http://${NODE_IP}:${NODE_PORT}"
                    echo "📝 Build #${BUILD_NUMBER} deployed successfully"
                '''
            }
        }
        failure {
            echo "❌ Backend deployment failed! 😞"
            script {
                sh '''
                    echo "🔍 Debugging information:"
                    kubectl get pods -n ecommerce -o wide || true
                    kubectl get events -n ecommerce --sort-by=.metadata.creationTimestamp || true
                '''
            }
        }
    }
}