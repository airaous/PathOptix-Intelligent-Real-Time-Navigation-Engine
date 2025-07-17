# 🚀 Vercel Deployment Setup

## Quick Vercel Deployment Steps

### 1. Import Project
1. Go to https://vercel.com
2. Click "New Project"
3. Import `PathOptix-Intelligent-Real-Time-Navigation-Engine` from GitHub

### 2. Configure Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Set Environment Variables
In Vercel Dashboard → Project → Settings → Environment Variables:

```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_API_BASE_URL=https://pathoptix-backend-8080.zeabur.app
VITE_ENVIRONMENT=production
```

### 4. Deploy
Click "Deploy" - Vercel will automatically build and deploy your frontend.

## 🔧 Configuration Files

### vercel.json
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
      "dest": "https://pathoptix-backend-8080.zeabur.app/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 🧪 Testing After Deployment

1. **Frontend Health**: Visit your Vercel URL
2. **API Integration**: Test in browser console:
```javascript
fetch('/api/health').then(r => r.json()).then(console.log);
```
3. **Google Maps**: Verify map loads and search works

## 🔒 Security Notes

- Restrict Google Maps API key to your Vercel domain
- Never commit actual API keys to repository
- Use Vercel environment variables for all secrets

## 📝 Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps Platform API | `AIzaSy...` |
| `VITE_API_BASE_URL` | Backend API URL | `https://backend.zeabur.app` |
| `VITE_ENVIRONMENT` | Environment identifier | `production` |

## 🎉 Success Checklist

- [ ] Project imported to Vercel
- [ ] Environment variables set
- [ ] Build completed successfully
- [ ] Frontend loads at Vercel URL
- [ ] API calls work through proxy
- [ ] Google Maps functionality working
- [ ] No console errors
