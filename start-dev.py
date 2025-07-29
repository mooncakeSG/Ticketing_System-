#!/usr/bin/env python3
import subprocess
import sys
import os
import time
from pathlib import Path

def run_command(command, cwd=None, shell=False):
    """Run a command and return the process"""
    if shell:
        process = subprocess.Popen(command, shell=True, cwd=cwd)
    else:
        process = subprocess.Popen(command, cwd=cwd)
    return process

def main():
    print("🚀 Starting MintDesk Development Environment...")
    
    # Get the project root directory
    project_root = Path(__file__).parent
    
    # Start backend
    print("📡 Starting Flask backend...")
    backend_process = run_command(
        [sys.executable, "app.py"],
        cwd=project_root / "backend"
    )
    
    # Wait a moment for backend to start
    time.sleep(2)
    
    # Start frontend
    print("🎨 Starting Next.js frontend...")
    frontend_process = run_command(
        ["npm", "run", "dev"],
        cwd=project_root / "apps" / "client"
    )
    
    print("\n✅ Development servers started!")
    print("📡 Backend: http://localhost:5003")
    print("🎨 Frontend: http://localhost:3000")
    print("\nPress Ctrl+C to stop all servers")
    
    try:
        # Wait for both processes
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Stopping development servers...")
        backend_process.terminate()
        frontend_process.terminate()
        print("✅ Servers stopped")

if __name__ == "__main__":
    main() 