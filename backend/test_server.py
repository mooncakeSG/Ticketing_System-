#!/usr/bin/env python3
"""
Simple test script to debug the server startup issue
"""
from flask import Flask, jsonify
import os

def create_test_app():
    app = Flask(__name__)
    
    @app.route('/test', methods=['GET'])
    def test():
        return jsonify({"message": "Test endpoint working!"})
    
    return app

if __name__ == '__main__':
    print("Creating test app...")
    app = create_test_app()
    print("Starting test server...")
    app.run(host='127.0.0.1', port=5004, debug=True) 