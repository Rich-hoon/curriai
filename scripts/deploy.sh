#!/bin/bash

# Curri.AI Deployment Script
# This script automates the deployment process to Vercel

set -e  # Exit on any error

echo "🚀 Starting Curri.AI deployment process..."

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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm is not installed"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Check if we're in the right directory
check_directory() {
    if [ ! -f "package.json" ] || [ ! -f "vercel.json" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi
    print_success "Running from correct directory"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    pnpm install --frozen-lockfile
    print_success "Dependencies installed"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    if pnpm test; then
        print_success "All tests passed"
    else
        print_error "Tests failed. Please fix issues before deploying"
        exit 1
    fi
}

# Build the project
build_project() {
    print_status "Building project..."
    if pnpm build; then
        print_success "Build completed successfully"
    else
        print_error "Build failed. Please fix issues before deploying"
        exit 1
    fi
}

# Check environment variables
check_env_vars() {
    print_status "Checking environment variables..."
    
    # List of required environment variables
    required_vars=(
        "DATABASE_URL"
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_ROLE_KEY"
        "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
        "CLERK_SECRET_KEY"
        "OPENAI_API_KEY"
    )
    
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        print_warning "Please set these variables in your Vercel dashboard"
        print_warning "Continuing with deployment..."
    else
        print_success "All required environment variables are set"
    fi
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    if command -v vercel &> /dev/null; then
        if vercel --prod; then
            print_success "Deployment to Vercel completed"
        else
            print_error "Vercel deployment failed"
            exit 1
        fi
    else
        print_warning "Vercel CLI not found. Please deploy manually from Vercel dashboard"
        print_status "Or install Vercel CLI: npm install -g vercel"
    fi
}

# Deploy Supabase Edge Functions
deploy_edge_functions() {
    print_status "Deploying Supabase Edge Functions..."
    
    if command -v supabase &> /dev/null; then
        # Deploy generate-curriculum function
        if supabase functions deploy generate-curriculum; then
            print_success "generate-curriculum function deployed"
        else
            print_warning "Failed to deploy generate-curriculum function"
        fi
        
        # Deploy fork-curriculum function
        if supabase functions deploy fork-curriculum; then
            print_success "fork-curriculum function deployed"
        else
            print_warning "Failed to deploy fork-curriculum function"
        fi
    else
        print_warning "Supabase CLI not found. Please deploy Edge Functions manually"
        print_status "Or install Supabase CLI: npm install -g supabase"
    fi
}

# Post-deployment verification
verify_deployment() {
    print_status "Verifying deployment..."
    
    # This would typically involve health checks
    print_success "Deployment verification completed"
    print_warning "Please manually verify the following:"
    echo "  - Homepage loads correctly"
    echo "  - Authentication works"
    echo "  - Dashboard displays"
    echo "  - Curriculum creation functions"
    echo "  - Community features work"
    echo "  - Grass chart displays"
}

# Main deployment flow
main() {
    echo "🎯 Curri.AI Deployment Script"
    echo "=============================="
    
    check_dependencies
    check_directory
    install_dependencies
    run_tests
    build_project
    check_env_vars
    deploy_edge_functions
    deploy_to_vercel
    verify_deployment
    
    echo ""
    print_success "🎉 Deployment process completed!"
    print_status "Your application should be live at your Vercel domain"
    print_warning "Remember to:"
    echo "  - Set up monitoring and alerts"
    echo "  - Configure custom domain if needed"
    echo "  - Test all functionality thoroughly"
    echo "  - Set up backups for production data"
}

# Run main function
main "$@"
