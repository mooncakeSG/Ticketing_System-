#!/bin/bash

# 🚀 Peppermint Production Deployment Script
# Phase 7: Final Deployment

set -e  # Exit on any error

echo "🚀 Starting Peppermint Production Deployment..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker Desktop first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if production compose file exists
check_files() {
    print_status "Checking deployment files..."
    
    if [ ! -f "docker-compose.prod.yml" ]; then
        print_error "docker-compose.prod.yml not found"
        exit 1
    fi
    
    if [ ! -f "DEPLOYMENT_CHECKLIST.md" ]; then
        print_warning "DEPLOYMENT_CHECKLIST.md not found - deployment checklist not available"
    fi
    
    print_success "Deployment files are ready"
}

# Set environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    # Generate secure secrets if not provided
    if [ -z "$DB_PASSWORD" ]; then
        export DB_PASSWORD=$(openssl rand -base64 32)
        print_warning "DB_PASSWORD not set, generated secure password"
    fi
    
    if [ -z "$SECRET" ]; then
        export SECRET=$(openssl rand -base64 64)
        print_warning "SECRET not set, generated secure secret"
    fi
    
    # Set default ports if not provided
    export CLIENT_PORT=${CLIENT_PORT:-1000}
    export API_PORT=${API_PORT:-1001}
    
    print_success "Environment variables configured"
}

# Stop existing containers
stop_existing() {
    print_status "Stopping existing containers..."
    
    if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        docker-compose -f docker-compose.prod.yml down
        print_success "Existing containers stopped"
    else
        print_status "No existing containers found"
    fi
}

# Build and start services
deploy_services() {
    print_status "Building and starting services..."
    
    # Pull latest images
    docker-compose -f docker-compose.prod.yml pull
    
    # Build services
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    # Start services
    docker-compose -f docker-compose.prod.yml up -d
    
    print_success "Services deployed successfully"
}

# Wait for services to be healthy
wait_for_health() {
    print_status "Waiting for services to be healthy..."
    
    # Wait for database
    print_status "Waiting for database to be ready..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if docker-compose -f docker-compose.prod.yml exec -T peppermint_postgres_prod pg_isready -U peppermint_prod > /dev/null 2>&1; then
            print_success "Database is healthy"
            break
        fi
        sleep 5
        timeout=$((timeout - 5))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "Database health check failed"
        exit 1
    fi
    
    # Wait for application
    print_status "Waiting for application to be ready..."
    timeout=120
    while [ $timeout -gt 0 ]; do
        if curl -f http://localhost:$API_PORT/api/v1/health > /dev/null 2>&1; then
            print_success "Application is healthy"
            break
        fi
        sleep 5
        timeout=$((timeout - 5))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "Application health check failed"
        exit 1
    fi
}

# Run health checks
run_health_checks() {
    print_status "Running health checks..."
    
    # Check API health
    if curl -f http://localhost:$API_PORT/api/v1/health > /dev/null 2>&1; then
        print_success "API health check passed"
    else
        print_error "API health check failed"
        exit 1
    fi
    
    # Check client accessibility
    if curl -f http://localhost:$CLIENT_PORT > /dev/null 2>&1; then
        print_success "Client accessibility check passed"
    else
        print_error "Client accessibility check failed"
        exit 1
    fi
    
    # Check container status
    if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        print_success "All containers are running"
    else
        print_error "Some containers are not running"
        exit 1
    fi
}

# Display deployment information
show_deployment_info() {
    echo ""
    echo "🎉 Deployment Complete!"
    echo "======================"
    echo ""
    echo "📊 Service Information:"
    echo "  • Client Application: http://localhost:$CLIENT_PORT"
    echo "  • API Endpoints: http://localhost:$API_PORT"
    echo "  • Health Check: http://localhost:$API_PORT/api/v1/health"
    echo ""
    echo "🔐 Default Credentials:"
    echo "  • Admin Email: admin@admin.com"
    echo "  • Admin Password: 1234"
    echo ""
    echo "📋 Useful Commands:"
    echo "  • View logs: docker-compose -f docker-compose.prod.yml logs -f"
    echo "  • Stop services: docker-compose -f docker-compose.prod.yml down"
    echo "  • Restart services: docker-compose -f docker-compose.prod.yml restart"
    echo "  • Check status: docker-compose -f docker-compose.prod.yml ps"
    echo ""
    echo "⚠️  Important Notes:"
    echo "  • Change default admin password after first login"
    echo "  • Configure SSL certificates for production use"
    echo "  • Set up automated backups"
    echo "  • Monitor system performance"
    echo ""
}

# Main deployment function
main() {
    echo "🚀 Peppermint Production Deployment"
    echo "==================================="
    echo ""
    
    check_docker
    check_files
    setup_environment
    stop_existing
    deploy_services
    wait_for_health
    run_health_checks
    show_deployment_info
    
    print_success "Deployment completed successfully!"
    print_status "System is now ready for production use"
}

# Run main function
main "$@" 