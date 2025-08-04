#!/usr/bin/env python3
"""
Backend Health Check and Diagnostics Script
Helps diagnose and fix backend timeout issues
"""

import requests
import time
import subprocess
import sys
import os
from pathlib import Path

def check_backend_health():
    """Check if backend is running and responding"""
    print("🔍 Checking backend health...")
    
    try:
        response = requests.get("http://localhost:5003/api/v1/health", timeout=10)
        if response.status_code == 200:
            print("✅ Backend is healthy and responding")
            data = response.json()
            print(f"   Service: {data.get('service', 'N/A')}")
            print(f"   Status: {data.get('status', 'N/A')}")
            print(f"   Timestamp: {data.get('timestamp', 'N/A')}")
            return True
        else:
            print(f"⚠️  Backend responded with status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running on port 5003")
        return False
    except requests.exceptions.Timeout:
        print("⏰ Backend request timed out")
        return False
    except Exception as e:
        print(f"❌ Backend health check failed: {e}")
        return False

def check_port_usage():
    """Check what's using port 5003"""
    print("\n🔍 Checking port 5003 usage...")
    
    try:
        # Windows command to check port usage
        result = subprocess.run(
            ["netstat", "-ano"], 
            capture_output=True, 
            text=True, 
            timeout=10
        )
        
        lines = result.stdout.split('\n')
        port_5003_lines = [line for line in lines if ':5003' in line]
        
        if port_5003_lines:
            print("📋 Processes using port 5003:")
            for line in port_5003_lines:
                print(f"   {line.strip()}")
        else:
            print("✅ Port 5003 is free")
            
    except Exception as e:
        print(f"⚠️  Could not check port usage: {e}")

def start_backend():
    """Start the backend server"""
    print("\n🚀 Starting backend server...")
    
    backend_path = Path(__file__).parent / "backend"
    if not backend_path.exists():
        print("❌ Backend directory not found!")
        return False
    
    try:
        # Start backend in background
        process = subprocess.Popen(
            [sys.executable, "app.py"],
            cwd=backend_path,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        print("⏳ Waiting for backend to start...")
        
        # Wait for backend to start
        for i in range(30):  # Wait up to 30 seconds
            time.sleep(1)
            if check_backend_health():
                print("✅ Backend started successfully!")
                return True
        
        print("❌ Backend failed to start within 30 seconds")
        process.terminate()
        return False
        
    except Exception as e:
        print(f"❌ Failed to start backend: {e}")
        return False

def main():
    """Main diagnostic function"""
    print("🔧 Backend Diagnostics Tool")
    print("=" * 40)
    
    # Check if backend is running
    if check_backend_health():
        print("\n✅ Backend is working correctly!")
        return
    
    # Check port usage
    check_port_usage()
    
    # Try to start backend
    print("\n💡 Attempting to start backend...")
    if start_backend():
        print("\n✅ Backend is now running!")
    else:
        print("\n❌ Failed to start backend automatically")
        print("\n🔧 Manual steps to fix:")
        print("1. Open a new terminal")
        print("2. Navigate to the backend directory: cd backend")
        print("3. Start the backend: python app.py")
        print("4. Keep the terminal open (backend needs to stay running)")
        print("\n💡 Or use the start script: python start-dev.py")

if __name__ == "__main__":
    main() 