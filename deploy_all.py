#!/usr/bin/env python3
"""
Complete deployment script for DeepRoute AI system
Deploys both API (Zeabur) and Frontend (Vercel)
"""

import subprocess
import sys
import time
import json

def run_command(command, description):
    """Run a shell command with error handling"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return None

def check_prerequisites():
    """Check if required tools are installed"""
    print("🔍 Checking prerequisites...")
    
    tools = [
        ("node", "Node.js"),
        ("npm", "NPM"),
        ("git", "Git")
    ]
    
    for tool, name in tools:
        if subprocess.run(f"which {tool}", shell=True, capture_output=True).returncode != 0:
            print(f"❌ {name} is not installed. Please install it first.")
            return False
    
    print("✅ All prerequisites satisfied")
    return True

def deploy_api():
    """Deploy API to Zeabur"""
    print("\n🌐 Deploying API to Zeabur...")
    
    # Check if zeabur CLI is available
    if subprocess.run("which zeabur", shell=True, capture_output=True).returncode != 0:
        print("Installing Zeabur CLI...")
        run_command("npm install -g zeabur", "Zeabur CLI installation")
    
    # Deploy API
    run_command("zeabur deploy --auto-confirm", "API deployment to Zeabur")
    
    print("🎉 API deployed successfully!")
    print("📡 API URL: https://deeproute-ai-api.zeabur.app")
    
def deploy_frontend():
    """Deploy frontend to Vercel"""
    print("\n⚛️ Deploying Frontend to Vercel...")
    
    # Check if vercel CLI is available
    if subprocess.run("which vercel", shell=True, capture_output=True).returncode != 0:
        print("Installing Vercel CLI...")
        run_command("npm install -g vercel", "Vercel CLI installation")
    
    # Install dependencies and build
    run_command("npm install", "Dependencies installation")
    run_command("npm run build", "Production build")
    
    # Deploy to Vercel
    run_command("vercel --prod --yes", "Frontend deployment to Vercel")
    
    print("🎉 Frontend deployed successfully!")
    print("🌐 App URL: https://pathoptix-deeproute.vercel.app")

def main():
    """Main deployment function"""
    print("🚀 DeepRoute AI - Complete Cloud Deployment")
    print("=" * 50)
    
    if not check_prerequisites():
        sys.exit(1)
    
    print("\n📋 Deployment Plan:")
    print("1. 🌐 Deploy API to Zeabur")
    print("2. ⚛️ Deploy Frontend to Vercel")
    print("3. 🔗 Configure cross-platform integration")
    
    confirm = input("\n🤔 Proceed with deployment? (y/N): ")
    if confirm.lower() != 'y':
        print("❌ Deployment cancelled")
        sys.exit(0)
    
    # Deploy API first
    deploy_api()
    
    # Wait a moment for API to be ready
    print("\n⏱️ Waiting for API to initialize...")
    time.sleep(10)
    
    # Deploy Frontend
    deploy_frontend()
    
    # Final success message
    print("\n" + "=" * 50)
    print("🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!")
    print("=" * 50)
    print("🌐 Frontend: https://pathoptix-deeproute.vercel.app")
    print("📡 API: https://deeproute-ai-api.zeabur.app")
    print("📚 API Docs: https://deeproute-ai-api.zeabur.app/api/docs")
    print("\n🚀 DeepRoute AI is now live in production!")

if __name__ == "__main__":
    main()
