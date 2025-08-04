#!/usr/bin/env python3
import subprocess
import sys
import os
import time
import signal
import platform
from pathlib import Path

def run_command(command, cwd=None, shell=False):
    """Run a command and return the process"""
    try:
        if shell:
            process = subprocess.Popen(command, shell=True, cwd=cwd, 
                                     stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        else:
            process = subprocess.Popen(command, cwd=cwd, 
                                     stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return process
    except Exception as e:
        print(f"❌ Error starting process: {e}")
        return None

def check_port_available(port):
    """Check if a port is available"""
    import socket
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind(('localhost', port))
            return True
    except OSError:
        return False

def wait_for_port(port, timeout=30):
    """Wait for a port to become available"""
    import socket
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.connect(('localhost', port))
                return True
        except OSError:
            time.sleep(1)
    return False

def main():
    print("🚀 Starting MintDesk Development Environment...")
    print("=" * 50)
    
    # Get the project root directory
    project_root = Path(__file__).parent
    
    # Check if backend directory exists
    backend_path = project_root / "backend"
    if not backend_path.exists():
        print("❌ Backend directory not found!")
        print("Expected path:", backend_path)
        return
    
    # Check if frontend directory exists
    frontend_path = project_root / "apps" / "client"
    if not frontend_path.exists():
        print("❌ Frontend directory not found!")
        print("Expected path:", frontend_path)
        return
    
    # Check if app.py exists in backend
    backend_app = backend_path / "app.py"
    if not backend_app.exists():
        print("❌ Backend app.py not found!")
        print("Expected path:", backend_app)
        return
    
    # Check if package.json exists in frontend
    frontend_package = frontend_path / "package.json"
    if not frontend_package.exists():
        print("❌ Frontend package.json not found!")
        print("Expected path:", frontend_package)
        return
    
    print("✅ All required files found!")
    
    # Check if ports are available
    if not check_port_available(5003):
        print("⚠️  Port 5003 (backend) is already in use!")
        print("Please stop any existing backend server.")
        return
    
    if not check_port_available(3000):
        print("⚠️  Port 3000 (frontend) is already in use!")
        print("Please stop any existing frontend server.")
        return
    
    # Start backend
    print("\n📡 Starting Flask backend...")
    backend_process = run_command(
        [sys.executable, "app.py"],
        cwd=backend_path
    )
    
    if not backend_process:
        print("❌ Failed to start backend!")
        return
    
    # Wait for backend to start
    print("⏳ Waiting for backend to start...")
    if wait_for_port(5003, timeout=30):
        print("✅ Backend is running on http://localhost:5003")
    else:
        print("❌ Backend failed to start within 30 seconds!")
        backend_process.terminate()
        return
    
    # Start frontend
    print("\n🎨 Starting Next.js frontend...")
    
    # Use npm or yarn based on what's available
    if (frontend_path / "yarn.lock").exists():
        frontend_cmd = "yarn dev"
    else:
        frontend_cmd = "npm run dev"
    
    frontend_process = run_command(
        frontend_cmd,
        cwd=frontend_path,
        shell=True
    )
    
    if not frontend_process:
        print("❌ Failed to start frontend!")
        backend_process.terminate()
        return
    
    # Wait for frontend to start
    print("⏳ Waiting for frontend to start...")
    if wait_for_port(3000, timeout=60):
        print("✅ Frontend is running on http://localhost:3000")
    else:
        print("⚠️  Frontend may still be starting...")
    
    print("\n" + "=" * 50)
    print("🎉 Development servers started successfully!")
    print("📡 Backend: http://localhost:5003")
    print("🎨 Frontend: http://localhost:3000")
    print("\n💡 Default login credentials:")
    print("   Email: demo@example.com")
    print("   Password: demo123")
    print("\n🛑 Press Ctrl+C to stop all servers")
    print("=" * 50)
    
    try:
        # Wait for both processes
        while True:
            # Check if processes are still running
            if backend_process.poll() is not None:
                print("❌ Backend process stopped unexpectedly!")
                break
            if frontend_process.poll() is not None:
                print("❌ Frontend process stopped unexpectedly!")
                break
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Stopping development servers...")
    finally:
        # Cleanup processes
        if backend_process and backend_process.poll() is None:
            backend_process.terminate()
            try:
                backend_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                backend_process.kill()
        
        if frontend_process and frontend_process.poll() is None:
            frontend_process.terminate()
            try:
                frontend_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                frontend_process.kill()
        
        print("✅ Servers stopped")

if __name__ == "__main__":
    main() 