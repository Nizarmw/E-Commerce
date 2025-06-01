pipeline {
    agent any

    environment {
        REGISTRY = "10.34.100.141:30500"
        BACKEND_IMAGE = "ecommerce-backend"
        FRONTEND_IMAGE = "ecommerce-frontend"
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
            }        }
        
        stage('Network Diagnostics') {
            steps {
                echo "🌐 Running network diagnostics..."
                sh '''
                    echo "🔍 Testing DNS resolution..."
                    nslookup google.com || echo "⚠️ Google DNS test failed"
                    nslookup registry.npmjs.org || echo "⚠️ NPM registry DNS failed"
                    nslookup proxy.golang.org || echo "⚠️ Go proxy DNS failed"
                    nslookup dl-cdn.alpinelinux.org || echo "⚠️ Alpine DNS failed"
                    
                    echo "🌍 Testing connectivity..."
                    curl -s --connect-timeout 5 --max-time 15 https://google.com && echo "✅ Google reachable" || echo "❌ Google unreachable"
                    curl -s --connect-timeout 5 --max-time 15 https://registry.npmjs.org/ && echo "✅ NPM registry reachable" || echo "❌ NPM registry unreachable"
                    curl -s --connect-timeout 5 --max-time 15 https://proxy.golang.org && echo "✅ Go proxy reachable" || echo "❌ Go proxy unreachable"
                    curl -s --connect-timeout 5 --max-time 15 http://dl-cdn.alpinelinux.org/alpine/latest-stable/main/ && echo "✅ Alpine repo reachable" || echo "❌ Alpine repo unreachable"
                    
                    echo "🐳 Docker daemon info..."
                    docker version
                    
                    echo "📊 Network configuration..."
                    cat /etc/resolv.conf || echo "Cannot read resolv.conf"
                    ip route show || echo "Cannot show routes"
                '''
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

        stage('Build Frontend') {
            steps {
                echo "🎨 Building Frontend..."
                sh '''
                    cd front-end
                    
                    # Ensure production environment file exists
                    if [ ! -f .env.production ]; then
                        echo "Creating production environment file..."
                        echo "VITE_API_URL=http://10.34.100.141:30080" > .env.production
                    fi
                    
                    # Install dependencies
                    npm ci
                    
                    # Build the frontend with production environment
                    cp .env.production .env
                    npm run build
                    
                    # Verify build output
                    ls -la dist/
                '''
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        script {
                            echo "🐳 Building Backend Docker image..."
                            
                            sh '''
                                cd back-end
                                
                                # Test network connectivity before building
                                echo "🌐 Testing network connectivity..."
                                curl -s --connect-timeout 10 --max-time 30 https://proxy.golang.org || echo "⚠️ Go proxy connection issues"
                                curl -s --connect-timeout 10 --max-time 30 http://dl-cdn.alpinelinux.org/alpine/latest-stable/main/ || echo "⚠️ Alpine repository connection issues"
                                
                                echo "Building backend image with tag: ${BUILD_NUMBER}"
                                
                                # Build with retry mechanism
                                for i in 1 2 3; do
                                    echo "Attempt $i: Building Docker image..."
                                    if docker build --network=host -t ${REGISTRY}/${BACKEND_IMAGE}:${BUILD_NUMBER} .; then
                                        echo "✅ Backend build successful on attempt $i"
                                        break
                                    else
                                        echo "❌ Backend build failed on attempt $i"
                                        if [ $i -eq 3 ]; then
                                            echo "💥 All backend build attempts failed"
                                            exit 1
                                        fi
                                        echo "⏳ Waiting 30 seconds before retry..."
                                        sleep 30
                                    fi
                                done
                                
                                docker tag ${REGISTRY}/${BACKEND_IMAGE}:${BUILD_NUMBER} ${REGISTRY}/${BACKEND_IMAGE}:latest
                                
                                # Show image size
                                docker images ${REGISTRY}/${BACKEND_IMAGE}:${BUILD_NUMBER}
                            '''
                        }
                    }
                }
                stage('Build Frontend Image') {
                    steps {
                        script {
                            echo "🎨 Building Frontend Docker image..."
                            
                            sh '''
                                cd front-end
                                
                                # Test network connectivity before building
                                echo "🌐 Testing network connectivity..."
                                curl -s --connect-timeout 10 --max-time 30 https://registry.npmjs.org/ || echo "⚠️ NPM registry connection issues"
                                curl -s --connect-timeout 10 --max-time 30 https://nginx.org/ || echo "⚠️ Nginx connection issues"
                                
                                echo "Building frontend image with tag: ${BUILD_NUMBER}"
                                
                                # Build with retry mechanism  
                                for i in 1 2 3; do
                                    echo "Attempt $i: Building Docker image..."
                                    if docker build --network=host -t ${REGISTRY}/${FRONTEND_IMAGE}:${BUILD_NUMBER} .; then
                                        echo "✅ Frontend build successful on attempt $i"
                                        break
                                    else
                                        echo "❌ Frontend build failed on attempt $i"
                                        if [ $i -eq 3 ]; then
                                            echo "💥 All frontend build attempts failed"
                                            exit 1
                                        fi
                                        echo "⏳ Waiting 30 seconds before retry..."
                                        sleep 30
                                    fi
                                done
                                
                                docker tag ${REGISTRY}/${FRONTEND_IMAGE}:${BUILD_NUMBER} ${REGISTRY}/${FRONTEND_IMAGE}:latest
                                
                                # Show image size
                                docker images ${REGISTRY}/${FRONTEND_IMAGE}:${BUILD_NUMBER}
                            '''
                        }
                    }
                }
            }
        }

        stage('Push Docker Images') {
            parallel {
                stage('Push Backend Image') {
                    steps {
                        script {
                            echo "📤 Pushing Backend Docker image to registry..."
                            sh '''
                                # Push backend images to registry
                                docker push ${REGISTRY}/${BACKEND_IMAGE}:${BUILD_NUMBER}
                                docker push ${REGISTRY}/${BACKEND_IMAGE}:latest
                                
                                # Verify backend image exists in registry
                                echo "✅ Verifying backend image in registry..."
                                curl -s http://${REGISTRY}/v2/${BACKEND_IMAGE}/tags/list | jq .
                            '''
                        }
                    }
                }
                stage('Push Frontend Image') {
                    steps {
                        script {
                            echo "📤 Pushing Frontend Docker image to registry..."
                            sh '''
                                # Push frontend images to registry
                                docker push ${REGISTRY}/${FRONTEND_IMAGE}:${BUILD_NUMBER}
                                docker push ${REGISTRY}/${FRONTEND_IMAGE}:latest
                                
                                # Verify frontend image exists in registry
                                echo "✅ Verifying frontend image in registry..."
                                curl -s http://${REGISTRY}/v2/${FRONTEND_IMAGE}/tags/list | jq .
                            '''
                        }
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "🚀 Deploying to Kubernetes..."
                    sh '''                        cd back-end
                        
                        # Create namespace if it doesn't exist
                        kubectl create namespace ecommerce --dry-run=client -o yaml | kubectl apply -f -
                        
                        # Update image tag in deployment files
                        sed -i "s|image: 10.34.100.141:30500/ecommerce-backend:.*|image: 10.34.100.141:30500/ecommerce-backend:${BUILD_NUMBER}|g" kubernetes/backend-deployment.yaml
                        sed -i "s|image: 10.34.100.141:30500/ecommerce-frontend:.*|image: 10.34.100.141:30500/ecommerce-frontend:${BUILD_NUMBER}|g" kubernetes/frontend-deployment.yaml
                        
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
                        
                        echo "🎨 Deploying frontend..."
                        kubectl apply -f kubernetes/frontend-deployment.yaml
                        kubectl apply -f kubernetes/frontend-service.yaml
                        
                        echo "⏳ Waiting for backend to be ready..."
                        kubectl wait --for=condition=ready pod -l app=ecommerce-backend -n ecommerce --timeout=120s || {
                            echo "⚠️ Backend pod not ready, checking status..."
                            kubectl get pods -n ecommerce
                            kubectl logs -l app=ecommerce-backend -n ecommerce --tail=20 || true
                        }
                        
                        echo "⏳ Waiting for frontend to be ready..."
                        kubectl wait --for=condition=ready pod -l app=ecommerce-frontend -n ecommerce --timeout=120s || {
                            echo "⚠️ Frontend pod not ready, checking status..."
                            kubectl get pods -n ecommerce
                            kubectl logs -l app=ecommerce-frontend -n ecommerce --tail=20 || true
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
                    sh '''                        echo "⏳ Waiting for services to stabilize..."
                        sleep 20
                        
                        # Get service details
                        NODE_IP=$(hostname -I | awk '{print $1}')
                        BACKEND_PORT=$(kubectl get service ecommerce-backend-service -n ecommerce -o jsonpath="{.spec.ports[0].nodePort}" 2>/dev/null || echo "30080")
                        FRONTEND_PORT=$(kubectl get service ecommerce-frontend-service -n ecommerce -o jsonpath="{.spec.ports[0].nodePort}" 2>/dev/null || echo "30090")
                        
                        echo "🌐 Backend API should be accessible at: http://${NODE_IP}:${BACKEND_PORT}"
                        echo "🌐 Frontend Web should be accessible at: http://${NODE_IP}:${FRONTEND_PORT}"
                        
                        # Test API endpoint with retries
                        echo "🔍 Testing Backend API endpoint..."
                        for i in {1..5}; do
                            if curl -f -s --max-time 10 http://${NODE_IP}:${BACKEND_PORT}/health; then
                                echo "✅ Backend API health check successful!"
                                break
                            else
                                echo "⚠️ Backend attempt $i failed, retrying in 10 seconds..."
                                sleep 10
                            fi
                        done
                        
                        # Test Frontend endpoint with retries
                        echo "🔍 Testing Frontend endpoint..."
                        for i in {1..5}; do
                            if curl -f -s --max-time 10 http://${NODE_IP}:${FRONTEND_PORT}/; then
                                echo "✅ Frontend health check successful!"
                                break
                            else
                                echo "⚠️ Frontend attempt $i failed, retrying in 10 seconds..."
                                sleep 10
                            fi
                        done
                          # Additional diagnostics
                        echo "🔍 Service endpoints:"
                        kubectl get endpoints -n ecommerce
                        
                        echo "🔍 Backend Pod logs (last 10 lines):"
                        kubectl logs -l app=ecommerce-backend -n ecommerce --tail=10 || echo "No backend logs available"
                        
                        echo "🔍 Frontend Pod logs (last 10 lines):"
                        kubectl logs -l app=ecommerce-frontend -n ecommerce --tail=10 || echo "No frontend logs available"
                        
                        # Check if NodePorts are accessible
                        echo "🔍 Checking if backend port ${BACKEND_PORT} is accessible:"
                        netstat -tulpn | grep ":${BACKEND_PORT}" || echo "Backend port ${BACKEND_PORT} not found in netstat"
                        
                        echo "🔍 Checking if frontend port ${FRONTEND_PORT} is accessible:"
                        netstat -tulpn | grep ":${FRONTEND_PORT}" || echo "Frontend port ${FRONTEND_PORT} not found in netstat"
                    '''                }
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
                    docker images ${REGISTRY}/${FRONTEND_IMAGE} --format "table {{.Tag}}" | grep -E "^[0-9]+$" | sort -nr | tail -n +4 | xargs -r -I {} docker rmi ${REGISTRY}/${FRONTEND_IMAGE}:{} || true
                    
                    # Show final status
                    echo "📊 Final cluster status:"
                    kubectl get all -n ecommerce || true
                '''
            }
        }
        success {
            echo "✅ Full stack deployment successful! 🎉"
            script {
                sh '''
                    NODE_IP=$(hostname -I | awk '{print $1}')
                    BACKEND_PORT=$(kubectl get service ecommerce-backend-service -n ecommerce -o jsonpath="{.spec.ports[0].nodePort}" 2>/dev/null || echo "30080")
                    FRONTEND_PORT=$(kubectl get service ecommerce-frontend-service -n ecommerce -o jsonpath="{.spec.ports[0].nodePort}" 2>/dev/null || echo "30090")
                    echo "🌐 Frontend Web App: http://${NODE_IP}:${FRONTEND_PORT}"
                    echo "🌐 Backend API: http://${NODE_IP}:${BACKEND_PORT}"
                    echo "📝 Build #${BUILD_NUMBER} deployed successfully"
                '''
            }
        }
        failure {
            echo "❌ Full stack deployment failed! 😞"
            script {
                sh '''
                    echo "🔍 Debugging information:"
                    kubectl get pods -n ecommerce -o wide || true
                    kubectl get events -n ecommerce --sort-by=.metadata.creationTimestamp || true
                    echo "🔍 Frontend logs:"
                    kubectl logs -l app=ecommerce-frontend -n ecommerce --tail=50 || true
                    echo "🔍 Backend logs:"
                    kubectl logs -l app=ecommerce-backend -n ecommerce --tail=50 || true
                '''
            }
        }
    }
}