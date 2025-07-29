# MintDesk Backend

This is the Flask backend for the MintDesk application.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file in the backend directory:
```bash
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here
PORT=5003
```

3. Run the backend:
```bash
python app.py
```

The backend will be available at `http://localhost:5003`

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

### Tickets
- `GET /api/v1/ticket` - Get all tickets
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
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/<id>` - Get specific user
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/<id>` - Update user
- `DELETE /api/v1/users/<id>` - Delete user

## Demo Credentials

For testing purposes, you can use:
- Email: `demo@example.com`
- Password: `demo123` 