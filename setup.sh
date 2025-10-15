#!/bin/bash

# Setup script for Supabase-Neon Fusion App
echo "🚀 Setting up Supabase-Neon Fusion App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install server dependencies
echo "📦 Installing server dependencies..."
npm install express cors pg dotenv
npm install --save-dev nodemon

# Create .env file for server if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file for server..."
    cat > .env << EOF
# Neon Database Connection String
# Get this from your Neon console: https://console.neon.tech/
NEON_CONNECTION_STRING="postgresql://username:password@hostname:port/database?sslmode=require"

# Server Configuration
PORT=3001
NODE_ENV=development
EOF
    echo "⚠️  Please update the .env file with your actual Neon connection string!"
fi

# Update frontend .env file
echo "📝 Updating frontend .env file..."
if [ -f ../.env ]; then
    # Add API URL to frontend .env
    if ! grep -q "VITE_API_URL" ../.env; then
        echo "" >> ../.env
        echo "# API Server URL" >> ../.env
        echo "VITE_API_URL=http://localhost:3001" >> ../.env
    fi
else
    echo "⚠️  Frontend .env file not found. Please create it manually."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update the .env file with your Neon connection string"
echo "2. Run the server: npm run dev"
echo "3. In another terminal, run the frontend: cd .. && npm run dev"
echo ""
echo "🔗 Your app will be available at:"
echo "   Frontend: http://localhost:8080"
echo "   API Server: http://localhost:3001"
echo ""
echo "📚 API endpoints:"
echo "   GET  /api/health - Health check"
echo "   POST /api/neon-query - Execute database queries"
echo "   POST /api/sync-user - Sync Supabase user to Neon"
