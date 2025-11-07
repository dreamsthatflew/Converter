#!/bin/bash

# Start backend on port 8000
cd /home/runner/workspace
python3 server/app.py &
BACKEND_PID=$!

# Wait for backend to be ready
echo "Waiting for backend to start..."
sleep 3

# Start frontend on port 5000
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
