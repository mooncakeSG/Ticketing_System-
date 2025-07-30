from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
from datetime import datetime
from dotenv import load_dotenv

# Import our modules
from models import db, User, Ticket, Comment, TimeEntry, Client
from config import config
from database import init_db, get_next_ticket_number
from auth import create_token, authenticate_user, login_required, admin_required, get_current_user

load_dotenv()

def create_app(config_name=None):
    # Determine config to use
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    CORS(app, origins=app.config['CORS_ORIGINS'])
    jwt = JWTManager(app)
    
    # Initialize database
    init_db(app)
    
    # Health check endpoint
    @app.route('/api/v1/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "service": "peppermint-api",
            "database": "connected"
        })
    
    # Authentication endpoints
    @app.route('/api/v1/auth/login', methods=['POST'])
    def login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = authenticate_user(email, password)
        if user:
            token = create_token(user)
            return jsonify({
                "token": token,
                "user": user.to_dict()
            })
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    
    @app.route('/api/v1/auth/me', methods=['GET'])
    @login_required
    def get_current_user_info():
        user = get_current_user()
        return jsonify(user.to_dict())
    
    @app.route('/api/v1/auth/profile', methods=['PUT'])
    @login_required
    def update_profile():
        user = get_current_user()
        data = request.get_json()
        
        if 'name' in data:
            user.name = data['name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'department' in data:
            user.department = data['department']
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(user.to_dict())
    
    # Ticket endpoints
    @app.route('/api/v1/ticket', methods=['GET'])
    @login_required
    def get_tickets():
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        priority = request.args.get('priority')
        
        query = Ticket.query
        
        if status:
            query = query.filter(Ticket.status == status)
        if priority:
            query = query.filter(Ticket.priority == priority)
        
        tickets = query.order_by(Ticket.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'tickets': [ticket.to_dict() for ticket in tickets.items],
            'total': tickets.total,
            'pages': tickets.pages,
            'current_page': page
        })
    
    @app.route('/api/v1/ticket/<ticket_id>', methods=['GET'])
    @login_required
    def get_ticket(ticket_id):
        ticket = Ticket.query.get(ticket_id)
        if not ticket:
            return jsonify({'error': 'Ticket not found'}), 404
        
        return jsonify(ticket.to_dict())
    
    @app.route('/api/v1/ticket/create', methods=['POST'])
    @login_required
    def create_ticket():
        data = request.get_json()
        user = get_current_user()
        
        # Validate required fields
        required_fields = ['title', 'detail']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create new ticket
        ticket = Ticket(
            number=get_next_ticket_number(),
            title=data['title'],
            detail=data['detail'],
            status=data.get('status', 'needs_support'),
            priority=data.get('priority', 'medium'),
            type=data.get('type', 'support'),
            created_by=user.id,
            assigned_to=data.get('assigned_to')
        )
        
        db.session.add(ticket)
        db.session.commit()
        
        return jsonify(ticket.to_dict()), 201
    
    @app.route('/api/v1/ticket/<ticket_id>', methods=['PUT'])
    @login_required
    def update_ticket(ticket_id):
        ticket = Ticket.query.get(ticket_id)
        if not ticket:
            return jsonify({'error': 'Ticket not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'title' in data:
            ticket.title = data['title']
        if 'detail' in data:
            ticket.detail = data['detail']
        if 'status' in data:
            ticket.status = data['status']
        if 'priority' in data:
            ticket.priority = data['priority']
        if 'type' in data:
            ticket.type = data['type']
        if 'assigned_to' in data:
            ticket.assigned_to = data['assigned_to']
        
        ticket.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(ticket.to_dict())
    
    @app.route('/api/v1/ticket/<ticket_id>/close', methods=['PATCH'])
    @login_required
    def close_ticket(ticket_id):
        ticket = Ticket.query.get(ticket_id)
        if not ticket:
            return jsonify({'error': 'Ticket not found'}), 404
        
        ticket.status = 'resolved'
        ticket.is_complete = True
        ticket.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(ticket.to_dict())
    
    @app.route('/api/v1/ticket/<ticket_id>/reopen', methods=['PATCH'])
    @login_required
    def reopen_ticket(ticket_id):
        ticket = Ticket.query.get(ticket_id)
        if not ticket:
            return jsonify({'error': 'Ticket not found'}), 404
        
        ticket.status = 'needs_support'
        ticket.is_complete = False
        ticket.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(ticket.to_dict())
    
    # Comment endpoints
    @app.route('/api/v1/ticket/<ticket_id>/comments', methods=['GET'])
    @login_required
    def get_comments(ticket_id):
        ticket = Ticket.query.get(ticket_id)
        if not ticket:
            return jsonify({'error': 'Ticket not found'}), 404
        
        comments = Comment.query.filter_by(ticket_id=ticket_id).order_by(Comment.created_at.desc()).all()
        return jsonify([comment.to_dict() for comment in comments])
    
    @app.route('/api/v1/ticket/<ticket_id>/comments', methods=['POST'])
    @login_required
    def add_comment(ticket_id):
        ticket = Ticket.query.get(ticket_id)
        if not ticket:
            return jsonify({'error': 'Ticket not found'}), 404
        
        data = request.get_json()
        user = get_current_user()
        
        if not data.get('content'):
            return jsonify({'error': 'Comment content is required'}), 400
        
        comment = Comment(
            content=data['content'],
            is_internal=data.get('is_internal', False),
            ticket_id=ticket_id,
            user_id=user.id
        )
        
        db.session.add(comment)
        db.session.commit()
        
        return jsonify(comment.to_dict()), 201
    
    # Time tracking endpoints
    @app.route('/api/v1/ticket/<ticket_id>/time', methods=['GET'])
    @login_required
    def get_time_tracking(ticket_id):
        ticket = Ticket.query.get(ticket_id)
        if not ticket:
            return jsonify({'error': 'Ticket not found'}), 404
        
        time_entries = TimeEntry.query.filter_by(ticket_id=ticket_id).order_by(TimeEntry.date.desc()).all()
        return jsonify([entry.to_dict() for entry in time_entries])
    
    @app.route('/api/v1/ticket/<ticket_id>/time', methods=['POST'])
    @login_required
    def add_time_tracking(ticket_id):
        ticket = Ticket.query.get(ticket_id)
        if not ticket:
            return jsonify({'error': 'Ticket not found'}), 404
        
        data = request.get_json()
        user = get_current_user()
        
        required_fields = ['description', 'hours', 'date']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        time_entry = TimeEntry(
            description=data['description'],
            hours=data['hours'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            ticket_id=ticket_id,
            user_id=user.id
        )
        
        db.session.add(time_entry)
        db.session.commit()
        
        return jsonify(time_entry.to_dict()), 201
    
    # User endpoints
    @app.route('/api/v1/users', methods=['GET'])
    @login_required
    def get_users():
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        users = User.query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'users': [user.to_dict() for user in users.items],
            'total': users.total,
            'pages': users.pages,
            'current_page': page
        })
    
    @app.route('/api/v1/users/<user_id>', methods=['GET'])
    @login_required
    def get_user(user_id):
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(user.to_dict())
    
    @app.route('/api/v1/users', methods=['POST'])
    @admin_required
    def create_user():
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'User with this email already exists'}), 400
        
        user = User(
            name=data['name'],
            email=data['email'],
            is_admin=data.get('is_admin', False),
            role=data.get('role', 'user'),
            status=data.get('status', 'active'),
            phone=data.get('phone'),
            department=data.get('department')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify(user.to_dict()), 201
    
    @app.route('/api/v1/users/<user_id>', methods=['PUT'])
    @admin_required
    def update_user(user_id):
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            user.email = data['email']
        if 'is_admin' in data:
            user.is_admin = data['is_admin']
        if 'role' in data:
            user.role = data['role']
        if 'status' in data:
            user.status = data['status']
        if 'phone' in data:
            user.phone = data['phone']
        if 'department' in data:
            user.department = data['department']
        if 'password' in data:
            user.set_password(data['password'])
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(user.to_dict())
    
    @app.route('/api/v1/users/<user_id>', methods=['DELETE'])
    @admin_required
    def delete_user(user_id):
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'User deleted successfully'})
    
    # Client endpoints
    @app.route('/api/v1/clients', methods=['GET'])
    @login_required
    def get_clients():
        clients = Client.query.filter_by(active=True).all()
        return jsonify([client.to_dict() for client in clients])
    
    @app.route('/api/v1/clients', methods=['POST'])
    @admin_required
    def create_client():
        data = request.get_json()
        
        required_fields = ['name', 'email']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        client = Client(
            name=data['name'],
            email=data['email'],
            contact_name=data.get('contact_name'),
            phone=data.get('phone'),
            notes=data.get('notes')
        )
        
        db.session.add(client)
        db.session.commit()
        
        return jsonify(client.to_dict()), 201
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            "message": "Peppermint Ticketing System API",
            "version": "1.0.0",
            "status": "running"
        })
    
    return app

if __name__ == '__main__':
    app = create_app('development')  # Force development config
    port = int(os.environ.get('PORT', 5003))
    app.run(host='0.0.0.0', port=port, debug=app.config['DEBUG']) 