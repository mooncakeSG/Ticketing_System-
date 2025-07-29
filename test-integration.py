#!/usr/bin/env python3
"""
Simple integration test for MintDesk backend and frontend
"""
import requests
import time
import subprocess
import sys
from pathlib import Path

def test_backend():
    """Test the backend API endpoints"""
    print("🧪 Testing Backend API...")
    
    base_url = "http://localhost:5003/api/v1"
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health endpoint working")
        else:
            print("❌ Health endpoint failed")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend not running")
        return False
    
    # Test authentication
    try:
        login_data = {
            "email": "demo@example.com",
            "password": "demo123"
        }
        response = requests.post(f"{base_url}/auth/login", json=login_data)
        if response.status_code == 200:
            print("✅ Authentication working")
        else:
            print("❌ Authentication failed")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Authentication test failed: {e}")
        return False
    
    # Test tickets endpoint
    try:
        response = requests.get(f"{base_url}/ticket")
        if response.status_code == 200:
            print("✅ Tickets endpoint working")
        else:
            print("❌ Tickets endpoint failed")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Tickets test failed: {e}")
        return False
    
    print("✅ Backend API tests passed!")
    return True

def start_backend():
    """Start the backend server"""
    print("🚀 Starting backend server...")
    backend_process = subprocess.Popen(
        [sys.executable, "app.py"],
        cwd=Path(__file__).parent / "backend"
    )
    
    # Wait for backend to start
    time.sleep(3)
    return backend_process

def main():
    print("🧪 MintDesk Integration Test")
    print("=" * 40)
    
    # Start backend
    backend_process = start_backend()
    
    try:
        # Test backend
        if test_backend():
            print("\n🎉 Integration test passed!")
            print("\n📋 Summary:")
            print("- Backend API is running on http://localhost:5003")
            print("- Authentication is working")
            print("- Ticket endpoints are working")
            print("\n🚀 You can now start the frontend with:")
            print("   cd apps/client && yarn dev")
            print("\n🔐 Demo credentials:")
            print("   Email: demo@example.com")
            print("   Password: demo123")
        else:
            print("\n❌ Integration test failed!")
            sys.exit(1)
    
    finally:
        # Clean up
        print("\n🛑 Stopping backend...")
        backend_process.terminate()
        backend_process.wait()

if __name__ == "__main__":
    main() 