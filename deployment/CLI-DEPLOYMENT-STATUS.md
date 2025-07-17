# 🚀 Vercel CLI Deployment Guide

## 📋 Prerequisites

1. **Vercel CLI Installed**: ✅ `vercel@44.4.3`
2. **Project Linked**: ✅ `pathoptix-navigation`
3. **Dependencies Installed**: ✅ `node_modules` present

## 🎯 Deployment Commands

### 1. Basic Deployment
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 2. Deploy with Environment Variables
```bash
# Deploy with specific environment variables
vercel \
  --build-env VITE_API_BASE_URL="https://pathoptix-backend-8080.zeabur.app" \
  --build-env VITE_ENVIRONMENT="production" \
  --prod
```

### 3. Set Environment Variables Permanently
```bash
# Add environment variables to the project
vercel env add VITE_GOOGLE_MAPS_API_KEY production
vercel env add VITE_API_BASE_URL production

# Set the API base URL
vercel env add VITE_API_BASE_URL "https://pathoptix-backend-8080.zeabur.app" production
```

## 🔧 Current Deployment Status

**Project**: `pathoptix-navigation`
**Scope**: `ayras-projects-1ec78b4c`
**Deployment**: In Progress... ⏳

## 🌐 Expected URLs

Once deployment completes, you'll get:
- **Production URL**: `https://pathoptix-navigation.vercel.app`
- **Preview URL**: `https://pathoptix-navigation-xxx.vercel.app`

## 📝 Environment Variables to Set

| Variable | Value | Required |
|----------|-------|----------|
| `VITE_GOOGLE_MAPS_API_KEY` | Your Google Maps API Key | ✅ Yes |
| `VITE_API_BASE_URL` | `https://pathoptix-backend-8080.zeabur.app` | ✅ Yes |
| `VITE_ENVIRONMENT` | `production` | Optional |

## 🎯 Next Steps

1. **Wait for Build**: Current deployment should complete in ~2-5 minutes
2. **Set Google Maps API Key**: Use Vercel dashboard or CLI
3. **Test Integration**: Verify frontend talks to backend API
4. **Custom Domain**: Optional - add custom domain in Vercel dashboard

## 🔍 Monitoring Commands

```bash
# List all deployments
vercel list

# Get deployment logs
vercel logs [deployment-url]

# Open project in browser
vercel --open

# Check project info
vercel inspect [deployment-url]
```

## 🚨 If Deployment Fails

```bash
# Check build logs
vercel logs

# Redeploy with verbose output
vercel --debug --prod

# Check project settings
vercel inspect
```

## ✅ Success Checklist

- [ ] Deployment completes successfully
- [ ] Frontend loads at Vercel URL
- [ ] Google Maps API key is set
- [ ] API calls work (test `/api/health`)
- [ ] No console errors
- [ ] All features functional

## 🎉 Completion

Once successful, your PathOptix app will be live with:
- **Frontend**: Vercel hosting
- **Backend**: Zeabur API at `https://pathoptix-backend-8080.zeabur.app`
- **Integration**: API proxy routing working
- **Features**: Full AI navigation functionality
