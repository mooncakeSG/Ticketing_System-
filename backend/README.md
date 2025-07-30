# Peppermint Backend

A modern Flask-based backend for the Peppermint Ticketing System with PostgreSQL database support.

## 🚀 Quick Start

### Prerequisites

1. **Python 3.8+**
2. **PostgreSQL 12+**
3. **pip** (Python package manager)

### Installation

1. **Clone the repository and navigate to backend**
```bash
cd backend
```

2. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

3. **Set up the database**
```bash
python setup_db.py
```

4. **Create environment file**
```bash
cp env.example .env
# Edit .env with your configuration
```

5. **Run the application**
```bash
python app.py
```

The backend will be available at `http://localhost:5003`

## 🗄️ Database Setup

### Option 1: Automatic Setup (Recommended)

Run the setup script:
```bash
python setup_db.py
```

This will:
- Create the `peppermint_db` database
- Create the `peppermint` user
- Test the connection

### Option 2: Manual Setup

1. **Install PostgreSQL**
   - [Download PostgreSQL](https://www.postgresql.org/download/)
   - Start the PostgreSQL service

2. **Create database and user**
```sql
CREATE DATABASE peppermint_db;
CREATE USER peppermint WITH PASSWORD 'peppermint';
GRANT ALL PRIVILEGES ON DATABASE peppermint_db TO peppermint;
```

3. **Update your .env file**
```env
DATABASE_URL=postgresql://peppermint:peppermint@localhost:5432/peppermint_db
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend directory:

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

### Database Models

The application includes the following database models:

- **User**: User accounts with roles and permissions
- **Ticket**: Support tickets with status and priority
- **Comment**: Ticket comments (public and internal)
- **TimeEntry**: Time tracking for tickets
- **Client**: Client organizations

## 🔐 Authentication

The backend uses JWT (JSON Web Tokens) for authentication:

- **Login**: `POST /api/v1/auth/login`
- **Profile**: `GET /api/v1/auth/me`
- **Update Profile**: `PUT /api/v1/auth/profile`

### Default Credentials

- **Email**: `demo@example.com`
- **Password**: `demo123`

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/profile` - Update profile

### Tickets
- `GET /api/v1/ticket` - Get all tickets (with pagination)
- `GET /api/v1/ticket/<id>` - Get specific ticket
- `POST /api/v1/ticket/create` - Create new ticket
- `PUT /api/v1/ticket/<id>` - Update ticket
- `PATCH /api/v1/ticket/<id>/close` - Close ticket
- `PATCH /api/v1/ticket/<id>/reopen` - Reopen ticket

### Comments
- `GET /api/v1/ticket/<id>/comments` - Get ticket comments
- `POST /api/v1/ticket/<id>/comments` - Add comment

### Time Tracking
- `GET /api/v1/ticket/<id>/time` - Get time tracking
- `POST /api/v1/ticket/<id>/time` - Add time tracking

### Users
- `GET /api/v1/users` - Get all users (with pagination)
- `GET /api/v1/users/<id>` - Get specific user
- `POST /api/v1/users` - Create user (admin only)
- `PUT /api/v1/users/<id>` - Update user (admin only)
- `DELETE /api/v1/users/<id>` - Delete user (admin only)

### Clients
- `GET /api/v1/clients` - Get all active clients
- `POST /api/v1/clients` - Create client (admin only)

## 🔧 Development

### Running in Development Mode

```bash
export FLASK_DEBUG=True
python app.py
```

### Database Migrations

The application uses SQLAlchemy with automatic table creation. For production, consider using Flask-Migrate:

```bash
pip install Flask-Migrate
flask db init
flask db migrate
flask db upgrade
```

### Testing

```bash
# Test the API
curl http://localhost:5003/api/v1/health

# Test authentication
curl -X POST http://localhost:5003/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123"}'
```

## 🚀 Production Deployment

### Environment Variables

For production, make sure to:

1. **Change secret keys**:
   ```env
   SECRET_KEY=your-production-secret-key
   JWT_SECRET_KEY=your-production-jwt-secret-key
   ```

2. **Use a production database**:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

3. **Disable debug mode**:
   ```env
   FLASK_DEBUG=False
   ```

### WSGI Server

For production, use a WSGI server like Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5003 app:app
```

## 🐛 Troubleshooting

### Common Issues

1. **Database connection failed**:
   - Check if PostgreSQL is running
   - Verify database credentials in `.env`
   - Run `python setup_db.py` to set up the database

2. **Import errors**:
   - Make sure all dependencies are installed: `pip install -r requirements.txt`

3. **CORS errors**:
   - Check `CORS_ORIGINS` in your `.env` file
   - Make sure the frontend URL is included

4. **Authentication fails**:
   - Check if the database is seeded with default users
   - Verify JWT configuration

### Debug Mode

Enable debug mode for detailed error messages:

```bash
export FLASK_DEBUG=True
python app.py
```

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Documentation](https://jwt.io/) 