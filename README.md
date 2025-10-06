# Indian Exam Test Platform

A comprehensive web platform for students to take practice tests for various Indian competitive exams including JEE, NEET, SSC, UPSC, Banking, and Railway exams.

## Features

### Frontend (React)
- **Landing Page**: Modern, responsive design with exam information
- **Authentication**: Login/Signup with email and social login options
- **Dashboard**: User profile, test history, and performance analytics
- **Exam Selection**: Choose exam type, subject, difficulty, and number of questions
- **Test Interface**: Real-time test taking with timer and navigation
- **Results Page**: Detailed score analysis with explanations
- **Admin Panel**: Question management and user analytics

### Backend (Flask)
- **RESTful API**: Complete API for all frontend operations
- **Authentication**: JWT-based authentication system
- **Database**: SQLAlchemy with PostgreSQL/SQLite support
- **Question Management**: CRUD operations for questions
- **Test Engine**: Dynamic question generation and scoring
- **Analytics**: User performance tracking and statistics

## Tech Stack

### Frontend
- React 18
- React Router 6
- Tailwind CSS
- Framer Motion
- Axios
- React Hot Toast
- Heroicons

### Backend
- Python Flask
- Flask-SQLAlchemy
- Flask-JWT-Extended
- Flask-CORS
- PostgreSQL/SQLite
- Bcrypt

### Optional AI Integration
- OpenAI GPT API for dynamic question generation
- Gemini API support

## Installation

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- PostgreSQL (optional, SQLite works for development)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create environment file:
```bash
cp .env.example .env
```

5. Update `.env` with your configuration:
```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DATABASE_URL=sqlite:///exam_platform.db
OPENAI_API_KEY=your-openai-api-key-here
FLASK_ENV=development
```

6. Run the Flask application:
```bash
python app.py
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_OPENAI_API_KEY=your-openai-api-key-here
```

5. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

### Quick Start (All at once)

From the root directory:

```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Exams
- `GET /api/exams` - List all exams
- `GET /api/exams/<id>/subjects` - Get subjects for an exam

### Tests
- `POST /api/tests/start` - Start a new test
- `POST /api/tests/<id>/submit` - Submit test answers
- `GET /api/tests/<id>/results` - Get test results
- `GET /api/tests/history/<user_id>` - Get user test history

### Questions
- `GET /api/questions` - List questions (with filters)
- `POST /api/questions` - Add new question (admin only)

### Admin
- `GET /api/admin/users` - List all users (admin only)
- `GET /api/admin/stats` - Get platform statistics (admin only)

## Database Schema

### Users
- id, name, email, password_hash, exam_type, role, created_at

### Exams
- id, name, description, created_at

### Subjects
- id, name, exam_id, created_at

### Questions
- id, exam_id, subject_id, difficulty, question_text, options, correct_answer, explanation, topic, created_at

### Test Results
- id, user_id, exam_id, subject_id, answers, score, total_questions, correct_answers, wrong_answers, time_spent, completed_at

## Features in Detail

### Test Taking Experience
- **Timer**: Real-time countdown with auto-submission
- **Navigation**: Previous/Next buttons and question grid
- **Progress Tracking**: Visual indicators for answered/unanswered questions
- **Auto-save**: Answers are saved as you progress

### Results and Analytics
- **Score Breakdown**: Detailed analysis of correct/incorrect answers
- **Explanations**: Step-by-step solutions for each question
- **Weak Areas**: Identification of topics needing improvement
- **Performance Trends**: Historical performance tracking

### Admin Features
- **Question Management**: Add, edit, delete questions
- **User Management**: View user statistics and performance
- **Analytics Dashboard**: Platform-wide statistics and insights

## Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `build` folder to your hosting service

### Backend (Heroku/Render)
1. Create a `Procfile`:
```
web: gunicorn app:app
```

2. Set environment variables in your hosting platform

3. Deploy using Git or direct upload

### Environment Variables for Production

**Backend:**
- `SECRET_KEY`: Flask secret key
- `JWT_SECRET_KEY`: JWT signing key
- `DATABASE_URL`: PostgreSQL connection string
- `FLASK_ENV`: production

**Frontend:**
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_OPENAI_API_KEY`: OpenAI API key (optional)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the GitHub repository.

## Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics and reporting
- [ ] Multi-language support (Hindi)
- [ ] Offline test taking capability
- [ ] Social features and leaderboards
- [ ] AI-powered personalized study plans
- [ ] Video explanations for questions
- [ ] PDF report generation
- [ ] Integration with more exam types
- [ ] Adaptive difficulty algorithms