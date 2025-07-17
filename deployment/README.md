# 🚀 Frontend Deployment Configuration

This folder contains all the necessary files and documentation for deploying the PathOptix frontend to Vercel.

## 📁 Folder Contents

### Configuration Files
- `vercel.json` - Vercel deployment configuration with API proxy (also in root directory)
- `.env.example` - Environment variables template for production

### Documentation
- `COMPLETE-DEPLOYMENT-GUIDE.md` - Complete step-by-step deployment guide
- `SECURITY-CHECKLIST.md` - Security best practices and checklist
- `VERCEL-SETUP.md` - Quick Vercel-specific setup instructions

**Note**: `vercel.json` is also copied to the root directory as Vercel requires it there for deployment.

## 🔧 Quick Setup

### 1. Environment Variables
Copy `.env.example` and set your actual values:
```bash
VITE_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key
VITE_API_BASE_URL=https://pathoptix-backend-8080.zeabur.app
```

### 2. Deploy to Vercel
1. Import project from GitHub
2. Set environment variables in Vercel dashboard
3. Deploy automatically

### 3. Update Backend URL
Edit `vercel.json` if your backend URL changes:
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-new-backend-url.zeabur.app/api/$1"
    }
  ]
}
```

## 🔗 Current Configuration

- **Backend URL**: `https://pathoptix-backend-8080.zeabur.app`
- **API Proxy**: All `/api/*` requests forwarded to backend
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## 📖 Full Documentation

For complete deployment instructions, see `COMPLETE-DEPLOYMENT-GUIDE.md` in this folder.
