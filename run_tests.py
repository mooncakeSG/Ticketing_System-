#!/usr/bin/env python3
"""
Peppermint Test Runner
Checks dependencies and runs the test suite
"""

import sys
import subprocess
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

def check_dependencies():
    """Check if required dependencies are installed"""
    print("[CHECK] Checking dependencies...")
    
    try:
        import selenium
        print(f"[PASS] Selenium {selenium.__version__}")
    except ImportError:
        print("[FAIL] Selenium not installed. Run: pip install selenium")
        return False
    
    try:
        import requests
        print(f"[PASS] Requests {requests.__version__}")
    except ImportError:
        print("[FAIL] Requests not installed. Run: pip install requests")
        return False
    
    return True

def check_services():
    """Check if frontend and backend services are running"""
    print("\n[CHECK] Checking services...")
    
    # Check frontend
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        if response.status_code == 200:
            print("[PASS] Frontend (localhost:3000) is running")
        else:
            print(f"[WARN] Frontend returned status {response.status_code}")
    except requests.exceptions.RequestException:
        print("[FAIL] Frontend (localhost:3000) is not accessible")
        print("   Make sure your Next.js app is running: npm run dev")
        return False
    
    # Check backend
    try:
        response = requests.get("http://localhost:5003/api/v1/health", timeout=5)
        if response.status_code == 200:
            print("[PASS] Backend (localhost:5003) is running")
            health_data = response.json()
            print(f"   - Service: {health_data.get('service', 'N/A')}")
            print(f"   - Status: {health_data.get('status', 'N/A')}")
        else:
            print(f"[WARN] Backend returned status {response.status_code}")
    except requests.exceptions.RequestException:
        print("[FAIL] Backend (localhost:5003) is not accessible")
        print("   Make sure your Flask backend is running: python app.py")
        return False
    
    return True

def check_chrome_driver():
    """Check if Chrome WebDriver is available"""
    print("\n[CHECK] Checking Chrome WebDriver...")
    
    try:
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in headless mode for testing
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        driver = webdriver.Chrome(options=chrome_options)
        driver.quit()
        print("[PASS] Chrome WebDriver is working")
        return True
    except Exception as e:
        print(f"[FAIL] Chrome WebDriver error: {e}")
        print("   Make sure Chrome browser is installed")
        print("   You may need to install ChromeDriver manually")
        return False

def install_dependencies():
    """Install required dependencies"""
    print("\n[INSTALL] Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "test_requirements.txt"])
        print("[PASS] Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"[FAIL] Failed to install dependencies: {e}")
        return False

def main():
    """Main function to run the test suite with checks"""
    print("Peppermint Test Suite Runner")
    print("=" * 40)
    
    # Check if dependencies are installed
    if not check_dependencies():
        print("\n[INSTALL] Installing missing dependencies...")
        if not install_dependencies():
            print("[FAIL] Failed to install dependencies. Exiting.")
            sys.exit(1)
    
    # Check if services are running
    if not check_services():
        print("\n[FAIL] Services are not running. Please start your applications first.")
        print("\nTo start the services:")
        print("1. Backend: cd backend && python app.py")
        print("2. Frontend: cd apps/client && npm run dev")
        sys.exit(1)
    
    # Check Chrome WebDriver
    if not check_chrome_driver():
        print("\n[FAIL] Chrome WebDriver is not working. Please install Chrome browser.")
        sys.exit(1)
    
    # Run the test suite
    print("\n[START] Starting test suite...")
    try:
        from test_peppermint import main as run_tests
        run_tests()
    except ImportError:
        print("[FAIL] Could not import test_peppermint.py")
        sys.exit(1)
    except Exception as e:
        print(f"[FAIL] Test suite failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 