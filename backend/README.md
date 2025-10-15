# Backend API Server

This is the backend API server for the Supabase Neon Fusion inventory management system.

## 🚀 Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the backend folder with:

   ```
   PORT=3001
   NEON_CONNECTION_STRING=your_neon_database_url_here
   NODE_ENV=development
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

## 📡 API Endpoints

- `GET /api` - Welcome message and API info
- `GET /api/health` - Health check endpoint
- `POST /api/neon-query` - Execute database queries
- `POST /api/sync-user` - Sync user data

## 🛠️ Development

- **Local development:** `npm start`
- **Production:** The server will serve static files if `NODE_ENV=production`

## 🌐 Deployment

This backend is designed to be deployed on platforms like:

- **Render** (recommended)
- **Railway**
- **Heroku**
- **DigitalOcean App Platform**

Make sure to set the `NEON_CONNECTION_STRING` environment variable in your deployment platform.

## 📦 Dependencies

- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **pg** - PostgreSQL client for Node.js
