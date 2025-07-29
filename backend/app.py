from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['DEBUG'] = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'

# Sample data for development
mock_tickets = [
    {
        "id": "1",
        "title": "Login Issue",
        "detail": "Users cannot log in with their credentials",
        "status": "needs_support",
        "priority": "high",
        "type": "bug",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "assignedTo": {"id": "1", "name": "John Doe"},
        "createdBy": {"id": "2", "name": "Jane Smith"},
        "isComplete": False,
        "hidden": False,
        "locked": False,
        "Number": 1001
    },
    {
        "id": "2",
        "title": "Feature Request: Dark Mode",
        "detail": "Add dark mode support to the application",
        "status": "in_progress",
        "priority": "medium",
        "type": "feature",
        "createdAt": "2024-01-14T14:20:00Z",
        "updatedAt": "2024-01-15T09:15:00Z",
        "assignedTo": {"id": "3", "name": "Mike Johnson"},
        "createdBy": {"id": "1", "name": "John Doe"},
        "isComplete": False,
        "hidden": False,
        "locked": False,
        "Number": 1002
    }
]

mock_users = [
    {
        "id": "1",
        "name": "John Doe",
        "email": "john@example.com",
        "isAdmin": True,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    },
    {
        "id": "2",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "isAdmin": False,
        "createdAt": "2024-01-02T00:00:00Z",
        "updatedAt": "2024-01-02T00:00:00Z"
    }
]

# Health check endpoint
@app.route('/api/v1/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "mintdesk-api"
    })

# Authentication endpoints
@app.route('/api/v1/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # Mock authentication
    if email == "demo@example.com" and password == "demo123":
        return jsonify({
            "token": "mock-jwt-token-12345",
            "user": {
                "id": "demo-user-id",
                "email": "demo@example.com",
                "name": "Demo User",
                "isAdmin": True,
                "language": "en",
                "ticket_created": True,
                "ticket_status_changed": True,
                "ticket_comments": True,
                "ticket_assigned": True,
                "firstLogin": False,
                "external_user": False
            }
        })
    
    return jsonify({"message": "Invalid email or password"}), 401

@app.route('/api/v1/auth/me', methods=['GET'])
def get_current_user():
    # Mock current user endpoint
    return jsonify({
        "id": "demo-user-id",
        "email": "demo@example.com",
        "name": "Demo User",
        "isAdmin": True
    })

# Ticket endpoints
@app.route('/api/v1/ticket', methods=['GET'])
def get_tickets():
    status_filter = request.args.get('status')
    priority_filter = request.args.get('priority')
    
    filtered_tickets = mock_tickets
    
    if status_filter:
        filtered_tickets = [t for t in filtered_tickets if t['status'] == status_filter]
    
    if priority_filter:
        filtered_tickets = [t for t in filtered_tickets if t['priority'] == priority_filter]
    
    return jsonify(filtered_tickets)

@app.route('/api/v1/ticket/<ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    ticket = next((t for t in mock_tickets if t['id'] == ticket_id), None)
    if not ticket:
        return jsonify({"message": "Ticket not found"}), 404
    
    return jsonify(ticket)

@app.route('/api/v1/ticket/create', methods=['POST'])
def create_ticket():
    data = request.get_json()
    
    new_ticket = {
        "id": str(len(mock_tickets) + 1),
        "title": data.get('title'),
        "detail": data.get('detail'),
        "status": "needs_support",
        "priority": data.get('priority', 'medium'),
        "type": data.get('type', 'support'),
        "createdAt": datetime.utcnow().isoformat(),
        "updatedAt": datetime.utcnow().isoformat(),
        "assignedTo": None,
        "createdBy": {"id": "demo-user-id", "name": "Demo User"},
        "isComplete": False,
        "hidden": False,
        "locked": False,
        "Number": 1000 + len(mock_tickets) + 1
    }
    
    mock_tickets.append(new_ticket)
    return jsonify(new_ticket), 201

@app.route('/api/v1/ticket/<ticket_id>', methods=['PUT'])
def update_ticket(ticket_id):
    ticket = next((t for t in mock_tickets if t['id'] == ticket_id), None)
    if not ticket:
        return jsonify({"message": "Ticket not found"}), 404
    
    data = request.get_json()
    
    # Update ticket fields
    for field in ['title', 'detail', 'status', 'priority', 'type']:
        if field in data:
            ticket[field] = data[field]
    
    ticket['updatedAt'] = datetime.utcnow().isoformat()
    
    return jsonify(ticket)

@app.route('/api/v1/ticket/<ticket_id>/close', methods=['PATCH'])
def close_ticket(ticket_id):
    ticket = next((t for t in mock_tickets if t['id'] == ticket_id), None)
    if not ticket:
        return jsonify({"message": "Ticket not found"}), 404
    
    ticket['status'] = 'closed'
    ticket['isComplete'] = True
    ticket['updatedAt'] = datetime.utcnow().isoformat()
    
    return jsonify(ticket)

@app.route('/api/v1/ticket/<ticket_id>/reopen', methods=['PATCH'])
def reopen_ticket(ticket_id):
    ticket = next((t for t in mock_tickets if t['id'] == ticket_id), None)
    if not ticket:
        return jsonify({"message": "Ticket not found"}), 404
    
    ticket['status'] = 'needs_support'
    ticket['isComplete'] = False
    ticket['updatedAt'] = datetime.utcnow().isoformat()
    
    return jsonify(ticket)

# Comments endpoints
@app.route('/api/v1/ticket/<ticket_id>/comments', methods=['GET'])
def get_comments(ticket_id):
    # Mock comments
    return jsonify([])

@app.route('/api/v1/ticket/<ticket_id>/comments', methods=['POST'])
def add_comment(ticket_id):
    data = request.get_json()
    # Mock comment creation
    return jsonify({
        "id": "1",
        "text": data.get('text'),
        "public": data.get('public', True),
        "reply": False,
        "edited": False,
        "createdAt": datetime.utcnow().isoformat(),
        "ticketId": ticket_id
    }), 201

# Time tracking endpoints
@app.route('/api/v1/ticket/<ticket_id>/time', methods=['GET'])
def get_time_tracking(ticket_id):
    # Mock time tracking
    return jsonify([])

@app.route('/api/v1/ticket/<ticket_id>/time', methods=['POST'])
def add_time_tracking(ticket_id):
    data = request.get_json()
    # Mock time tracking creation
    return jsonify({
        "id": "1",
        "title": data.get('title'),
        "comment": data.get('comment'),
        "time": data.get('time'),
        "createdAt": datetime.utcnow().isoformat(),
        "updatedAt": datetime.utcnow().isoformat(),
        "ticketId": ticket_id
    }), 201

# User endpoints
@app.route('/api/v1/users', methods=['GET'])
def get_users():
    return jsonify(mock_users)

@app.route('/api/v1/users/<user_id>', methods=['GET'])
def get_user(user_id):
    user = next((u for u in mock_users if u['id'] == user_id), None)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    return jsonify(user)

@app.route('/api/v1/users', methods=['POST'])
def create_user():
    data = request.get_json()
    
    new_user = {
        "id": str(len(mock_users) + 1),
        "name": data.get('name'),
        "email": data.get('email'),
        "isAdmin": data.get('admin', False),
        "createdAt": datetime.utcnow().isoformat(),
        "updatedAt": datetime.utcnow().isoformat()
    }
    
    mock_users.append(new_user)
    return jsonify(new_user), 201

@app.route('/api/v1/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    user = next((u for u in mock_users if u['id'] == user_id), None)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    data = request.get_json()
    
    # Update user fields
    for field in ['name', 'email', 'isAdmin']:
        if field in data:
            user[field] = data[field]
    
    user['updatedAt'] = datetime.utcnow().isoformat()
    
    return jsonify(user)

@app.route('/api/v1/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = next((u for u in mock_users if u['id'] == user_id), None)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    mock_users.remove(user)
    return jsonify({"message": "User deleted"}), 200

# Root endpoint
@app.route('/', methods=['GET'])
def root():
    return jsonify({
        "message": "MintDesk API",
        "version": "1.0.0",
        "status": "running"
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5003))
    app.run(host='0.0.0.0', port=port, debug=True) 