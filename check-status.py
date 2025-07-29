#!/usr/bin/env python3
"""
Check if both backend and frontend are running
"""
import requests
import time

def check_backend():
    """Check if backend is running"""
    try:
        response = requests.get("http://localhost:5003/api/v1/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend is running on http://localhost:5003")
            return True
        else:
            print("❌ Backend returned status code:", response.status_code)
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running")
        return False
    except Exception as e:
        print(f"❌ Error checking backend: {e}")
        return False

def check_frontend():
    """Check if frontend is running"""
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend is running on http://localhost:3000")
            return True
        else:
            print("❌ Frontend returned status code:", response.status_code)
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Frontend is not running")
        return False
    except Exception as e:
        print(f"❌ Error checking frontend: {e}")
        return False

def main():
    print("🔍 Checking MintDesk Development Environment...")
    print("=" * 50)
    
    backend_ok = check_backend()
    frontend_ok = check_frontend()
    
    print("\n" + "=" * 50)
    if backend_ok and frontend_ok:
        print("🎉 Both servers are running successfully!")
        print("\n📋 Access your application:")
        print("   Frontend: http://localhost:3000")
        print("   Backend API: http://localhost:5003")
        print("\n🔐 Demo credentials:")
        print("   Email: demo@example.com")
        print("   Password: demo123")
    else:
        print("❌ Some servers are not running")
        if not backend_ok:
            print("   - Backend needs to be started")
        if not frontend_ok:
            print("   - Frontend needs to be started")

if __name__ == "__main__":
    main() 