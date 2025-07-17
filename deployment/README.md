# 🚀 Frontend Deployment Configuration

This folder contains all the necessary files and documentation for deploying the PathOptix frontend to Netlify.

## 📁 Folder Contents

### Configuration Files
- `netlify.toml` - Netlify deployment configuration with API proxy and SPA routing (located in root directory)
- `.env.example` - Environment variables template for production

### Documentation
- `NETLIFY-DEPLOYMENT.md` - Complete step-by-step Netlify deployment guide
- `DEPLOYMENT-STATUS.md` - Real-time deployment status and health checks
- `NETLIFY-TROUBLESHOOTING.md` - Troubleshooting guide for deployment issues

**Note**: `netlify.toml` is located in the root directory as Netlify requires it there for deployment.

## 🔧 Quick Setup

### 1. Environment Variables
Copy `.env.example` and set your actual values:
```bash
VITE_GOOGLE_MAPS_API_KEY=AIzaSyAvaO9ui4INjFE7JQfOxfX8P_bBrEv9R5I
VITE_API_BASE_URL=https://pathoptix-backend-8080.zeabur.app
VITE_ENVIRONMENT=production
```

### 2. Deploy to Netlify
1. Go to https://netlify.com and connect GitHub
2. Import PathOptix repository 
3. Set environment variables in Netlify dashboard
4. Deploy automatically

### 3. Update Backend URL
Edit `netlify.toml` if your backend URL changes:
```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-new-backend-url.zeabur.app/api/:splat"
  status = 200
```

## 🔗 Current Configuration

- **Backend URL**: `https://pathoptix-backend-8080.zeabur.app`
- **API Proxy**: All `/api/*` requests forwarded to backend via redirects
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **SPA Routing**: Automatic with 200 status redirects

## 📖 Full Documentation

For complete deployment instructions, see `COMPLETE-DEPLOYMENT-GUIDE.md` in this folder.
