# 🚀 Peppermint Production Deployment Script (PowerShell)
# Phase 7: Final Deployment

param(
    [string]$DBPassword = "",
    [string]$Secret = "",
    [string]$ClientPort = "1000",
    [string]$ApiPort = "1001"
)

# Set error action preference
$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Peppermint Production Deployment..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if Docker is installed
function Test-DockerInstallation {
    Write-Status "Checking Docker installation..."
    
    try {
        $dockerVersion = docker --version
        Write-Success "Docker is installed: $dockerVersion"
    }
    catch {
        Write-Error "Docker is not installed. Please install Docker Desktop first."
        exit 1
    }
    
    try {
        $composeVersion = docker-compose --version
        Write-Success "Docker Compose is installed: $composeVersion"
    }
    catch {
        Write-Error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    }
}

# Check if production compose file exists
function Test-DeploymentFiles {
    Write-Status "Checking deployment files..."
    
    if (-not (Test-Path "docker-compose.prod.yml")) {
        Write-Error "docker-compose.prod.yml not found"
        exit 1
    }
    
    if (-not (Test-Path "DEPLOYMENT_CHECKLIST.md")) {
        Write-Warning "DEPLOYMENT_CHECKLIST.md not found - deployment checklist not available"
    }
    
    Write-Success "Deployment files are ready"
}

# Set environment variables
function Set-EnvironmentVariables {
    Write-Status "Setting up environment variables..."
    
    # Generate secure secrets if not provided
    if ([string]::IsNullOrEmpty($DBPassword)) {
        $DBPassword = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
        Write-Warning "DB_PASSWORD not set, generated secure password"
    }
    
    if ([string]::IsNullOrEmpty($Secret)) {
        $Secret = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))
        Write-Warning "SECRET not set, generated secure secret"
    }
    
    # Set environment variables
    $env:DB_PASSWORD = $DBPassword
    $env:SECRET = $Secret
    $env:CLIENT_PORT = $ClientPort
    $env:API_PORT = $ApiPort
    
    Write-Success "Environment variables configured"
}

# Stop existing containers
function Stop-ExistingContainers {
    Write-Status "Stopping existing containers..."
    
    try {
        $containers = docker-compose -f docker-compose.prod.yml ps --format json | ConvertFrom-Json
        if ($containers.State -contains "Up") {
            docker-compose -f docker-compose.prod.yml down
            Write-Success "Existing containers stopped"
        }
        else {
            Write-Status "No existing containers found"
        }
    }
    catch {
        Write-Status "No existing containers found"
    }
}

# Build and start services
function Deploy-Services {
    Write-Status "Building and starting services..."
    
    try {
        # Pull latest images
        docker-compose -f docker-compose.prod.yml pull
        
        # Build services
        docker-compose -f docker-compose.prod.yml build --no-cache
        
        # Start services
        docker-compose -f docker-compose.prod.yml up -d
        
        Write-Success "Services deployed successfully"
    }
    catch {
        Write-Error "Failed to deploy services: $($_.Exception.Message)"
        exit 1
    }
}

# Wait for services to be healthy
function Wait-ForHealth {
    Write-Status "Waiting for services to be healthy..."
    
    # Wait for database
    Write-Status "Waiting for database to be ready..."
    $timeout = 60
    $dbReady = $false
    
    while ($timeout -gt 0 -and -not $dbReady) {
        try {
            docker-compose -f docker-compose.prod.yml exec -T peppermint_postgres_prod pg_isready -U peppermint_prod | Out-Null
            $dbReady = $true
            Write-Success "Database is healthy"
        }
        catch {
            Start-Sleep -Seconds 5
            $timeout -= 5
        }
    }
    
    if (-not $dbReady) {
        Write-Error "Database health check failed"
        exit 1
    }
    
    # Wait for application
    Write-Status "Waiting for application to be ready..."
    $timeout = 120
    $appReady = $false
    
    while ($timeout -gt 0 -and -not $appReady) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$ApiPort/api/v1/health" -UseBasicParsing -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                $appReady = $true
                Write-Success "Application is healthy"
            }
        }
        catch {
            Start-Sleep -Seconds 5
            $timeout -= 5
        }
    }
    
    if (-not $appReady) {
        Write-Error "Application health check failed"
        exit 1
    }
}

# Run health checks
function Test-HealthChecks {
    Write-Status "Running health checks..."
    
    # Check API health
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$ApiPort/api/v1/health" -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Success "API health check passed"
        }
        else {
            Write-Error "API health check failed"
            exit 1
        }
    }
    catch {
        Write-Error "API health check failed: $($_.Exception.Message)"
        exit 1
    }
    
    # Check client accessibility
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$ClientPort" -UseBasicParsing
        Write-Success "Client accessibility check passed"
    }
    catch {
        Write-Error "Client accessibility check failed: $($_.Exception.Message)"
        exit 1
    }
    
    # Check container status
    try {
        $containers = docker-compose -f docker-compose.prod.yml ps --format json | ConvertFrom-Json
        if ($containers.State -contains "Up") {
            Write-Success "All containers are running"
        }
        else {
            Write-Error "Some containers are not running"
            exit 1
        }
    }
    catch {
        Write-Error "Failed to check container status"
        exit 1
    }
}

# Display deployment information
function Show-DeploymentInfo {
    Write-Host ""
    Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
    Write-Host "======================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Service Information:" -ForegroundColor Cyan
    Write-Host "  • Client Application: http://localhost:$ClientPort" -ForegroundColor White
    Write-Host "  • API Endpoints: http://localhost:$ApiPort" -ForegroundColor White
    Write-Host "  • Health Check: http://localhost:$ApiPort/api/v1/health" -ForegroundColor White
    Write-Host ""
    Write-Host "🔐 Default Credentials:" -ForegroundColor Cyan
    Write-Host "  • Admin Email: admin@admin.com" -ForegroundColor White
    Write-Host "  • Admin Password: 1234" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Useful Commands:" -ForegroundColor Cyan
    Write-Host "  • View logs: docker-compose -f docker-compose.prod.yml logs -f" -ForegroundColor White
    Write-Host "  • Stop services: docker-compose -f docker-compose.prod.yml down" -ForegroundColor White
    Write-Host "  • Restart services: docker-compose -f docker-compose.prod.yml restart" -ForegroundColor White
    Write-Host "  • Check status: docker-compose -f docker-compose.prod.yml ps" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  Important Notes:" -ForegroundColor Yellow
    Write-Host "  • Change default admin password after first login" -ForegroundColor White
    Write-Host "  • Configure SSL certificates for production use" -ForegroundColor White
    Write-Host "  • Set up automated backups" -ForegroundColor White
    Write-Host "  • Monitor system performance" -ForegroundColor White
    Write-Host ""
}

# Main deployment function
function Start-Deployment {
    Write-Host "🚀 Peppermint Production Deployment" -ForegroundColor Cyan
    Write-Host "===================================" -ForegroundColor Cyan
    Write-Host ""
    
    Test-DockerInstallation
    Test-DeploymentFiles
    Set-EnvironmentVariables
    Stop-ExistingContainers
    Deploy-Services
    Wait-ForHealth
    Test-HealthChecks
    Show-DeploymentInfo
    
    Write-Success "Deployment completed successfully!"
    Write-Status "System is now ready for production use"
}

# Run main deployment function
Start-Deployment 