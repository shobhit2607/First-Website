# AI Career Path Recommender & Skill Advisor System

A comprehensive full-stack web application that helps students and professionals discover the best career paths based on their skills, interests, and personality. The system integrates AI-powered recommendations using machine learning and Gemini Pro API for personalized career guidance.

## 🚀 Features

### 🧠 Career Recommendation Engine
- **ML-powered career matching** based on skills, interests, and personality
- **Comprehensive assessment quiz** with multiple choice and rating scales
- **Top 5 career recommendations** with match percentages
- **Detailed career information** including salary ranges and growth rates

### 💬 AI-Powered Chatbot
- **Gemini Pro integration** for intelligent career advice
- **Contextual responses** based on user profile and quiz results
- **Real-time chat interface** with message history
- **Quick question suggestions** for common career queries

### 📊 Interactive Dashboard
- **Visual career recommendations** with charts and graphs
- **Progress tracking** for skill development
- **Personalized learning paths** and resource suggestions
- **Responsive design** with dark/light theme support

### 🔐 User Authentication
- **JWT-based authentication** for secure user sessions
- **User profile management** with skill tracking
- **Progress monitoring** and achievement tracking
- **Personalized recommendations** based on user history

### 🗃️ Database Integration
- **MongoDB** for storing user profiles and recommendations
- **Persistent chat history** and user preferences
- **Scalable data architecture** for future enhancements

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Notification system

### Backend
- **Python Flask** - Lightweight web framework
- **Flask-JWT-Extended** - JWT authentication
- **Flask-CORS** - Cross-origin resource sharing
- **PyMongo** - MongoDB integration
- **Scikit-learn** - Machine learning library
- **Google Generative AI** - Gemini Pro API integration

### Database
- **MongoDB** - NoSQL database for user data and recommendations

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (local or cloud instance)
- Gemini Pro API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-career-advisor
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
JWT_SECRET_KEY=your-super-secret-jwt-key
MONGO_URI=mongodb://localhost:27017/career_advisor
GEMINI_API_KEY=your-gemini-api-key-here
```

### 4. Start the Application
```bash
# Start both frontend and backend
npm run dev

# Or start them separately
npm run frontend  # Starts React app on port 3000
npm run backend   # Starts Flask API on port 5000
```

## 🎯 Usage

### 1. User Registration/Login
- Create a new account or login with existing credentials
- Complete your profile with basic information

### 2. Career Assessment Quiz
- Take the comprehensive quiz covering:
  - **Skills Assessment** (1-5 rating scale)
  - **Interests Survey** (multiple choice)
  - **Personality Traits** (rating scale)
  - **Personality Type** (single selection)

### 3. View Recommendations
- Get personalized career recommendations with:
  - Match percentages
  - Salary ranges
  - Growth rates
  - Required skills
  - Learning resources

### 4. AI Career Chat
- Ask questions about career development
- Get personalized advice based on your profile
- Receive learning recommendations and project ideas

### 5. Track Progress
- Monitor skill development over time
- Update progress for different skills
- View analytics and growth charts

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile (JWT required)

### Career Assessment
- `POST /api/quiz` - Submit quiz responses (JWT required)
- `GET /api/courses` - Get course recommendations

### AI Chat
- `POST /api/chat` - Send message to AI chatbot (JWT required)

### Progress Tracking
- `POST /api/progress` - Update skill progress (JWT required)

## 🤖 AI Integration

### Gemini Pro API
The system uses Google's Gemini Pro API for:
- **Intelligent career advice** based on user context
- **Personalized learning recommendations**
- **Dynamic responses** to career-related questions
- **Context-aware suggestions** based on user profile

### Machine Learning Model
- **Random Forest Classifier** for career recommendations
- **Feature engineering** from quiz responses
- **Probability-based matching** for accurate recommendations
- **Scalable model architecture** for easy updates

## 📊 Data Models

### User Profile
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "skills": {"Python": 4, "JavaScript": 3},
  "interests": {"Technology": 5, "Design": 4},
  "personality": {"Analytical": 4, "Creative": 3},
  "personality_type": "Analytical",
  "recommendations": [...],
  "progress": {...}
}
```

### Career Recommendation
```json
{
  "name": "Software Developer",
  "match_percentage": 85.5,
  "salary_range": [60000, 120000],
  "growth_rate": 22,
  "skills": ["Programming", "Problem Solving"],
  "description": "Design and develop software applications"
}
```

## 🚀 Deployment

### Frontend (React)
```bash
npm run build
# Deploy the 'build' folder to your hosting service
```

### Backend (Flask)
```bash
# Set production environment variables
export FLASK_ENV=production
python app.py
```

### Database (MongoDB)
- Use MongoDB Atlas for cloud deployment
- Configure connection string in environment variables
- Set up proper authentication and security

## 🔒 Security Features

- **JWT-based authentication** for secure API access
- **Password hashing** using bcrypt
- **CORS protection** for cross-origin requests
- **Input validation** and sanitization
- **Environment variable** protection for sensitive data

## 📈 Future Enhancements

- [ ] **Admin Dashboard** for managing career data
- [ ] **Course Integration** with real APIs (Coursera, Udemy)
- [ ] **Internship Suggestions** from job boards
- [ ] **Social Features** for peer networking
- [ ] **Mobile App** using React Native
- [ ] **Advanced Analytics** and reporting
- [ ] **Multi-language Support**
- [ ] **Integration with LinkedIn** for profile sync

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini Pro** for AI-powered career advice
- **React Community** for excellent documentation
- **Tailwind CSS** for beautiful UI components
- **MongoDB** for flexible data storage
- **Flask** for lightweight backend development

## 📞 Support

For support, email support@careeradvisor.com or create an issue in the repository.

---

**Built with ❤️ for career development and professional growth**