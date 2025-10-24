#!/bin/bash

# AI Career Advisor Setup Script
echo "🚀 Setting up AI Career Path Recommender & Skill Advisor System"
echo "================================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python is not installed. Please install Python (v3.8 or higher) first."
    echo "   Visit: https://python.org/"
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip is not installed. Please install pip first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully!"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip3 install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully!"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
MONGO_URI=mongodb://localhost:27017/career_advisor
GEMINI_API_KEY=your-gemini-api-key-here
EOL
    echo "✅ .env file created! Please update it with your actual API keys."
else
    echo "✅ .env file already exists"
fi

# Create directories if they don't exist
mkdir -p backend/logs
mkdir -p backend/models

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update the .env file with your actual API keys:"
echo "   - Get your Gemini API key from: https://makersuite.google.com/app/apikey"
echo "   - Set up MongoDB (local or MongoDB Atlas)"
echo "   - Change the JWT_SECRET_KEY to a secure random string"
echo ""
echo "2. Start the application:"
echo "   npm run dev"
echo ""
echo "3. Open your browser and go to: http://localhost:3000"
echo ""
echo "🔧 For development, you can also run:"
echo "   Frontend only: npm run frontend"
echo "   Backend only: npm run backend"
echo ""
echo "📚 Check the README.md for detailed documentation"
echo ""
echo "Happy coding! 🚀"