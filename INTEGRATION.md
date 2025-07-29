# 🔗 Backend-Frontend Integration Guide

This document describes the integration between the Flask backend and Next.js frontend for the MintDesk ticketing system.

## 🏗️ Architecture Overview

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐
│   Next.js       │ ◄──────────────► │   Flask         │
│   Frontend      │                 │   Backend       │
│   (Port 3000)   │                 │   (Port 5003)   │
└─────────────────┘                 └─────────────────┘
```

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
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

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### 2. Start Development Environment

```bash
# Start both backend and frontend
npm run dev:full

# Or start them separately:
npm run backend    # Backend only
npm run frontend   # Frontend only
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5003

### 4. Demo Credentials

- **Email**: `demo@example.com`
- **Password**: `demo123`

## 🔧 Configuration

### Backend Configuration

The backend uses environment variables for configuration. Create a `.env` file in the `backend/` directory:

```env
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here
PORT=5003
```

### Frontend Configuration

The frontend is configured to connect to the backend via the `NEXT_PUBLIC_API_URL` environment variable. By default, it connects to `http://localhost:5003/api/v1`.

## 🧪 Testing

### Run Integration Tests

```bash
python test-integration.py
```

This will:
1. Start the backend server
2. Test all API endpoints
3. Verify authentication
4. Clean up processes

### Manual Testing

1. **Test Backend Health**:
   ```bash
   curl http://localhost:5003/api/v1/health
   ```

2. **Test Authentication**:
   ```bash
   curl -X POST http://localhost:5003/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"demo@example.com","password":"demo123"}'
   ```

3. **Test Tickets**:
   ```bash
   curl http://localhost:5003/api/v1/ticket
   ```

## 🔄 Data Flow

### Frontend → Backend
1. Frontend makes HTTP requests to backend API
2. Backend processes requests and returns JSON responses
3. Frontend updates UI based on responses

### Authentication Flow
1. User enters credentials on frontend
2. Frontend sends login request to `/api/v1/auth/login`
3. Backend validates credentials and returns JWT token
4. Frontend stores token in localStorage
5. Frontend includes token in subsequent requests

### Error Handling
- Frontend includes axios interceptors for error handling
- 401 responses redirect to login page
- Network errors fall back to mock data

## 🛠️ Development

### Adding New Endpoints

1. **Backend**: Add new route in `backend/app.py`
2. **Frontend**: Add corresponding function in `apps/client/lib/api.ts`
3. **Test**: Update integration tests

### Database Integration

The current backend uses mock data. To integrate with a real database:

1. Add database dependencies to `requirements.txt`
2. Create database models
3. Replace mock data with database queries
4. Add database migrations

### Production Deployment

1. **Backend**: Use WSGI server (Gunicorn)
2. **Frontend**: Build static files with `yarn build`
3. **Environment**: Set production environment variables
4. **CORS**: Configure allowed origins

## 📝 Troubleshooting

### Common Issues

1. **Backend not starting**:
   - Check if port 5003 is available
   - Verify Python dependencies are installed
   - Check for syntax errors in `app.py`

2. **Frontend can't connect to backend**:
   - Verify backend is running on port 5003
   - Check CORS configuration
   - Verify API URL in frontend configuration

3. **Authentication failing**:
   - Check demo credentials
   - Verify JWT token handling
   - Check localStorage for stored tokens

### Debug Mode

Enable debug mode for detailed error messages:

```bash
# Backend
export FLASK_DEBUG=True

# Frontend
# Add console.log statements in api.ts
```

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Axios Documentation](https://axios-http.com/)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 