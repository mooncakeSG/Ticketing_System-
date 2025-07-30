#!/usr/bin/env python3
"""
Simple database setup for Peppermint Ticketing System
This script sets up SQLite database for development (easier than PostgreSQL)
"""

import os
import sys
from dotenv import load_dotenv

load_dotenv()

def create_sqlite_config():
    """Create a SQLite configuration for development"""
    print("Setting up SQLite database for development...")
    
    # Update .env file to use SQLite
    env_content = """# Flask Configuration
FLASK_DEBUG=True
SECRET_KEY=dev-secret-key-change-in-production
JWT_SECRET_KEY=dev-jwt-secret-key-change-in-production

# Database Configuration (SQLite for development)
DATABASE_URL=sqlite:///peppermint.db

# CORS Configuration
CORS_ORIGINS=http://localhost:3000

# Server Configuration
PORT=5003
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print("✅ Environment file updated for SQLite")
    return True

def update_requirements():
    """Update requirements to use SQLite instead of PostgreSQL"""
    requirements_content = """Flask==2.3.3
Flask-CORS==4.0.0
python-dotenv==1.0.0
requests==2.31.0
Flask-SQLAlchemy==3.0.5
Flask-Migrate==4.0.5
Flask-JWT-Extended==4.5.3
bcrypt==4.0.1
python-jose==3.3.0
"""
    
    with open('requirements.txt', 'w') as f:
        f.write(requirements_content)
    
    print("✅ Requirements updated for SQLite")
    return True

def main():
    """Main setup function"""
    print("Peppermint Simple Database Setup")
    print("=" * 40)
    print("This will set up SQLite database for development")
    print("(Much easier than PostgreSQL setup)")
    print()
    
    # Step 1: Update configuration
    if not create_sqlite_config():
        print("❌ Failed to create configuration")
        sys.exit(1)
    
    # Step 2: Update requirements
    if not update_requirements():
        print("❌ Failed to update requirements")
        sys.exit(1)
    
    print("\n✅ Setup completed successfully!")
    print("\nNext steps:")
    print("1. Install dependencies: pip install -r requirements.txt")
    print("2. Run the application: python app.py")
    print("3. The database will be created automatically")
    print("\nDefault credentials:")
    print("- Email: demo@example.com")
    print("- Password: demo123")
    print("\nThe SQLite database file will be created as 'peppermint.db'")

if __name__ == "__main__":
    main() 