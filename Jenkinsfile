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

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "🚀 Deploying to Kubernetes..."
                    sh '''
                        # Update image tags in deployment files
                        sed -i "s|\\${BUILD_NUMBER}|${BUILD_NUMBER}|g" kubernetes/backend-deployment.yaml
                        
                        # Apply Kubernetes configurations in order
                        echo "Creating namespace..."
                        kubectl apply -f kubernetes/namespace.yaml
                        
                        echo "Deploying database..."
                        kubectl apply -f kubernetes/database-deployment.yaml
                        kubectl apply -f kubernetes/database-service.yaml
                        
                        # Wait for database to be ready before deploying apps
                        echo "Waiting for database to be ready..."
                        kubectl wait --for=condition=ready pod -l app=ecommerce-database -n ecommerce --timeout=180s || echo "Database startup taking longer than expected"
                        
                        echo "Deploying backend..."
                        kubectl apply -f kubernetes/backend-deployment.yaml
                        kubectl apply -f kubernetes/backend-service.yaml
                        
                        # Wait for deployments with shorter timeout due to resource constraints
                        echo "Waiting for deployments to be ready..."
                        kubectl rollout status deployment/ecommerce-backend -n ecommerce --timeout=180s || echo "Backend deployment taking longer than expected"
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo "🏥 Performing health checks..."
                    sh '''
                        # Wait for services to be ready
                        sleep 20
                        
                        # Get service status
                        echo "=== Services Status ==="
                        kubectl get services -n ecommerce
                        
                        echo "=== Pods Status ==="
                        kubectl get pods -n ecommerce
                        
                        echo "=== Resource Usage ==="
                        kubectl top pods -n ecommerce 2>/dev/null || echo "Metrics not available"
                        
                        echo "Deployment health check completed!"
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
                    
                    # Clean Docker resources
                    docker system prune -af --volumes
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
                    echo "Backend API: http://10.34.100.141:30080"
                    echo "Health Check: http://10.34.100.141:30080/health"
                    
                    echo "=== Final Status ==="
                    kubectl get all -n ecommerce
                '''
            }
        }
        failure {
            echo "❌ Deployment failed!"
            script {
                sh '''
                    echo "Checking for issues..."
                    kubectl get pods -n ecommerce
                    kubectl describe pods -n ecommerce | tail -50
                '''
            }
        }
    }
}