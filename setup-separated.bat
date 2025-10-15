@echo off
echo 🚀 Setting up Supabase Neon Fusion Project...
echo ==============================================
echo.

REM Check if backend directory exists
if not exist "backend" (
    echo ❌ Backend directory not found. Please run the separation script first.
    pause
    exit /b 1
)

echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo 📦 Installing frontend dependencies...
call npm install

echo.
echo ✅ Setup complete!
echo.
echo 🎯 To run the project:
echo    1. Start backend:  cd backend ^&^& npm start
echo    2. Start frontend: npm run dev
echo.
echo 🌐 URLs:
echo    Backend API:  http://localhost:3001
echo    Frontend App: http://localhost:8080 (or next available port)
echo.
echo 📡 API Endpoints:
echo    Health Check: http://localhost:3001/api/health
echo    API Info:     http://localhost:3001/api
echo.
pause
