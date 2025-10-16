# 🚀 Deployment Guide - Fix 404 Error

## 🚨 Current Problem

Your Vercel frontend is showing 404 errors because it's trying to call `http://localhost:3001/api/neon-query` but the backend isn't deployed yet.

## ✅ Solution: Deploy Backend to Railway

### Step 1: Deploy Backend to Railway

1. **Go to Railway**: https://railway.app/dashboard
2. **Create New Project** → **Deploy from GitHub repo**
3. **Select Repository**: `supabase-neon-fusion`
4. **Configure Service**:
   - **Service Type**: `Web Service` (NOT Static Site)
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 2: Add Environment Variables in Railway

In Railway Dashboard → Your Service → Variables tab:

```
NEON_CONNECTION_STRING=your_neon_connection_string_here
NODE_ENV=production
```

### Step 3: Get Railway URL

After deployment, Railway will give you a URL like:
`https://your-app-name.railway.app`

### Step 4: Update Vercel Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

```
VITE_API_URL=https://your-app-name.railway.app
```

### Step 5: Redeploy Frontend

After adding the environment variable, redeploy your Vercel project.

## 🔧 Quick Test

1. **Test Railway Backend**: Visit `https://your-app-name.railway.app/api/health`
2. **Test Frontend**: Visit your Vercel URL - it should now work!

## 📋 Checklist

- [ ] Backend deployed to Railway
- [ ] Environment variables added to Railway
- [ ] Railway URL obtained
- [ ] VITE_API_URL added to Vercel
- [ ] Frontend redeployed
- [ ] Both URLs tested and working

## 🆘 If Still Having Issues

1. **Check Railway Logs**: Railway Dashboard → Your Service → Deployments → View Logs
2. **Check Vercel Logs**: Vercel Dashboard → Your Project → Functions → View Logs
3. **Test API Directly**: Use browser dev tools to see network requests

## 🎯 Expected Result

After deployment:

- ✅ Frontend (Vercel) → Backend (Railway) → Neon Database
- ✅ No more 404 errors
- ✅ Full app functionality in production
