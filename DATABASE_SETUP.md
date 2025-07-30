# 🗄️ Database Setup Guide

This guide will help you set up the PostgreSQL database for the Peppermint Ticketing System.

## 📋 Prerequisites

Before starting, make sure you have:

1. **PostgreSQL 12+** installed and running
2. **Python 3.8+** installed
3. **pip** (Python package manager)

## 🚀 Quick Setup (Recommended)

### Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Run Database Setup

```bash
python setup_db.py
```

This script will:
- Create the `peppermint_db` database
- Create the `peppermint` user with password `peppermint`
- Grant necessary permissions
- Test the connection

### Step 3: Configure Environment

```bash
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# Flask Configuration
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET_KEY=your-jwt-secret-key-change-in-production

# Database Configuration
DATABASE_URL=postgresql://peppermint:peppermint@localhost:5432/peppermint_db

# CORS Configuration
CORS_ORIGINS=http://localhost:3000

# Server Configuration
PORT=5003
```

### Step 4: Start the Application

```bash
python app.py
```

The backend will be available at `http://localhost:5003`

## 🔧 Manual Setup

If the automatic setup doesn't work, follow these manual steps:

### Step 1: Install PostgreSQL

#### Windows
1. Download PostgreSQL from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Run the installer
3. Remember the password you set for the `postgres` user
4. Start the PostgreSQL service

#### macOS
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Or download from https://www.postgresql.org/download/macosx/
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Step 2: Create Database and User

Connect to PostgreSQL as the superuser:

```bash
# Windows/macOS
psql -U postgres

# Linux
sudo -u postgres psql
```

Run these SQL commands:

```sql
-- Create the database
CREATE DATABASE peppermint_db;

-- Create the user
CREATE USER peppermint WITH PASSWORD 'peppermint';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE peppermint_db TO peppermint;

-- Connect to the database
\c peppermint_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO peppermint;

-- Exit
\q
```

### Step 3: Test Connection

```bash
psql -h localhost -U peppermint -d peppermint_db
# Enter password: peppermint
```

If you can connect successfully, the database is ready.

## 🐛 Troubleshooting

### Common Issues

#### 1. PostgreSQL not running
```bash
# Windows
# Check Services app for "postgresql-x64-15" service

# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
sudo systemctl status postgresql
```

#### 2. Connection refused
- Check if PostgreSQL is running on port 5432
- Verify firewall settings
- Check PostgreSQL configuration in `postgresql.conf`

#### 3. Authentication failed
- Make sure you're using the correct password
- Check `pg_hba.conf` for authentication settings
- Try connecting as `postgres` user first

#### 4. Permission denied
- Make sure the `peppermint` user has proper privileges
- Check if the database exists and is accessible

### Debug Steps

1. **Test PostgreSQL connection**:
```bash
psql -h localhost -U postgres
```

2. **Check if database exists**:
```sql
\l
```

3. **Check if user exists**:
```sql
\du
```

4. **Test user connection**:
```bash
psql -h localhost -U peppermint -d peppermint_db
```

## 🔐 Default Credentials

After setup, you can use these default credentials:

- **Email**: `demo@example.com`
- **Password**: `demo123`

## 📊 Database Schema

The application creates these tables automatically:

- **users**: User accounts and authentication
- **tickets**: Support tickets
- **comments**: Ticket comments
- **time_entries**: Time tracking
- **clients**: Client organizations

## 🚀 Next Steps

After successful database setup:

1. **Start the backend**:
```bash
python app.py
```

2. **Start the frontend**:
```bash
cd ../apps/client
npm run dev
```

3. **Access the application**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5003

4. **Test the API**:
```bash
curl http://localhost:5003/api/v1/health
```

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Flask Documentation](https://flask.palletsprojects.com/) 