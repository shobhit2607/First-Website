#!/bin/bash

# AI Career Path Recommender & Skill Advisor System - Setup Script
echo "🚀 Setting up AI Career Path Recommender & Skill Advisor System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python is not installed. Please install Python (v3.8 or higher) first."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB or use MongoDB Atlas."
    echo "   For local installation: https://docs.mongodb.com/manual/installation/"
    echo "   For MongoDB Atlas: https://www.mongodb.com/atlas"
fi

echo "✅ Prerequisites check completed"

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
cd backend
pip install -r requirements.txt
cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration:"
    echo "   - JWT_SECRET_KEY: Generate a secure secret key"
    echo "   - MONGO_URI: Your MongoDB connection string"
    echo "   - GEMINI_API_KEY: Your Google Gemini Pro API key"
    echo ""
    echo "   Get your Gemini API key from: https://makersuite.google.com/app/apikey"
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p uploads

# Set permissions
echo "🔐 Setting permissions..."
chmod +x setup.sh

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Start MongoDB (if using local instance): mongod"
echo "3. Run the application: npm run dev"
echo ""
echo "🌐 The application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo ""
echo "📚 For more information, check the README.md file"
echo ""
echo "Happy coding! 🚀"