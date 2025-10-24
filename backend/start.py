#!/usr/bin/env python3
"""
AI Career Advisor Backend Startup Script
"""

import os
import sys
from app import app

if __name__ == '__main__':
    # Set environment variables if not already set
    if not os.getenv('JWT_SECRET_KEY'):
        os.environ['JWT_SECRET_KEY'] = 'your-super-secret-jwt-key-change-this-in-production'
    
    if not os.getenv('MONGO_URI'):
        os.environ['MONGO_URI'] = 'mongodb://localhost:27017/career_advisor'
    
    if not os.getenv('GEMINI_API_KEY'):
        print("Warning: GEMINI_API_KEY not set. AI chat features will not work.")
        print("Please set your Gemini API key in the .env file or environment variables.")
    
    # Start the Flask application
    print("🚀 Starting AI Career Advisor Backend...")
    print("📍 Backend running on: http://localhost:5000")
    print("📚 API Documentation: http://localhost:5000/api")
    print("🔧 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)