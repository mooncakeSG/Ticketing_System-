from functools import wraps
from flask import request, jsonify, current_app
from flask_jwt_extended import create_access_token, decode_token, get_jwt_identity, verify_jwt_in_request
from models import User
from datetime import datetime
import jwt

def create_token(user):
    """Create a JWT token for a user"""
    # Store user ID as the identity (string) and user data in additional claims
    return create_access_token(
        identity=user.id,
        additional_claims={
            'email': user.email,
            'is_admin': user.is_admin,
            'role': user.role
        }
    )

def verify_token(token):
    """Verify a JWT token and return user data"""
    try:
        decoded = decode_token(token)
        return decoded['sub']
    except Exception as e:
        return None

def get_current_user():
    """Get the current user from the JWT token"""
    try:
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        print(f"JWT Identity (user_id): {user_id}")
        
        if user_id:
            user = User.query.get(user_id)
            print(f"Found user: {user}")
            if user:
                # Update last login
                user.last_login = datetime.utcnow()
                from models import db
                db.session.commit()
            return user
        return None
    except Exception as e:
        print(f"Error getting current user: {e}")
        return None

def login_required(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """Decorator to require admin privileges"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        if not user.is_admin:
            return jsonify({'error': 'Admin privileges required'}), 403
        return f(*args, **kwargs)
    return decorated_function

def role_required(required_role):
    """Decorator to require specific role"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = get_current_user()
            if not user:
                return jsonify({'error': 'Authentication required'}), 401
            if user.role != required_role and not user.is_admin:
                return jsonify({'error': f'{required_role} role required'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def authenticate_user(email, password):
    """Authenticate a user with email and password"""
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        return user
    return None 