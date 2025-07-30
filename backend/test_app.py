#!/usr/bin/env python3
"""
Simplified version of our app without database to isolate the issue
"""
from flask import Flask, jsonify
from flask_cors import CORS
import os

def create_test_app():
    app = Flask(__name__)
    
    # Basic config
    app.config['SECRET_KEY'] = 'test-secret-key'
    app.config['DEBUG'] = True
    
    # Initialize CORS
    CORS(app, origins=['http://localhost:3000'])
    
    @app.route('/api/v1/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "healthy",
            "message": "Test app working!"
        })
    
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            "message": "Peppermint Test API",
            "status": "running"
        })
    
    return app

if __name__ == '__main__':
    print("Creating test app...")
    app = create_test_app()
    print("Starting test server on port 5005...")
    app.run(host='127.0.0.1', port=5005, debug=True) 