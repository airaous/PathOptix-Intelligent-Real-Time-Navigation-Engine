# 🚀 PathOptix Deployment Guide - Step by Step

## 🏗️ Your Current Architecture

```
Frontend (React)           Backend (FastAPI)
     ↓                           ↓
   Vercel                      Zeabur
     ↓                           ↓
pathoptix.vercel.app    deeproute-ai-api.zeabur.app
```

## 📦 What Goes Where

### 🎨 Frontend Deployment (Vercel)
**What:** React application with Google Maps UI
**Where:** Vercel (Static hosting with CDN)
**Files:** Everything in `src/`, `public/`, `package.json`, `vercel.json`

### 🧠 Backend Deployment (Zeabur)
**What:** FastAPI server with ML/AI capabilities
**Where:** Zeabur (Python serverless hosting)
**Files:** `deeproute_production_api.py`, dependencies

## 🎯 Current Status

✅ **Backend Already Deployed:**
- URL: `https://deeproute-ai-api.zeabur.app`
- Status: Already running
- Configuration: Set up in `vercel.json`

⏳ **Frontend Ready for Deployment:**
- Platform: Vercel (configured)
- Configuration: `vercel.json` exists
- Status: Ready to deploy

## 🚀 Step-by-Step Deployment

### Step 1: Security Cleanup (CRITICAL!)

**Before deploying anything:**

```bash
# 1. Remove the notebook with API key
git rm deeproute_ai_development.ipynb

# 2. Commit the change
git commit -m "Remove development notebook with sensitive data"

# 3. Push to GitHub
git push origin main
```

### Step 2: Frontend Deployment to Vercel

#### Option A: Automatic Deployment (Recommended)

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Import Project"
   - Select your PathOptix repository

2. **Configure Environment Variables:**
   ```bash
   # In Vercel Dashboard → Settings → Environment Variables
   VITE_GOOGLE_MAPS_API_KEY=your_production_api_key_here
   ```

3. **Deploy:**
   - Vercel will automatically build and deploy
   - Your app will be available at: `https://pathoptix-[random].vercel.app`

#### Option B: Manual Deployment

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel --prod

# 4. Set environment variables
vercel env add VITE_GOOGLE_MAPS_API_KEY production
```

### Step 3: Backend Status Check

Your backend is already deployed! Verify it's working:

```bash
# Test the backend API
curl https://deeproute-ai-api.zeabur.app/health

# Expected response: {"status": "healthy"}
```

If you need to redeploy the backend:

#### Zeabur Deployment (Current Setup)
1. **Go to Zeabur Dashboard**
2. **Connect GitHub repository**
3. **Select `deeproute_production_api.py` as entry point**
4. **Set environment variables if needed**

#### Alternative Backend Deployment (Railway)
```bash
# If you want to switch from Zeabur to Railway
npm install -g @railway/cli
railway login
railway new
railway up

# Update vercel.json with new URL
```

## 🔧 Configuration Files

### Frontend Configuration (`vercel.json`)
```json
{
  "version": 2,
  "name": "pathoptix-deeproute",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://deeproute-ai-api.zeabur.app/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "https://deeproute-ai-api.zeabur.app",
    "VITE_ENVIRONMENT": "production"
  }
}
```

### Backend Requirements
Create `requirements.txt` if needed:
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
torch==2.1.0
numpy==1.24.3
scikit-learn==1.3.0
python-multipart==0.0.6
httpx==0.25.2
```

## 🌐 Domain Setup (Optional)

### Custom Domain for Frontend
```bash
# In Vercel Dashboard
1. Go to Domains
2. Add your domain (e.g., pathoptix.com)
3. Configure DNS records
4. SSL automatically configured
```

### Custom Domain for Backend
```bash
# In Zeabur Dashboard
1. Go to Domain settings
2. Add custom domain (e.g., api.pathoptix.com)
3. Update vercel.json with new URL
```

## 🔐 Environment Variables

### Frontend Environment Variables (Vercel)
```bash
VITE_GOOGLE_MAPS_API_KEY=your_production_api_key
VITE_API_BASE_URL=https://deeproute-ai-api.zeabur.app
VITE_ENVIRONMENT=production
VITE_DEBUG=false
```

### Backend Environment Variables (Zeabur)
```bash
ENVIRONMENT=production
CORS_ORIGINS=https://your-vercel-app.vercel.app
DEBUG=false
```

## 🔄 Continuous Deployment

Both platforms support automatic deployment:

### Vercel (Frontend)
- **Trigger:** Git push to main branch
- **Build:** `npm run build`
- **Deploy:** Automatic

### Zeabur (Backend)
- **Trigger:** Git push or manual deploy
- **Build:** Automatic Python environment
- **Deploy:** Automatic scaling

## 📊 Monitoring & Testing

### Post-Deployment Testing
```bash
# 1. Test frontend
https://your-app.vercel.app

# 2. Test backend API
curl https://deeproute-ai-api.zeabur.app/health

# 3. Test integration
# Use the frontend to make a route request
# Check browser network tab for API calls
```

### Monitoring Setup
```yaml
Frontend:
  - Vercel Analytics (built-in)
  - Google Analytics (add to index.html)
  - Error tracking (Sentry)

Backend:
  - Zeabur metrics (built-in)
  - API response times
  - Error logging
```

## 💰 Cost Breakdown

### Current Setup Cost
```yaml
Vercel (Frontend):
  - Free tier: 100GB bandwidth/month
  - Hobby: $20/month (pro features)

Zeabur (Backend):
  - Free tier: Limited compute
  - Pro: $5-20/month based on usage

Google Maps:
  - $200 free credit monthly
  - Pay per API call after credit

Total: $0-40/month depending on usage
```

## 🔧 Troubleshooting

### Common Issues

1. **API Key Errors:**
   ```bash
   # Check environment variables in Vercel dashboard
   # Verify API key restrictions in Google Cloud
   ```

2. **CORS Errors:**
   ```bash
   # Update backend CORS settings
   # Verify frontend domain in allowed origins
   ```

3. **Build Failures:**
   ```bash
   # Check build logs in Vercel
   # Verify Node.js version compatibility
   ```

4. **Backend Not Responding:**
   ```bash
   # Check Zeabur logs
   # Verify deployment status
   # Test API endpoints directly
   ```

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Remove API keys from code ✅
- [ ] Update .gitignore ✅
- [ ] Test local build: `npm run build`
- [ ] Verify API endpoints work
- [ ] Set up production Google Maps API key

### Deployment
- [ ] Deploy frontend to Vercel
- [ ] Verify backend is running on Zeabur
- [ ] Set environment variables
- [ ] Test full application flow
- [ ] Configure custom domains (optional)

### Post-Deployment
- [ ] Test all navigation features
- [ ] Verify Google Maps integration
- [ ] Check mobile responsiveness
- [ ] Monitor error rates
- [ ] Set up alerts and monitoring

## 🎉 Quick Deploy Commands

```bash
# Complete deployment in 3 steps:

# 1. Clean security issues
git rm deeproute_ai_development.ipynb
git commit -m "Security cleanup"
git push origin main

# 2. Deploy to Vercel (if not auto-deployed)
npx vercel --prod

# 3. Test deployment
curl https://your-app.vercel.app
```

**Your backend is already deployed and configured! Just need to deploy the frontend to Vercel and you're live! 🚀**
