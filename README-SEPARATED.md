# 🚀 Supabase Neon Fusion - Separated Backend/Frontend

This project has been restructured with a **proper backend/frontend separation** for better deployment and development.

## 📁 Project Structure

```
supabase-neon-fusion/
├── backend/                 # 🖥️ Express API Server
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   ├── .env               # Backend environment variables
│   └── README.md          # Backend documentation
├── frontend/               # ⚛️ React/Vite Frontend (current root)
│   ├── src/               # React source code
│   ├── package.json       # Frontend dependencies
│   ├── .env              # Frontend environment variables
│   └── ...               # All your existing frontend files
└── setup-separated.bat    # 🛠️ Setup script
```

## 🚀 Quick Start

### Option 1: Use Setup Script (Recommended)

```bash
# Windows
setup-separated.bat

# Linux/Mac
chmod +x setup-separated.sh
./setup-separated.sh
```

### Option 2: Manual Setup

1. **Install Backend Dependencies:**

   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

## 🎯 Running the Project

### Terminal 1 - Backend Server

```bash
cd backend
npm start
```

→ 🚀 Backend runs on `http://localhost:3001`

### Terminal 2 - Frontend Development

```bash
npm run dev
```

→ ⚛️ Frontend runs on `http://localhost:8080` (or next available port)

## 🌐 API Endpoints

- **Health Check:** `http://localhost:3001/api/health`
- **API Info:** `http://localhost:3001/api`
- **Database Queries:** `http://localhost:3001/api/neon-query`
- **User Sync:** `http://localhost:3001/api/sync-user`

## 🔧 Environment Variables

### Backend (.env in backend folder)

```env
PORT=3001
NEON_CONNECTION_STRING=your_neon_database_url
NODE_ENV=development
```

### Frontend (.env in root folder)

```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Deployment

### Backend (Render/Railway/Heroku)

- Deploy the `backend/` folder
- Set environment variables in your platform
- Backend will be available at your platform's URL

### Frontend (Vercel/Netlify)

- Deploy the root folder (frontend)
- Update `VITE_API_URL` to your backend URL
- Example: `VITE_API_URL=https://your-backend.onrender.com`

## ✅ Benefits of This Structure

1. **🔄 Separation of Concerns:** Backend and frontend are independent
2. **🚀 Better Deployment:** Deploy backend and frontend separately
3. **🛠️ Easier Development:** Run backend and frontend independently
4. **📦 Cleaner Dependencies:** No mixing of server and client dependencies
5. **🌐 Scalability:** Scale backend and frontend independently

## 🆘 Troubleshooting

### Backend won't start?

- Check if `backend/.env` exists with `NEON_CONNECTION_STRING`
- Run `cd backend && npm install`

### Frontend can't connect to backend?

- Make sure backend is running on port 3001
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS is enabled in backend

### Port conflicts?

- Backend: Change `PORT` in `backend/.env`
- Frontend: Vite will automatically find next available port

## 📞 Support

If you encounter any issues with the separated structure, check:

1. Both servers are running
2. Environment variables are set correctly
3. Dependencies are installed in both folders
