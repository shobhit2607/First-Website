from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import uuid
import random

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

# Database configuration
if os.getenv('DATABASE_URL'):
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///exam_platform.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
CORS(app)

# Models
class User(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    exam_type = db.Column(db.String(50))
    role = db.Column(db.String(20), default='student')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    test_results = db.relationship('TestResult', backref='user', lazy=True)

class Exam(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    subjects = db.relationship('Subject', backref='exam', lazy=True)
    questions = db.relationship('Question', backref='exam', lazy=True)

class Subject(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    exam_id = db.Column(db.String(36), db.ForeignKey('exam.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    questions = db.relationship('Question', backref='subject', lazy=True)

class Question(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    exam_id = db.Column(db.String(36), db.ForeignKey('exam.id'), nullable=False)
    subject_id = db.Column(db.String(36), db.ForeignKey('subject.id'), nullable=False)
    difficulty = db.Column(db.String(20), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    options = db.Column(db.JSON, nullable=False)  # List of options
    correct_answer = db.Column(db.String(500), nullable=False)
    explanation = db.Column(db.Text)
    topic = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class TestResult(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    exam_id = db.Column(db.String(36), db.ForeignKey('exam.id'), nullable=False)
    subject_id = db.Column(db.String(36), db.ForeignKey('subject.id'), nullable=False)
    answers = db.Column(db.JSON, nullable=False)  # Dict of question_id: answer
    score = db.Column(db.Float, nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
    correct_answers = db.Column(db.Integer, nullable=False)
    wrong_answers = db.Column(db.Integer, nullable=False)
    time_spent = db.Column(db.Integer)  # in minutes
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

# Sample data
def create_sample_data():
    if Exam.query.first() is None:
        # Create exams
        exams = [
            Exam(name='JEE Main & Advanced', description='Joint Entrance Examination'),
            Exam(name='NEET', description='National Eligibility cum Entrance Test'),
            Exam(name='SSC CGL', description='Staff Selection Commission Combined Graduate Level'),
            Exam(name='UPSC Civil Services', description='Union Public Service Commission Civil Services'),
            Exam(name='Banking Exams', description='Banking and Financial Services'),
            Exam(name='Railway Exams', description='Railway Recruitment Board Exams')
        ]
        
        for exam in exams:
            db.session.add(exam)
        
        db.session.commit()
        
        # Create subjects for each exam
        subjects_data = {
            'JEE Main & Advanced': ['Physics', 'Chemistry', 'Mathematics'],
            'NEET': ['Physics', 'Chemistry', 'Biology'],
            'SSC CGL': ['Quantitative Aptitude', 'General Intelligence', 'English Language', 'General Awareness'],
            'UPSC Civil Services': ['General Studies', 'Optional Subject', 'Essay', 'Current Affairs'],
            'Banking Exams': ['Quantitative Aptitude', 'Reasoning Ability', 'English Language', 'General Awareness'],
            'Railway Exams': ['Mathematics', 'General Intelligence', 'General Science', 'Current Affairs']
        }
        
        for exam_name, subjects in subjects_data.items():
            exam = Exam.query.filter_by(name=exam_name).first()
            for subject_name in subjects:
                subject = Subject(name=subject_name, exam_id=exam.id)
                db.session.add(subject)
        
        db.session.commit()
        
        # Create sample questions
        create_sample_questions()

def create_sample_questions():
    # Sample questions for JEE Physics
    jee_exam = Exam.query.filter_by(name='JEE Main & Advanced').first()
    physics_subject = Subject.query.filter_by(name='Physics', exam_id=jee_exam.id).first()
    
    sample_questions = [
        {
            'question_text': 'What is the SI unit of electric current?',
            'options': ['Ampere', 'Volt', 'Ohm', 'Watt'],
            'correct_answer': 'Ampere',
            'explanation': 'The SI unit of electric current is Ampere (A), named after André-Marie Ampère.',
            'topic': 'Electricity',
            'difficulty': 'easy'
        },
        {
            'question_text': 'A particle moves in a circle of radius 2m with constant speed. If it completes 5 revolutions in 10 seconds, what is its angular velocity?',
            'options': ['π rad/s', '2π rad/s', '5π rad/s', '10π rad/s'],
            'correct_answer': 'π rad/s',
            'explanation': 'Angular velocity = 2π × frequency = 2π × (5/10) = π rad/s',
            'topic': 'Circular Motion',
            'difficulty': 'medium'
        },
        {
            'question_text': 'In Young\'s double slit experiment, if the wavelength of light is doubled, what happens to the fringe width?',
            'options': ['Doubles', 'Halves', 'Remains same', 'Becomes four times'],
            'correct_answer': 'Doubles',
            'explanation': 'Fringe width β = λD/d, so if λ doubles, β also doubles.',
            'topic': 'Wave Optics',
            'difficulty': 'hard'
        }
    ]
    
    for q_data in sample_questions:
        question = Question(
            exam_id=jee_exam.id,
            subject_id=physics_subject.id,
            difficulty=q_data['difficulty'],
            question_text=q_data['question_text'],
            options=q_data['options'],
            correct_answer=q_data['correct_answer'],
            explanation=q_data['explanation'],
            topic=q_data['topic']
        )
        db.session.add(question)
    
    db.session.commit()

# Auth routes
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'User already exists'}), 400
        
        # Create new user
        user = User(
            name=data['name'],
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            exam_type=data.get('examType', ''),
            role='student'
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'User created successfully',
            'token': access_token,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'examType': user.exam_type,
                'role': user.role
            }
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        
        if user and check_password_hash(user.password_hash, data['password']):
            access_token = create_access_token(identity=user.id)
            return jsonify({
                'message': 'Login successful',
                'token': access_token,
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'examType': user.exam_type,
                    'role': user.role
                }
            }), 200
        else:
            return jsonify({'message': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'examType': user.exam_type,
            'role': user.role,
            'createdAt': user.created_at.isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/auth/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        data = request.get_json()
        user.name = data.get('name', user.name)
        user.email = data.get('email', user.email)
        user.exam_type = data.get('examType', user.exam_type)
        
        db.session.commit()
        
        return jsonify({
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'examType': user.exam_type,
            'role': user.role
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Exam routes
@app.route('/api/exams', methods=['GET'])
def get_exams():
    try:
        exams = Exam.query.all()
        return jsonify([{
            'id': exam.id,
            'name': exam.name,
            'description': exam.description
        } for exam in exams]), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/exams/<exam_id>/subjects', methods=['GET'])
def get_subjects(exam_id):
    try:
        subjects = Subject.query.filter_by(exam_id=exam_id).all()
        return jsonify([{
            'id': subject.id,
            'name': subject.name
        } for subject in subjects]), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Test routes
@app.route('/api/tests/start', methods=['POST'])
@jwt_required()
def start_test():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Get questions based on criteria
        questions_query = Question.query.filter_by(
            exam_id=data['examId'],
            subject_id=data['subjectId'],
            difficulty=data['difficulty']
        )
        
        questions = questions_query.limit(data['numQuestions']).all()
        
        if len(questions) < data['numQuestions']:
            # Generate additional questions if needed
            additional_needed = data['numQuestions'] - len(questions)
            # For now, just duplicate some questions
            all_questions = questions_query.all()
            while len(questions) < data['numQuestions'] and all_questions:
                questions.append(random.choice(all_questions))
        
        # Create test result record
        test_result = TestResult(
            user_id=user_id,
            exam_id=data['examId'],
            subject_id=data['subjectId'],
            answers={},
            score=0,
            total_questions=len(questions),
            correct_answers=0,
            wrong_answers=0
        )
        
        db.session.add(test_result)
        db.session.commit()
        
        # Get exam and subject names
        exam = Exam.query.get(data['examId'])
        subject = Subject.query.get(data['subjectId'])
        
        return jsonify({
            'id': test_result.id,
            'examName': exam.name,
            'subjectName': subject.name,
            'questions': [{
                'id': q.id,
                'questionText': q.question_text,
                'options': q.options,
                'difficulty': q.difficulty,
                'topic': q.topic
            } for q in questions],
            'duration': 60  # 60 minutes default
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/tests/<test_id>/submit', methods=['POST'])
@jwt_required()
def submit_test(test_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        test_result = TestResult.query.get(test_id)
        if not test_result or test_result.user_id != user_id:
            return jsonify({'message': 'Test not found'}), 404
        
        # Calculate score
        correct_count = 0
        questions = Question.query.filter(Question.id.in_(data['answers'].keys())).all()
        
        for question in questions:
            if data['answers'][question.id] == question.correct_answer:
                correct_count += 1
        
        wrong_count = len(data['answers']) - correct_count
        score = (correct_count / test_result.total_questions) * 100
        
        # Update test result
        test_result.answers = data['answers']
        test_result.score = round(score, 2)
        test_result.correct_answers = correct_count
        test_result.wrong_answers = wrong_count
        test_result.completed_at = datetime.utcnow()
        
        db.session.commit()
        
        # Get exam and subject names
        exam = Exam.query.get(test_result.exam_id)
        subject = Subject.query.get(test_result.subject_id)
        
        return jsonify({
            'id': test_result.id,
            'examName': exam.name,
            'subjectName': subject.name,
            'score': test_result.score,
            'totalQuestions': test_result.total_questions,
            'correctAnswers': test_result.correct_answers,
            'wrongAnswers': test_result.wrong_answers,
            'timeSpent': test_result.time_spent or 0,
            'questions': [{
                'id': q.id,
                'questionText': q.question_text,
                'options': q.options,
                'correctAnswer': q.correct_answer,
                'userAnswer': data['answers'].get(q.id),
                'isCorrect': data['answers'].get(q.id) == q.correct_answer,
                'explanation': q.explanation,
                'topic': q.topic
            } for q in questions]
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/tests/<test_id>/results', methods=['GET'])
@jwt_required()
def get_test_results(test_id):
    try:
        user_id = get_jwt_identity()
        test_result = TestResult.query.get(test_id)
        
        if not test_result or test_result.user_id != user_id:
            return jsonify({'message': 'Test not found'}), 404
        
        # Get exam and subject names
        exam = Exam.query.get(test_result.exam_id)
        subject = Subject.query.get(test_result.subject_id)
        
        # Get questions with details
        questions = Question.query.filter(Question.id.in_(test_result.answers.keys())).all()
        
        return jsonify({
            'id': test_result.id,
            'examName': exam.name,
            'subjectName': subject.name,
            'score': test_result.score,
            'totalQuestions': test_result.total_questions,
            'correctAnswers': test_result.correct_answers,
            'wrongAnswers': test_result.wrong_answers,
            'timeSpent': test_result.time_spent or 0,
            'completedAt': test_result.completed_at.isoformat(),
            'questions': [{
                'id': q.id,
                'questionText': q.question_text,
                'options': q.options,
                'correctAnswer': q.correct_answer,
                'userAnswer': test_result.answers.get(q.id),
                'isCorrect': test_result.answers.get(q.id) == q.correct_answer,
                'explanation': q.explanation,
                'topic': q.topic
            } for q in questions]
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/tests/history/<user_id>', methods=['GET'])
@jwt_required()
def get_test_history(user_id):
    try:
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        test_results = TestResult.query.filter_by(user_id=user_id).order_by(TestResult.completed_at.desc()).all()
        
        results = []
        for tr in test_results:
            exam = Exam.query.get(tr.exam_id)
            subject = Subject.query.get(tr.subject_id)
            
            results.append({
                'id': tr.id,
                'examName': exam.name,
                'subjectName': subject.name,
                'score': tr.score,
                'totalQuestions': tr.total_questions,
                'completedAt': tr.completed_at.isoformat()
            })
        
        return jsonify(results), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Question routes
@app.route('/api/questions', methods=['GET'])
@jwt_required()
def get_questions():
    try:
        filters = request.args
        query = Question.query
        
        if filters.get('examId'):
            query = query.filter_by(exam_id=filters['examId'])
        if filters.get('subjectId'):
            query = query.filter_by(subject_id=filters['subjectId'])
        if filters.get('difficulty'):
            query = query.filter_by(difficulty=filters['difficulty'])
        
        questions = query.all()
        
        return jsonify([{
            'id': q.id,
            'examId': q.exam_id,
            'subjectId': q.subject_id,
            'examName': q.exam.name,
            'subjectName': q.subject.name,
            'difficulty': q.difficulty,
            'questionText': q.question_text,
            'options': q.options,
            'correctAnswer': q.correct_answer,
            'explanation': q.explanation,
            'topic': q.topic,
            'createdAt': q.created_at.isoformat()
        } for q in questions]), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/questions', methods=['POST'])
@jwt_required()
def add_question():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if user.role != 'admin':
            return jsonify({'message': 'Admin access required'}), 403
        
        data = request.get_json()
        
        question = Question(
            exam_id=data['examId'],
            subject_id=data['subjectId'],
            difficulty=data['difficulty'],
            question_text=data['questionText'],
            options=data['options'],
            correct_answer=data['correctAnswer'],
            explanation=data.get('explanation', ''),
            topic=data.get('topic', '')
        )
        
        db.session.add(question)
        db.session.commit()
        
        return jsonify({
            'id': question.id,
            'message': 'Question added successfully'
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Admin routes
@app.route('/api/admin/users', methods=['GET'])
@jwt_required()
def get_users():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if user.role != 'admin':
            return jsonify({'message': 'Admin access required'}), 403
        
        users = User.query.all()
        
        return jsonify([{
            'id': u.id,
            'name': u.name,
            'email': u.email,
            'examType': u.exam_type,
            'role': u.role,
            'createdAt': u.created_at.isoformat(),
            'testsTaken': len(u.test_results),
            'averageScore': sum(tr.score for tr in u.test_results) / len(u.test_results) if u.test_results else 0
        } for u in users]), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/admin/stats', methods=['GET'])
@jwt_required()
def get_admin_stats():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if user.role != 'admin':
            return jsonify({'message': 'Admin access required'}), 403
        
        total_users = User.query.count()
        total_questions = Question.query.count()
        total_tests = TestResult.query.count()
        
        # Calculate average score
        test_results = TestResult.query.all()
        average_score = sum(tr.score for tr in test_results) / len(test_results) if test_results else 0
        
        return jsonify({
            'totalUsers': total_users,
            'totalQuestions': total_questions,
            'totalTests': total_tests,
            'averageScore': round(average_score, 2)
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'message': 'Internal server error'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        create_sample_data()
    
    app.run(debug=True, host='0.0.0.0', port=5000)