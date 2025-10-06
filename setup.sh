#!/bin/bash

echo "🚀 Setting up Indian Exam Test Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup backend
echo "🐍 Setting up backend..."
cd backend

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your configuration"
fi

cd ..

# Setup frontend
echo "⚛️  Setting up frontend..."
cd frontend

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update frontend/.env with your configuration"
fi

cd ..

echo "✅ Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update backend/.env with your database and API keys"
echo "2. Update frontend/.env with your API URL"
echo "3. Run 'npm run dev' to start both frontend and backend"
echo ""
echo "🌐 The application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📚 For more information, see README.md"