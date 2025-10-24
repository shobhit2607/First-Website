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

# Comprehensive career data and ML model
career_data = {
    'Software Developer': {
        'skills': ['Programming', 'Problem Solving', 'Debugging', 'Version Control', 'Testing', 'Algorithms', 'Data Structures', 'Software Architecture'],
        'interests': ['Technology', 'Problem Solving', 'Innovation', 'Coding', 'Software'],
        'personality': ['Analytical', 'Detail-oriented', 'Logical', 'Technical', 'Systematic'],
        'salary_range': [60000, 120000],
        'growth_rate': 22,
        'description': 'Design, develop, and maintain software applications',
        'learning_resources': [
            {'title': 'CS50: Introduction to Computer Science', 'platform': 'Harvard', 'type': 'Course', 'url': 'https://cs50.harvard.edu/'},
            {'title': 'The Complete Web Developer Bootcamp', 'platform': 'Udemy', 'type': 'Course', 'url': 'https://udemy.com/course/web-development-bootcamp'},
            {'title': 'LeetCode Practice', 'platform': 'LeetCode', 'type': 'Practice', 'url': 'https://leetcode.com/'}
        ],
        'required_skills': ['Programming Languages (Python, JavaScript, Java)', 'Version Control (Git)', 'Testing', 'Software Design Patterns'],
        'soft_skills': ['Problem Solving', 'Communication', 'Teamwork', 'Continuous Learning']
    },
    'Data Analyst': {
        'skills': ['Statistics', 'Data Visualization', 'SQL', 'Python', 'Excel', 'R', 'Tableau', 'Power BI'],
        'interests': ['Data', 'Research', 'Analytics', 'Mathematics', 'Statistics'],
        'personality': ['Analytical', 'Curious', 'Detail-oriented', 'Research-oriented', 'Logical'],
        'salary_range': [50000, 90000],
        'growth_rate': 25,
        'description': 'Analyze data to help organizations make informed decisions',
        'learning_resources': [
            {'title': 'Data Science Specialization', 'platform': 'Coursera', 'type': 'Course', 'url': 'https://coursera.org/specializations/jhu-data-science'},
            {'title': 'Python for Data Science', 'platform': 'edX', 'type': 'Course', 'url': 'https://edx.org/course/python-data-science'},
            {'title': 'Tableau Desktop Specialist', 'platform': 'Tableau', 'type': 'Certification', 'url': 'https://tableau.com/learn/certification'}
        ],
        'required_skills': ['SQL', 'Python/R', 'Statistics', 'Data Visualization Tools', 'Excel'],
        'soft_skills': ['Critical Thinking', 'Communication', 'Attention to Detail', 'Business Acumen']
    },
    'UX Designer': {
        'skills': ['User Research', 'Wireframing', 'Prototyping', 'Figma', 'User Testing', 'Information Architecture', 'Interaction Design'],
        'interests': ['Design', 'User Experience', 'Psychology', 'Human Behavior', 'Creativity'],
        'personality': ['Creative', 'Empathetic', 'User-focused', 'Innovative', 'Detail-oriented'],
        'salary_range': [55000, 100000],
        'growth_rate': 20,
        'description': 'Design user experiences for digital products',
        'learning_resources': [
            {'title': 'UX Design Fundamentals', 'platform': 'edX', 'type': 'Course', 'url': 'https://edx.org/course/ux-design-fundamentals'},
            {'title': 'Google UX Design Certificate', 'platform': 'Coursera', 'type': 'Certificate', 'url': 'https://coursera.org/professional-certificates/google-ux-design'},
            {'title': 'Figma Academy', 'platform': 'Figma', 'type': 'Tutorial', 'url': 'https://figma.com/academy'}
        ],
        'required_skills': ['User Research', 'Wireframing', 'Prototyping', 'Design Tools (Figma, Sketch)', 'User Testing'],
        'soft_skills': ['Empathy', 'Communication', 'Creativity', 'Problem Solving', 'Collaboration']
    },
    'Product Manager': {
        'skills': ['Project Management', 'Communication', 'Strategic Thinking', 'Data Analysis', 'Leadership', 'Market Research', 'Agile'],
        'interests': ['Business', 'Strategy', 'Technology', 'Innovation', 'Leadership'],
        'personality': ['Leadership', 'Strategic', 'Communication', 'Analytical', 'Visionary'],
        'salary_range': [70000, 150000],
        'growth_rate': 18,
        'description': 'Lead product development and strategy',
        'learning_resources': [
            {'title': 'Product Management Certificate', 'platform': 'Coursera', 'type': 'Certificate', 'url': 'https://coursera.org/professional-certificates/product-management'},
            {'title': 'Agile and Scrum Masterclass', 'platform': 'Udemy', 'type': 'Course', 'url': 'https://udemy.com/course/agile-scrum-masterclass'},
            {'title': 'Product School', 'platform': 'Product School', 'type': 'Bootcamp', 'url': 'https://productschool.com/'}
        ],
        'required_skills': ['Project Management', 'Data Analysis', 'Market Research', 'Agile/Scrum', 'Communication'],
        'soft_skills': ['Leadership', 'Strategic Thinking', 'Communication', 'Decision Making', 'Stakeholder Management']
    },
    'Machine Learning Engineer': {
        'skills': ['Python', 'Machine Learning', 'Statistics', 'Deep Learning', 'Data Processing', 'TensorFlow', 'PyTorch', 'MLOps'],
        'interests': ['AI', 'Data Science', 'Research', 'Mathematics', 'Technology'],
        'personality': ['Analytical', 'Research-oriented', 'Technical', 'Innovative', 'Detail-oriented'],
        'salary_range': [80000, 140000],
        'growth_rate': 30,
        'description': 'Build and deploy machine learning models',
        'learning_resources': [
            {'title': 'Machine Learning Specialization', 'platform': 'Coursera', 'type': 'Course', 'url': 'https://coursera.org/specializations/machine-learning-introduction'},
            {'title': 'Deep Learning Specialization', 'platform': 'Coursera', 'type': 'Course', 'url': 'https://coursera.org/specializations/deep-learning'},
            {'title': 'Fast.ai Practical Deep Learning', 'platform': 'Fast.ai', 'type': 'Course', 'url': 'https://course.fast.ai/'}
        ],
        'required_skills': ['Python', 'Machine Learning Algorithms', 'Deep Learning', 'Statistics', 'MLOps'],
        'soft_skills': ['Problem Solving', 'Research Skills', 'Communication', 'Continuous Learning', 'Attention to Detail']
    },
    'DevOps Engineer': {
        'skills': ['Linux', 'Docker', 'Kubernetes', 'AWS/Azure', 'CI/CD', 'Monitoring', 'Infrastructure as Code', 'Scripting'],
        'interests': ['Infrastructure', 'Automation', 'Cloud Computing', 'Technology', 'Operations'],
        'personality': ['Technical', 'Systematic', 'Problem-solving', 'Detail-oriented', 'Collaborative'],
        'salary_range': [70000, 130000],
        'growth_rate': 24,
        'description': 'Manage and automate infrastructure and deployment processes',
        'learning_resources': [
            {'title': 'AWS Certified DevOps Engineer', 'platform': 'AWS', 'type': 'Certification', 'url': 'https://aws.amazon.com/certification/certified-devops-engineer-professional/'},
            {'title': 'Docker and Kubernetes Course', 'platform': 'Udemy', 'type': 'Course', 'url': 'https://udemy.com/course/docker-and-kubernetes-the-complete-guide'},
            {'title': 'Linux Academy', 'platform': 'A Cloud Guru', 'type': 'Course', 'url': 'https://acloudguru.com/'}
        ],
        'required_skills': ['Linux Administration', 'Docker/Kubernetes', 'Cloud Platforms', 'CI/CD', 'Monitoring'],
        'soft_skills': ['Problem Solving', 'Communication', 'Collaboration', 'Attention to Detail', 'Adaptability']
    },
    'Cybersecurity Specialist': {
        'skills': ['Network Security', 'Penetration Testing', 'Risk Assessment', 'Security Tools', 'Incident Response', 'Compliance'],
        'interests': ['Security', 'Technology', 'Problem Solving', 'Risk Management', 'Ethics'],
        'personality': ['Analytical', 'Detail-oriented', 'Ethical', 'Vigilant', 'Problem-solving'],
        'salary_range': [65000, 120000],
        'growth_rate': 31,
        'description': 'Protect organizations from cyber threats and vulnerabilities',
        'learning_resources': [
            {'title': 'CompTIA Security+', 'platform': 'CompTIA', 'type': 'Certification', 'url': 'https://comptia.org/certifications/security'},
            {'title': 'Certified Ethical Hacker (CEH)', 'platform': 'EC-Council', 'type': 'Certification', 'url': 'https://eccouncil.org/programs/certified-ethical-hacker-ceh/'},
            {'title': 'Cybersecurity Specialization', 'platform': 'Coursera', 'type': 'Course', 'url': 'https://coursera.org/specializations/cybersecurity'}
        ],
        'required_skills': ['Network Security', 'Penetration Testing', 'Risk Assessment', 'Security Tools', 'Incident Response'],
        'soft_skills': ['Attention to Detail', 'Problem Solving', 'Communication', 'Ethical Mindset', 'Continuous Learning']
    },
    'Digital Marketer': {
        'skills': ['SEO', 'SEM', 'Social Media Marketing', 'Content Marketing', 'Analytics', 'Email Marketing', 'PPC'],
        'interests': ['Marketing', 'Social Media', 'Analytics', 'Creativity', 'Communication'],
        'personality': ['Creative', 'Analytical', 'Communication', 'Strategic', 'Adaptable'],
        'salary_range': [40000, 80000],
        'growth_rate': 16,
        'description': 'Promote products and services through digital channels',
        'learning_resources': [
            {'title': 'Google Digital Marketing Certificate', 'platform': 'Coursera', 'type': 'Certificate', 'url': 'https://coursera.org/professional-certificates/google-digital-marketing-ecommerce'},
            {'title': 'HubSpot Content Marketing', 'platform': 'HubSpot', 'type': 'Course', 'url': 'https://academy.hubspot.com/courses/content-marketing'},
            {'title': 'Facebook Blueprint', 'platform': 'Facebook', 'type': 'Course', 'url': 'https://facebook.com/blueprint'}
        ],
        'required_skills': ['SEO/SEM', 'Social Media Marketing', 'Content Creation', 'Analytics', 'Email Marketing'],
        'soft_skills': ['Creativity', 'Communication', 'Analytical Thinking', 'Adaptability', 'Strategic Thinking']
    }
}

# Enhanced ML model with better feature engineering
def initialize_ml_model():
    # Create comprehensive training data
    training_data = []
    labels = []
    
    # Get all unique skills, interests, and personality traits
    all_skills = set()
    all_interests = set()
    all_personality = set()
    
    for career_data_item in career_data.values():
        all_skills.update(career_data_item['skills'])
        all_interests.update(career_data_item['interests'])
        all_personality.update(career_data_item['personality'])
    
    all_skills = sorted(list(all_skills))
    all_interests = sorted(list(all_interests))
    all_personality = sorted(list(all_personality))
    
    # Generate more realistic training data
    for career, data in career_data.items():
        for _ in range(50):  # More samples for better training
            # Create realistic skill scores based on career requirements
            skills_score = []
            for skill in all_skills:
                if skill in data['skills']:
                    # Higher probability of high scores for required skills
                    score = np.random.choice([3, 4, 5], p=[0.2, 0.4, 0.4])
                else:
                    # Lower probability for non-required skills
                    score = np.random.choice([0, 1, 2, 3], p=[0.3, 0.3, 0.3, 0.1])
                skills_score.append(score)
            
            # Create realistic interest scores
            interests_score = []
            for interest in all_interests:
                if interest in data['interests']:
                    score = np.random.choice([3, 4, 5], p=[0.2, 0.4, 0.4])
                else:
                    score = np.random.choice([0, 1, 2, 3], p=[0.4, 0.3, 0.2, 0.1])
                interests_score.append(score)
            
            # Create realistic personality scores
            personality_score = []
            for trait in all_personality:
                if trait in data['personality']:
                    score = np.random.choice([3, 4, 5], p=[0.2, 0.4, 0.4])
                else:
                    score = np.random.choice([0, 1, 2, 3], p=[0.4, 0.3, 0.2, 0.1])
                personality_score.append(score)
            
            features = np.concatenate([skills_score, interests_score, personality_score])
            training_data.append(features)
            labels.append(career)
    
    # Train model with better parameters
    X = np.array(training_data)
    y = np.array(labels)
    
    model = RandomForestClassifier(
        n_estimators=200, 
        max_depth=10, 
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42
    )
    model.fit(X, y)
    
    # Store feature names for later use
    model.feature_names = all_skills + all_interests + all_personality
    
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
    
    # Create comprehensive context for Gemini
    user_skills = user.get('skills', {})
    user_interests = user.get('interests', {})
    user_personality = user.get('personality_type', '')
    user_recommendations = user.get('recommendations', [])
    
    # Get top recommended careers
    top_careers = [rec.get('name', '') for rec in user_recommendations[:3] if rec.get('name')]
    
    context = f"""
    You are an expert AI career advisor and skill development coach. You help students and professionals discover their ideal career paths and develop the necessary skills to succeed.

    USER PROFILE:
    - Current Skills: {user_skills}
    - Interests: {user_interests}
    - Personality Type: {user_personality}
    - Top Career Recommendations: {top_careers}
    
    AVAILABLE CAREERS IN OUR SYSTEM:
    {', '.join(career_data.keys())}
    
    INSTRUCTIONS:
    1. Provide personalized, actionable career advice based on the user's profile
    2. Suggest specific skills to develop and learning resources
    3. Recommend career paths that match their interests and personality
    4. Provide step-by-step guidance for career transitions
    5. Suggest projects and practical experience opportunities
    6. Be encouraging and supportive while being realistic
    7. If asked about specific careers, provide detailed information about requirements, salary, growth prospects, and learning paths
    8. Always include practical next steps the user can take immediately
    
    RESPONSE FORMAT:
    - Be conversational and engaging
    - Use bullet points for actionable items
    - Include specific resources and platforms when relevant
    - Keep responses comprehensive but not overwhelming
    - End with a motivating note or next step
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

@app.route('/api/skill-improvement', methods=['POST'])
@jwt_required()
def get_skill_improvement_plan():
    """Get personalized skill improvement plan using Gemini"""
    email = get_jwt_identity()
    data = request.get_json()
    skill = data.get('skill', '')
    career = data.get('career', '')
    
    if not skill:
        return jsonify({'error': 'Skill is required'}), 400
    
    user = mongo.db.users.find_one({'email': email})
    
    context = f"""
    You are an expert skill development coach. Create a comprehensive improvement plan for the skill: {skill}
    
    USER CONTEXT:
    - Current Skills: {user.get('skills', {})}
    - Target Career: {career}
    - Personality Type: {user.get('personality_type', '')}
    
    Create a detailed 30-day improvement plan that includes:
    1. Daily learning objectives
    2. Specific resources and tutorials
    3. Practice projects
    4. Milestones and checkpoints
    5. Tips for staying motivated
    6. How to measure progress
    
    Make it practical and actionable with specific steps the user can follow immediately.
    """
    
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(context)
        
        return jsonify({'improvement_plan': response.text})
    
    except Exception as e:
        return jsonify({'error': 'Failed to generate improvement plan', 'details': str(e)}), 500

@app.route('/api/courses', methods=['GET'])
def get_courses():
    career = request.args.get('career', '')
    
    if career and career in career_data:
        return jsonify({'courses': career_data[career].get('learning_resources', [])})
    
    # Return all courses if no specific career requested
    all_courses = []
    for career_name, data in career_data.items():
        if 'learning_resources' in data:
            for resource in data['learning_resources']:
                resource['career'] = career_name
                all_courses.append(resource)
    
    return jsonify({'courses': all_courses})

@app.route('/api/careers', methods=['GET'])
def get_careers():
    """Get all available careers with basic information"""
    careers = []
    for name, data in career_data.items():
        careers.append({
            'name': name,
            'description': data['description'],
            'salary_range': data['salary_range'],
            'growth_rate': data['growth_rate'],
            'required_skills': data.get('required_skills', []),
            'soft_skills': data.get('soft_skills', [])
        })
    
    return jsonify({'careers': careers})

@app.route('/api/career/<career_name>', methods=['GET'])
def get_career_details(career_name):
    """Get detailed information about a specific career"""
    if career_name not in career_data:
        return jsonify({'error': 'Career not found'}), 404
    
    return jsonify({'career': career_data[career_name]})

@app.route('/api/skills', methods=['GET'])
def get_skills():
    """Get all available skills"""
    all_skills = set()
    for data in career_data.values():
        all_skills.update(data['skills'])
    
    return jsonify({'skills': sorted(list(all_skills))})

@app.route('/api/interests', methods=['GET'])
def get_interests():
    """Get all available interests"""
    all_interests = set()
    for data in career_data.values():
        all_interests.update(data['interests'])
    
    return jsonify({'interests': sorted(list(all_interests))})

@app.route('/api/personality-traits', methods=['GET'])
def get_personality_traits():
    """Get all available personality traits"""
    all_traits = set()
    for data in career_data.values():
        all_traits.update(data['personality'])
    
    return jsonify({'traits': sorted(list(all_traits))})

@app.route('/api/analytics', methods=['GET'])
@jwt_required()
def get_analytics():
    """Get user analytics and insights"""
    email = get_jwt_identity()
    
    # Get user data
    user = mongo.db.users.find_one({'email': email})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Calculate analytics
    total_skills = len(user.get('skills', {}))
    completed_skills = len([s for s in user.get('progress', {}).values() if s.get('value', 0) >= 80])
    total_recommendations = len(user.get('recommendations', []))
    
    # Get chat history count
    chat_count = mongo.db.chat_history.count_documents({'user_email': email})
    
    analytics = {
        'total_skills': total_skills,
        'completed_skills': completed_skills,
        'skill_completion_rate': (completed_skills / total_skills * 100) if total_skills > 0 else 0,
        'total_recommendations': total_recommendations,
        'total_chat_messages': chat_count,
        'last_quiz_date': user.get('last_quiz_date'),
        'member_since': user.get('created_at')
    }
    
    return jsonify({'analytics': analytics})

@app.route('/api/chat-history', methods=['GET'])
@jwt_required()
def get_chat_history():
    """Get user's chat history"""
    email = get_jwt_identity()
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    
    skip = (page - 1) * limit
    
    chats = list(mongo.db.chat_history.find(
        {'user_email': email}
    ).sort('timestamp', -1).skip(skip).limit(limit))
    
    # Convert ObjectId to string for JSON serialization
    for chat in chats:
        chat['_id'] = str(chat['_id'])
        chat['timestamp'] = chat['timestamp'].isoformat()
    
    return jsonify({'chats': chats})

@app.route('/api/learning-path/<career_name>', methods=['GET'])
def get_learning_path(career_name):
    """Get a structured learning path for a specific career"""
    if career_name not in career_data:
        return jsonify({'error': 'Career not found'}), 404
    
    career = career_data[career_name]
    
    # Create a structured learning path
    learning_path = {
        'career': career_name,
        'description': career['description'],
        'phases': [
            {
                'phase': 'Foundation',
                'duration': '2-3 months',
                'skills': career['required_skills'][:2],
                'resources': [r for r in career.get('learning_resources', []) if r.get('type') == 'Course'][:2]
            },
            {
                'phase': 'Intermediate',
                'duration': '3-4 months',
                'skills': career['required_skills'][2:4] if len(career['required_skills']) > 2 else [],
                'resources': [r for r in career.get('learning_resources', []) if r.get('type') == 'Course'][2:4]
            },
            {
                'phase': 'Advanced',
                'duration': '2-3 months',
                'skills': career['required_skills'][4:] if len(career['required_skills']) > 4 else [],
                'resources': [r for r in career.get('learning_resources', []) if r.get('type') == 'Certification']
            }
        ],
        'soft_skills': career.get('soft_skills', []),
        'total_duration': '7-10 months'
    }
    
    return jsonify({'learning_path': learning_path})

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

@app.route('/api/internships', methods=['GET'])
def get_internships():
    """Get internship opportunities for specific careers"""
    career = request.args.get('career', '')
    location = request.args.get('location', '')
    
    # Mock internship data - in production, integrate with real job APIs
    internships = {
        'Software Developer': [
            {
                'title': 'Software Engineering Intern',
                'company': 'TechCorp Inc.',
                'location': 'San Francisco, CA',
                'duration': '3 months',
                'type': 'Paid',
                'description': 'Work on full-stack web applications using React and Node.js',
                'requirements': ['Python', 'JavaScript', 'React', 'Git'],
                'salary': '$25-30/hour',
                'apply_url': 'https://techcorp.com/careers/intern-software-engineer'
            },
            {
                'title': 'Frontend Development Intern',
                'company': 'StartupXYZ',
                'location': 'Remote',
                'duration': '6 months',
                'type': 'Paid',
                'description': 'Build user interfaces and improve user experience',
                'requirements': ['HTML', 'CSS', 'JavaScript', 'React'],
                'salary': '$20-25/hour',
                'apply_url': 'https://startupxyz.com/careers/frontend-intern'
            }
        ],
        'Data Analyst': [
            {
                'title': 'Data Science Intern',
                'company': 'DataCorp',
                'location': 'New York, NY',
                'duration': '4 months',
                'type': 'Paid',
                'description': 'Analyze large datasets and create visualizations',
                'requirements': ['Python', 'SQL', 'Statistics', 'Tableau'],
                'salary': '$22-28/hour',
                'apply_url': 'https://datacorp.com/careers/data-science-intern'
            }
        ],
        'UX Designer': [
            {
                'title': 'UX Design Intern',
                'company': 'DesignStudio',
                'location': 'Austin, TX',
                'duration': '3 months',
                'type': 'Paid',
                'description': 'Create wireframes, prototypes, and user research',
                'requirements': ['Figma', 'User Research', 'Wireframing', 'Prototyping'],
                'salary': '$18-22/hour',
                'apply_url': 'https://designstudio.com/careers/ux-intern'
            }
        ]
    }
    
    if career and career in internships:
        results = internships[career]
    else:
        # Return all internships if no specific career
        results = []
        for career_internships in internships.values():
            results.extend(career_internships)
    
    # Filter by location if specified
    if location:
        results = [intern for intern in results if location.lower() in intern['location'].lower()]
    
    return jsonify({'internships': results})

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    """Get job opportunities for specific careers"""
    career = request.args.get('career', '')
    experience_level = request.args.get('experience', 'entry')
    
    # Mock job data - in production, integrate with real job APIs
    jobs = {
        'Software Developer': [
            {
                'title': 'Junior Software Developer',
                'company': 'TechGiant Inc.',
                'location': 'Seattle, WA',
                'type': 'Full-time',
                'experience_level': 'Entry',
                'description': 'Develop and maintain web applications using modern technologies',
                'requirements': ['JavaScript', 'React', 'Node.js', 'Git', 'SQL'],
                'salary_range': '$60,000 - $80,000',
                'benefits': ['Health Insurance', '401k', 'Flexible Hours'],
                'apply_url': 'https://techgiant.com/careers/junior-developer'
            },
            {
                'title': 'Senior Software Engineer',
                'company': 'InnovateCorp',
                'location': 'San Francisco, CA',
                'type': 'Full-time',
                'experience_level': 'Senior',
                'description': 'Lead development of scalable software solutions',
                'requirements': ['Python', 'AWS', 'Docker', 'Kubernetes', 'Leadership'],
                'salary_range': '$120,000 - $160,000',
                'benefits': ['Health Insurance', '401k', 'Stock Options', 'Remote Work'],
                'apply_url': 'https://innovatecorp.com/careers/senior-engineer'
            }
        ],
        'Data Analyst': [
            {
                'title': 'Data Analyst',
                'company': 'AnalyticsPro',
                'location': 'Chicago, IL',
                'type': 'Full-time',
                'experience_level': 'Entry',
                'description': 'Analyze business data and create reports for stakeholders',
                'requirements': ['SQL', 'Python', 'Excel', 'Tableau', 'Statistics'],
                'salary_range': '$50,000 - $70,000',
                'benefits': ['Health Insurance', '401k', 'Professional Development'],
                'apply_url': 'https://analyticspro.com/careers/data-analyst'
            }
        ]
    }
    
    if career and career in jobs:
        results = jobs[career]
    else:
        results = []
        for career_jobs in jobs.values():
            results.extend(career_jobs)
    
    # Filter by experience level
    if experience_level:
        results = [job for job in results if job['experience_level'].lower() == experience_level.lower()]
    
    return jsonify({'jobs': results})

@app.route('/api/events', methods=['GET'])
def get_events():
    """Get career-related events and workshops"""
    career = request.args.get('career', '')
    
    # Mock events data
    events = [
        {
            'title': 'Tech Career Fair 2024',
            'date': '2024-03-15',
            'time': '10:00 AM - 4:00 PM',
            'location': 'Convention Center, Downtown',
            'type': 'Career Fair',
            'careers': ['Software Developer', 'Data Analyst', 'UX Designer'],
            'description': 'Meet with top tech companies and explore career opportunities',
            'registration_url': 'https://techcareerfair.com/register'
        },
        {
            'title': 'Data Science Workshop',
            'date': '2024-03-20',
            'time': '2:00 PM - 5:00 PM',
            'location': 'Online',
            'type': 'Workshop',
            'careers': ['Data Analyst', 'Machine Learning Engineer'],
            'description': 'Learn advanced data analysis techniques and tools',
            'registration_url': 'https://datascienceworkshop.com/register'
        },
        {
            'title': 'UX Design Portfolio Review',
            'date': '2024-03-25',
            'time': '6:00 PM - 8:00 PM',
            'location': 'Design Hub, Midtown',
            'type': 'Portfolio Review',
            'careers': ['UX Designer'],
            'description': 'Get feedback on your UX design portfolio from industry experts',
            'registration_url': 'https://uxportfolio.com/register'
        }
    ]
    
    if career:
        results = [event for event in events if career in event['careers']]
    else:
        results = events
    
    return jsonify({'events': results})

if __name__ == '__main__':
    app.run(debug=True, port=5000)