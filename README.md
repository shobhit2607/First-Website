# AI Career Path Recommender & Skill Advisor System

A comprehensive full-stack web application that helps students and professionals discover their ideal career paths using AI-powered recommendations, personalized skill development plans, and intelligent career guidance.

## 🚀 Features

### 🧠 AI-Powered Career Recommendations
- **Comprehensive Career Quiz**: Multi-step assessment covering skills, interests, and personality traits
- **Machine Learning Model**: Advanced ML algorithm that matches users with suitable career paths
- **Personalized Results**: Top 3-5 career recommendations with match percentages and detailed insights

### 💬 Gemini Pro AI Integration
- **Intelligent Chatbot**: AI-powered career advisor powered by Google's Gemini Pro
- **Personalized Advice**: Context-aware responses based on user profile and career goals
- **Skill Improvement Plans**: Detailed 30-day improvement plans for specific skills
- **Learning Recommendations**: AI-suggested resources and learning paths

### 📊 Comprehensive Dashboard
- **Career Analytics**: Visual charts showing career match percentages and growth rates
- **Progress Tracking**: Monitor skill development and learning progress over time
- **Personalized Insights**: AI-generated insights and recommendations

### 🎯 Skill Development System
- **Skill Management**: Add, track, and manage personal skills
- **Progress Monitoring**: Visual progress bars and level tracking
- **Improvement Plans**: AI-generated personalized skill development plans
- **Learning Resources**: Curated resources for skill enhancement

### 🔍 Career Exploration
- **Career Database**: Comprehensive database of 8+ career paths with detailed information
- **Advanced Filtering**: Filter careers by salary range, growth rate, and requirements
- **Detailed Profiles**: In-depth career information including skills, salary, and learning resources

### 💼 Job & Internship Search
- **Internship Opportunities**: Curated internship listings with application links
- **Job Listings**: Entry to senior level job opportunities
- **Career Events**: Workshops, career fairs, and networking events
- **Smart Filtering**: Filter by career, location, experience level, and more

### 📚 Course Integration
- **Learning Resources**: Integration with major learning platforms
- **Career-Specific Courses**: Courses tailored to specific career paths
- **Resource Curation**: Hand-picked resources from Coursera, Udemy, edX, and more

### 🔐 User Authentication & Profiles
- **Secure Authentication**: JWT-based authentication system
- **User Profiles**: Comprehensive user profiles with skill tracking
- **Progress History**: Track learning progress and career development over time

### 👨‍💼 Admin Dashboard
- **Career Management**: Add, edit, and manage career data
- **User Analytics**: Monitor user engagement and system usage
- **Content Management**: Manage learning resources and career information

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Data visualization and charts
- **Lucide React**: Beautiful icons
- **Framer Motion**: Smooth animations
- **React Hot Toast**: Notifications

### Backend
- **Python Flask**: Lightweight web framework
- **MongoDB**: NoSQL database for flexible data storage
- **PyMongo**: MongoDB driver for Python
- **JWT**: Secure authentication
- **Scikit-learn**: Machine learning library
- **Pandas & NumPy**: Data processing

### AI Integration
- **Google Gemini Pro**: Advanced AI for chatbot and recommendations
- **Machine Learning**: Random Forest classifier for career matching
- **Natural Language Processing**: AI-powered text generation and analysis

### Development Tools
- **Concurrently**: Run frontend and backend simultaneously
- **Axios**: HTTP client for API calls
- **React Hook Form**: Form management
- **PostCSS**: CSS processing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (local or cloud instance)
- Google Gemini Pro API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-career-advisor
   ```

2. **Install dependencies**
   ```bash
   npm run setup
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   JWT_SECRET_KEY=your-super-secret-jwt-key
   MONGO_URI=mongodb://localhost:27017/career_advisor
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode (runs both frontend and backend)
   npm run dev
   
   # Or run separately:
   npm run frontend  # React app on http://localhost:3000
   npm run backend   # Flask API on http://localhost:5000
   ```

### Production Deployment

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Install production dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Run with Gunicorn**
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

## 📁 Project Structure

```
ai-career-advisor/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── start.py            # Application starter
│   └── requirements.txt    # Python dependencies
├── src/
│   ├── components/         # React components
│   │   ├── Dashboard.js    # Main dashboard
│   │   ├── Quiz.js         # Career assessment quiz
│   │   ├── ChatBot.js      # AI chatbot interface
│   │   ├── Profile.js      # User profile management
│   │   ├── CareerExplorer.js # Career exploration
│   │   ├── SkillDevelopment.js # Skill tracking
│   │   ├── JobSearch.js    # Job and internship search
│   │   └── AdminDashboard.js # Admin interface
│   ├── contexts/
│   │   └── AuthContext.js  # Authentication context
│   ├── App.js             # Main React component
│   └── index.js           # React entry point
├── public/                # Static assets
├── package.json           # Node.js dependencies
├── tailwind.config.js     # Tailwind configuration
└── README.md             # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile

### Career Recommendations
- `POST /api/quiz` - Submit career quiz
- `GET /api/careers` - Get all careers
- `GET /api/career/<name>` - Get specific career details
- `GET /api/skills` - Get all skills
- `GET /api/interests` - Get all interests

### AI Chat & Learning
- `POST /api/chat` - Chat with AI advisor
- `POST /api/skill-improvement` - Get skill improvement plan
- `GET /api/learning-path/<career>` - Get learning path for career

### Job Search
- `GET /api/internships` - Get internship opportunities
- `GET /api/jobs` - Get job listings
- `GET /api/events` - Get career events

### Progress Tracking
- `POST /api/progress` - Update skill progress
- `GET /api/analytics` - Get user analytics
- `GET /api/chat-history` - Get chat history

## 🎯 Usage Guide

### For Students
1. **Register/Login**: Create an account or sign in
2. **Take Career Quiz**: Complete the comprehensive assessment
3. **Explore Recommendations**: Review AI-generated career suggestions
4. **Develop Skills**: Track and improve your skills
5. **Find Opportunities**: Search for internships and jobs
6. **Get AI Guidance**: Chat with the AI advisor for personalized advice

### For Professionals
1. **Career Transition**: Use the system to explore new career paths
2. **Skill Assessment**: Evaluate your current skills and identify gaps
3. **Learning Paths**: Follow structured learning paths for career advancement
4. **Networking**: Discover career events and networking opportunities

### For Administrators
1. **Manage Careers**: Add and update career information
2. **Monitor Usage**: Track user engagement and system performance
3. **Content Management**: Manage learning resources and course data

## 🤖 AI Features

### Gemini Pro Integration
- **Context-Aware Responses**: AI understands user's career goals and background
- **Personalized Recommendations**: Tailored advice based on user profile
- **Skill Development Plans**: Detailed improvement strategies
- **Career Guidance**: Expert-level career counseling

### Machine Learning
- **Career Matching**: Advanced algorithm matches users with suitable careers
- **Feature Engineering**: Comprehensive feature extraction from user inputs
- **Probability Scoring**: Confidence scores for career recommendations

## 🔒 Security

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **CORS Protection**: Configured for secure cross-origin requests
- **Input Validation**: Comprehensive input sanitization

## 📈 Performance

- **Optimized Queries**: Efficient database queries
- **Caching**: Strategic caching for improved performance
- **Responsive Design**: Mobile-first responsive design
- **Fast Loading**: Optimized assets and lazy loading

## 🚀 Future Enhancements

- [ ] **Real-time Notifications**: Push notifications for new opportunities
- [ ] **Video Interviews**: Integrated video interview practice
- [ ] **Portfolio Builder**: AI-assisted portfolio creation
- [ ] **Mentorship Matching**: Connect users with industry mentors
- [ ] **Advanced Analytics**: Deeper insights and predictions
- [ ] **Mobile App**: Native mobile application
- [ ] **API Integration**: Real job board integrations
- [ ] **Multi-language Support**: Internationalization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- Google Gemini Pro for AI capabilities
- React and Flask communities
- Open source contributors
- Career development professionals

---

**Built with ❤️ for career development and professional growth**