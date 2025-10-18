#!/bin/bash

# E-Commerce Website Startup Script

echo "Starting E-Commerce Website..."

# Start Backend
echo "Starting Flask backend on port 8000..."
cd backend
python3 app.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Test backend
echo "Testing backend..."
curl -s http://localhost:8000/api/products > /dev/null
if [ $? -eq 0 ]; then
    echo "✓ Backend is running successfully"
else
    echo "✗ Backend failed to start"
    exit 1
fi

# Start Frontend
echo "Starting React frontend on port 3000..."
cd ../frontend
PORT=3000 npm start &
FRONTEND_PID=$!

echo ""
echo "🚀 E-Commerce Website is starting up!"
echo ""
echo "Backend API: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait