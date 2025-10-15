# 🚀 Railway Deployment Guide

## 📋 Pre-Deployment Checklist

✅ **Repository Ready:**
- [x] Code committed to GitHub
- [x] Backend folder structure correct
- [x] `railway.json` configuration file created
- [x] Environment variables documented

## 🚀 **Step-by-Step Railway Deployment**

### **Step 1: Sign Up for Railway**
1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign up with your **GitHub account**

### **Step 2: Connect Your Repository**
1. Click **"Deploy from GitHub repo"**
2. Select your **`supabase-neon-fusion`** repository
3. Railway will automatically detect your project structure

### **Step 3: Configure Your Service**
Railway should automatically detect your backend folder, but if not:

1. **Root Directory**: Set to `backend`
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`

### **Step 4: Set Environment Variables**
In your Railway project dashboard:

1. Go to **Variables** tab
2. Add these environment variables:

```
NODE_ENV=production
NEON_CONNECTION_STRING=postgresql://neondb_owner:npg_O9TIPZfXGF0t@ep-ancient-heart-adx20azq-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
PORT=3000
```

### **Step 5: Deploy!**
1. Click **"Deploy"**
2. Railway will:
   - Build your backend
   - Install dependencies
   - Start your server
   - Give you a live URL

## 🌐 **Your Live Backend URL**

After deployment, Railway will give you a URL like:
`https://supabase-neon-fusion-backend-production.up.railway.app`

## 🔧 **Railway Features You Get**

### **Automatic Deployments:**
- Deploys automatically when you push to GitHub
- Pull request previews
- Branch-based deployments

### **Environment Management:**
- Easy environment variable management
- Secrets protection
- Different environments (staging/production)

### **Monitoring:**
- Real-time logs
- Performance metrics
- Health checks

### **Scaling:**
- Automatic scaling
- Custom resource limits
- Multiple regions

## 🧪 **Testing Your Deployment**

### **Health Check:**
Visit: `https://your-app.up.railway.app/api/health`

### **API Endpoints:**
- **API Info**: `https://your-app.up.railway.app/api`
- **Database Queries**: `https://your-app.up.railway.app/api/neon-query`
- **User Sync**: `https://your-app.up.railway.app/api/sync-user`

## 🔄 **Update Frontend Configuration**

Once your backend is live, update your frontend `.env`:

```env
# Frontend Environment Variables
VITE_API_URL=https://your-app.up.railway.app
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
VITE_SUPABASE_URL=your_supabase_url
```

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **Build Fails:**
   - Check if `backend/package.json` exists
   - Verify all dependencies are listed
   - Check Railway logs

2. **Database Connection Error:**
   - Verify `NEON_CONNECTION_STRING` is correct
   - Check if Neon database is active
   - Test connection locally first

3. **CORS Issues:**
   - Backend has CORS enabled
   - Check Railway logs for errors

4. **Environment Variables:**
   - Make sure variables are set in Railway dashboard
   - Check for typos in variable names

### **Railway Logs:**
- Go to your project → **Deployments** tab
- Click on latest deployment
- View **Logs** for debugging

## 💰 **Railway Pricing**

- **Free Tier**: $5 credit monthly
- **Pro Plan**: $20/month for unlimited usage
- **Team Plan**: $99/month for teams

## 🎯 **Next Steps After Deployment**

1. **Test all API endpoints**
2. **Update frontend with new API URL**
3. **Deploy frontend to Vercel/Netlify**
4. **Set up monitoring and alerts**
5. **Configure custom domain (optional)**

---

## 📞 **Support**

If you encounter issues:
1. Check Railway logs
2. Verify environment variables
3. Test API endpoints manually
4. Check Railway documentation
5. Contact Railway support
