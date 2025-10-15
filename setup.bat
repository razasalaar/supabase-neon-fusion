@echo off
echo 🚀 Setting up Supabase-Neon Fusion App...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install server dependencies
echo 📦 Installing server dependencies...
npm install express cors pg dotenv
npm install --save-dev nodemon

REM Create .env file for server if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file for server...
    (
        echo # Neon Database Connection String
        echo # Get this from your Neon console: https://console.neon.tech/
        echo NEON_CONNECTION_STRING="postgresql://username:password@hostname:port/database?sslmode=require"
        echo.
        echo # Server Configuration
        echo PORT=3001
        echo NODE_ENV=development
    ) > .env
    echo ⚠️  Please update the .env file with your actual Neon connection string!
)

REM Update frontend .env file
echo 📝 Updating frontend .env file...
if exist ..\.env (
    REM Add API URL to frontend .env
    findstr /C:"VITE_API_URL" ..\.env >nul
    if %errorlevel% neq 0 (
        echo. >> ..\.env
        echo # API Server URL >> ..\.env
        echo VITE_API_URL=http://localhost:3001 >> ..\.env
    )
) else (
    echo ⚠️  Frontend .env file not found. Please create it manually.
)

echo.
echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo 1. Update the .env file with your Neon connection string
echo 2. Run the server: npm run dev
echo 3. In another terminal, run the frontend: cd .. && npm run dev
echo.
echo 🔗 Your app will be available at:
echo    Frontend: http://localhost:8080
echo    API Server: http://localhost:3001
echo.
echo 📚 API endpoints:
echo    GET  /api/health - Health check
echo    POST /api/neon-query - Execute database queries
echo    POST /api/sync-user - Sync Supabase user to Neon
echo.
pause
