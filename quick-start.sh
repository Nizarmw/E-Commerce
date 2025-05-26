#!/bin/bash

# Quick Start Script untuk E-Commerce Development
# Author: DevSec Team

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

echo "🚀 E-Commerce Development Quick Start"
echo "====================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_warning "Docker is not running. Please start Docker first."
    exit 1
fi

print_header "Checking Environment Files"

# Check if .env files exist
if [ ! -f "back-end/.env" ]; then
    print_warning "back-end/.env not found. Please create it with your database credentials."
    echo "Required variables: DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, JWT_SECRET"
    exit 1
else
    print_status "back-end/.env found"
fi

if [ ! -f "front-end/.env" ]; then
    print_warning "front-end/.env not found. Please create it with your API configuration."
    echo "Required variables: VITE_API_URL"
    exit 1
else
    print_status "front-end/.env found"
fi

print_header "Building and Starting Backend Services"

# Stop existing containers
cd back-end
docker-compose down 2>/dev/null || true

# Build and start services using existing docker-compose.yml
docker-compose up --build -d
cd ..

print_header "Waiting for Services to Start"

# Wait for Database
print_status "Waiting for database to be ready..."
timeout 60 bash -c 'until docker exec db_ecommerce mariadb -u root -p${DB_PASS} -e "SELECT 1" > /dev/null 2>&1; do sleep 2; done' || print_warning "Database check timeout"

# Wait for Backend
print_status "Waiting for Backend API to be ready..."
timeout 60 bash -c 'until curl -s http://localhost:8080/health > /dev/null 2>&1; do sleep 2; done' || print_warning "Backend health check timeout - may still be starting"

print_header "Starting Frontend Development Server"
cd front-end
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
fi

npm run dev &
FRONTEND_PID=$!
cd ..

print_header "Development Environment Ready!"
echo ""
print_status "Frontend: http://localhost:3000 (or check console for actual port)"
print_status "Backend API: http://localhost:8080"
print_status "Database: localhost:3306 (MariaDB)"
echo ""
print_status "Useful commands:"
echo "  cd back-end && docker-compose logs -f                    # View backend logs"
echo "  cd back-end && docker-compose down                       # Stop backend services"
echo "  cd back-end && docker-compose restart                    # Restart backend services"
echo "  kill $FRONTEND_PID                                       # Stop frontend dev server"
echo ""
print_status "Happy coding! 🎉"
print_status "Press Ctrl+C to stop the frontend development server"

# Wait for frontend process
wait $FRONTEND_PID