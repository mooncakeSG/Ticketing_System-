#!/usr/bin/env python3
"""
Database setup script for Peppermint Ticketing System
This script helps set up the PostgreSQL database and create the initial user.
"""

import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv

load_dotenv()

def create_database():
    """Create the database if it doesn't exist"""
    try:
        # Connect to PostgreSQL server
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            user="postgres",
            password="postgres"  # Default PostgreSQL password
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'peppermint_db'")
        exists = cursor.fetchone()
        
        if not exists:
            print("Creating database 'peppermint_db'...")
            cursor.execute("CREATE DATABASE peppermint_db")
            print("Database created successfully!")
        else:
            print("Database 'peppermint_db' already exists.")
        
        cursor.close()
        conn.close()
        
    except psycopg2.Error as e:
        print(f"Error creating database: {e}")
        print("\nPlease make sure PostgreSQL is running and you have the correct credentials.")
        print("You may need to:")
        print("1. Install PostgreSQL")
        print("2. Start PostgreSQL service")
        print("3. Create a user 'peppermint' with password 'peppermint'")
        print("4. Or update the DATABASE_URL in your .env file")
        return False
    
    return True

def create_user():
    """Create the peppermint user if it doesn't exist"""
    try:
        # Connect to PostgreSQL server
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            user="postgres",
            password="postgres"  # Default PostgreSQL password
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT 1 FROM pg_catalog.pg_user WHERE usename = 'peppermint'")
        exists = cursor.fetchone()
        
        if not exists:
            print("Creating user 'peppermint'...")
            cursor.execute("CREATE USER peppermint WITH PASSWORD 'peppermint'")
            cursor.execute("GRANT ALL PRIVILEGES ON DATABASE peppermint_db TO peppermint")
            print("User created successfully!")
        else:
            print("User 'peppermint' already exists.")
        
        cursor.close()
        conn.close()
        
    except psycopg2.Error as e:
        print(f"Error creating user: {e}")
        print("You may need to create the user manually or use different credentials.")
        return False
    
    return True

def test_connection():
    """Test the database connection"""
    try:
        # Try to connect with the peppermint user
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            user="peppermint",
            password="peppermint",
            database="peppermint_db"
        )
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print(f"Successfully connected to database!")
        print(f"PostgreSQL version: {version[0]}")
        
        cursor.close()
        conn.close()
        return True
        
    except psycopg2.Error as e:
        print(f"Error connecting to database: {e}")
        return False

def main():
    """Main setup function"""
    print("Peppermint Database Setup")
    print("=" * 30)
    
    # Step 1: Create database
    if not create_database():
        sys.exit(1)
    
    # Step 2: Create user
    if not create_user():
        sys.exit(1)
    
    # Step 3: Test connection
    if not test_connection():
        print("\nDatabase setup failed. Please check your PostgreSQL installation.")
        sys.exit(1)
    
    print("\nDatabase setup completed successfully!")
    print("\nNext steps:")
    print("1. Copy env.example to .env and update the DATABASE_URL if needed")
    print("2. Install Python dependencies: pip install -r requirements.txt")
    print("3. Run the application: python app.py")
    print("\nDefault credentials:")
    print("- Email: demo@example.com")
    print("- Password: demo123")

if __name__ == "__main__":
    main() 