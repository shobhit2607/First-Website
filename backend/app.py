from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
import google.generativeai as genai
import os
from dotenv import load_dotenv
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pickle
import json
from datetime import datetime, timedelta
import bcrypt

load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/career_advisor')

CORS(app)
jwt = JWTManager(app)
mongo = PyMongo(app)

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# Career data and ML model
career_data = {
    'Software Developer': {
        'skills': ['Programming', 'Problem Solving', 'Debugging', 'Version Control', 'Testing'],
        'interests': ['Technology', 'Problem Solving', 'Innovation'],
        'personality': ['Analytical', 'Detail-oriented', 'Logical'],
        'salary_range': [60000, 120000],
        'growth_rate': 22,
        'description': 'Design, develop, and maintain software applications'
    },
    'Data Analyst': {
        'skills': ['Statistics', 'Data Visualization', 'SQL', 'Python', 'Excel'],
        'interests': ['Data', 'Research', 'Analytics'],
        'personality': ['Analytical', 'Curious', 'Detail-oriented'],
        'salary_range': [50000, 90000],
        'growth_rate': 25,
        'description': 'Analyze data to help organizations make informed decisions'
    },
    'UX Designer': {
        'skills': ['User Research', 'Wireframing', 'Prototyping', 'Figma', 'User Testing'],
        'interests': ['Design', 'User Experience', 'Psychology'],
        'personality': ['Creative', 'Empathetic', 'User-focused'],
        'salary_range': [55000, 100000],
        'growth_rate': 20,
        'description': 'Design user experiences for digital products'
    },
    'Product Manager': {
        'skills': ['Project Management', 'Communication', 'Strategic Thinking', 'Data Analysis', 'Leadership'],
        'interests': ['Business', 'Strategy', 'Technology'],
        'personality': ['Leadership', 'Strategic', 'Communication'],
        'salary_range': [70000, 150000],
        'growth_rate': 18,
        'description': 'Lead product development and strategy'
    },
    'Machine Learning Engineer': {
        'skills': ['Python', 'Machine Learning', 'Statistics', 'Deep Learning', 'Data Processing'],
        'interests': ['AI', 'Data Science', 'Research'],
        'personality': ['Analytical', 'Research-oriented', 'Technical'],
        'salary_range': [80000, 140000],
        'growth_rate': 30,
        'description': 'Build and deploy machine learning models'
    }
}

# Initialize ML model
def initialize_ml_model():
    # Create training data
    training_data = []
    labels = []
    
    for career, data in career_data.items():
        for _ in range(10):  # Generate multiple samples per career
            skills_score = np.random.randint(0, 5, len(data['skills']))
            interests_score = np.random.randint(0, 5, len(data['interests']))
            personality_score = np.random.randint(0, 5, len(data['personality']))
            
            features = np.concatenate([skills_score, interests_score, personality_score])
            training_data.append(features)
            labels.append(career)
    
    # Train model
    X = np.array(training_data)
    y = np.array(labels)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    return model

ml_model = initialize_ml_model()

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
    
    if mongo.db.users.find_one({'email': data['email']}):
        return jsonify({'error': 'User already exists'}), 400
    
    hashed_password = generate_password_hash(data['password'])
    
    user = {
        'email': data['email'],
        'password': hashed_password,
        'name': data.get('name', ''),
        'created_at': datetime.utcnow(),
        'skills': [],
        'interests': [],
        'personality_type': '',
        'recommendations': [],
        'progress': {}
    }
    
    mongo.db.users.insert_one(user)
    
    access_token = create_access_token(identity=data['email'])
    return jsonify({'token': access_token, 'user': {'email': data['email'], 'name': user['name']}})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
    
    user = mongo.db.users.find_one({'email': data['email']})
    
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=data['email'])
    return jsonify({'token': access_token, 'user': {'email': user['email'], 'name': user['name']}})

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    email = get_jwt_identity()
    user = mongo.db.users.find_one({'email': email}, {'password': 0})
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'user': user})

@app.route('/api/quiz', methods=['POST'])
@jwt_required()
def submit_quiz():
    email = get_jwt_identity()
    data = request.get_json()
    
    # Prepare features for ML model
    all_skills = []
    all_interests = []
    all_personality = []
    
    for career_data_item in career_data.values():
        all_skills.extend(career_data_item['skills'])
        all_interests.extend(career_data_item['interests'])
        all_personality.extend(career_data_item['personality'])
    
    all_skills = list(set(all_skills))
    all_interests = list(set(all_interests))
    all_personality = list(set(all_personality))
    
    # Create feature vector
    skills_vector = [data.get('skills', {}).get(skill, 0) for skill in all_skills]
    interests_vector = [data.get('interests', {}).get(interest, 0) for interest in all_interests]
    personality_vector = [data.get('personality', {}).get(trait, 0) for trait in all_personality]
    
    features = np.array(skills_vector + interests_vector + personality_vector).reshape(1, -1)
    
    # Get predictions
    probabilities = ml_model.predict_proba(features)[0]
    classes = ml_model.classes_
    
    # Get top 5 recommendations
    top_indices = np.argsort(probabilities)[-5:][::-1]
    recommendations = []
    
    for idx in top_indices:
        career = classes[idx]
        probability = probabilities[idx]
        career_info = career_data[career].copy()
        career_info['match_percentage'] = round(probability * 100, 1)
        recommendations.append(career_info)
    
    # Update user profile
    mongo.db.users.update_one(
        {'email': email},
        {
            '$set': {
                'skills': data.get('skills', {}),
                'interests': data.get('interests', {}),
                'personality_type': data.get('personality_type', ''),
                'recommendations': recommendations,
                'last_quiz_date': datetime.utcnow()
            }
        }
    )
    
    return jsonify({'recommendations': recommendations})

@app.route('/api/chat', methods=['POST'])
@jwt_required()
def chat_with_gemini():
    email = get_jwt_identity()
    data = request.get_json()
    user_message = data.get('message', '')
    
    if not user_message:
        return jsonify({'error': 'Message is required'}), 400
    
    # Get user profile for context
    user = mongo.db.users.find_one({'email': email})
    
    # Create context for Gemini
    context = f"""
    You are an AI career advisor helping a user with their career development.
    User's current skills: {user.get('skills', {})}
    User's interests: {user.get('interests', {})}
    User's personality type: {user.get('personality_type', '')}
    User's recent recommendations: {user.get('recommendations', [])}
    
    Please provide helpful, personalized career advice based on this context.
    """
    
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(context + "\n\nUser question: " + user_message)
        
        # Save chat history
        chat_entry = {
            'user_message': user_message,
            'ai_response': response.text,
            'timestamp': datetime.utcnow(),
            'user_email': email
        }
        mongo.db.chat_history.insert_one(chat_entry)
        
        return jsonify({'response': response.text})
    
    except Exception as e:
        return jsonify({'error': 'Failed to get AI response', 'details': str(e)}), 500

@app.route('/api/courses', methods=['GET'])
def get_courses():
    career = request.args.get('career', '')
    
    # Mock course data - in production, integrate with real APIs
    courses = {
        'Software Developer': [
            {'title': 'Complete Web Development Bootcamp', 'platform': 'Udemy', 'rating': 4.7, 'price': '$89.99'},
            {'title': 'CS50: Introduction to Computer Science', 'platform': 'Harvard', 'rating': 4.8, 'price': 'Free'},
            {'title': 'JavaScript Algorithms and Data Structures', 'platform': 'freeCodeCamp', 'rating': 4.9, 'price': 'Free'}
        ],
        'Data Analyst': [
            {'title': 'Data Science Specialization', 'platform': 'Coursera', 'rating': 4.6, 'price': '$39/month'},
            {'title': 'Python for Data Science', 'platform': 'edX', 'rating': 4.5, 'price': '$99'},
            {'title': 'Tableau Desktop Specialist', 'platform': 'Tableau', 'rating': 4.7, 'price': '$199'}
        ]
    }
    
    return jsonify({'courses': courses.get(career, [])})

@app.route('/api/progress', methods=['POST'])
@jwt_required()
def update_progress():
    email = get_jwt_identity()
    data = request.get_json()
    
    skill = data.get('skill')
    progress = data.get('progress', 0)
    
    if not skill:
        return jsonify({'error': 'Skill is required'}), 400
    
    mongo.db.users.update_one(
        {'email': email},
        {
            '$set': {
                f'progress.{skill}': {
                    'value': progress,
                    'updated_at': datetime.utcnow()
                }
            }
        }
    )
    
    return jsonify({'message': 'Progress updated successfully'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)