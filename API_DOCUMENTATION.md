# AI Career Advisor API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### Login User
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### User Profile

#### Get User Profile
```http
GET /api/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "email": "john@example.com",
    "name": "John Doe",
    "skills": {
      "Python": 4,
      "JavaScript": 3
    },
    "interests": {
      "Technology": 5,
      "Design": 4
    },
    "personality": {
      "Analytical": 4,
      "Creative": 3
    },
    "personality_type": "Analytical",
    "recommendations": [...],
    "progress": {...},
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Career Assessment

#### Submit Quiz
```http
POST /api/quiz
Authorization: Bearer <token>
Content-Type: application/json

{
  "skills": {
    "Python": 4,
    "JavaScript": 3,
    "Problem Solving": 5
  },
  "interests": {
    "Technology": 5,
    "Design": 4,
    "Business": 3
  },
  "personality": {
    "Analytical": 4,
    "Creative": 3,
    "Leadership": 2
  },
  "personality_type": "Analytical"
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "name": "Software Developer",
      "match_percentage": 85.5,
      "skills": ["Programming", "Problem Solving", "Debugging"],
      "interests": ["Technology", "Problem Solving", "Innovation"],
      "personality": ["Analytical", "Detail-oriented", "Logical"],
      "salary_range": [60000, 120000],
      "growth_rate": 22,
      "description": "Design, develop, and maintain software applications"
    }
  ]
}
```

### AI Chat

#### Send Message to AI
```http
POST /api/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "How can I improve my Python skills for data science?"
}
```

**Response:**
```json
{
  "response": "To improve your Python skills for data science, I recommend focusing on these key areas:\n\n1. **Core Python Libraries**: Master pandas for data manipulation, numpy for numerical computing, and matplotlib/seaborn for visualization.\n\n2. **Data Science Workflow**: Learn the complete data science pipeline from data collection to model deployment.\n\n3. **Practice Projects**: Build projects using real datasets from Kaggle or other sources.\n\n4. **Online Courses**: Consider courses like 'Python for Data Science' on Coursera or 'Data Science with Python' on Udemy.\n\nWould you like me to suggest specific projects or learning resources?"
}
```

### Course Recommendations

#### Get Courses by Career
```http
GET /api/courses?career=Software Developer
```

**Response:**
```json
{
  "courses": [
    {
      "title": "Complete Web Development Bootcamp",
      "platform": "Udemy",
      "rating": 4.7,
      "price": "$89.99",
      "description": "Learn full-stack web development",
      "url": "https://udemy.com/course/web-development-bootcamp"
    }
  ]
}
```

### Progress Tracking

#### Update Skill Progress
```http
POST /api/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "skill": "Python",
  "progress": 75
}
```

**Response:**
```json
{
  "message": "Progress updated successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to get AI response",
  "details": "API key not configured"
}
```

## Data Models

### User Model
```json
{
  "email": "string (required, unique)",
  "name": "string",
  "password": "string (hashed)",
  "skills": "object (skill -> rating)",
  "interests": "object (interest -> rating)",
  "personality": "object (trait -> rating)",
  "personality_type": "string",
  "recommendations": "array",
  "progress": "object (skill -> progress data)",
  "created_at": "datetime",
  "last_quiz_date": "datetime"
}
```

### Career Recommendation Model
```json
{
  "name": "string",
  "match_percentage": "number (0-100)",
  "skills": "array of strings",
  "interests": "array of strings",
  "personality": "array of strings",
  "salary_range": "array [min, max]",
  "growth_rate": "number (percentage)",
  "description": "string"
}
```

### Chat Message Model
```json
{
  "user_message": "string",
  "ai_response": "string",
  "timestamp": "datetime",
  "user_email": "string"
}
```

## Rate Limiting
- Chat API: 10 requests per minute per user
- Quiz API: 5 requests per hour per user
- Other APIs: 100 requests per hour per user

## CORS
The API supports CORS for the following origins:
- `http://localhost:3000` (React development server)
- `https://yourdomain.com` (production domain)

## Environment Variables
```env
JWT_SECRET_KEY=your-super-secret-jwt-key
MONGO_URI=mongodb://localhost:27017/career_advisor
GEMINI_API_KEY=your-gemini-api-key
FLASK_ENV=development
```

## Testing
Use tools like Postman, curl, or the frontend application to test the API endpoints.

### Example curl commands:

```bash
# Register a new user
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get profile (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer TOKEN"
```