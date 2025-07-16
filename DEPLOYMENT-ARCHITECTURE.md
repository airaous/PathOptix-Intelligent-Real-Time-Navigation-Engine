# 🏗️ PathOptix Deployment Architecture Guide

## 📋 Overview

PathOptix consists of two main components that need separate deployment:

1. **Frontend (React App)** - The user interface
2. **Backend (FastAPI)** - The AI/ML API server

## 🎯 Current Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │  Google Maps    │
│   (React)       │───▶│   (FastAPI)      │───▶│    Platform     │
│                 │    │                  │    │                 │
│ • User Interface│    │ • ML Predictions │    │ • Maps API      │
│ • Google Maps   │    │ • Route Analysis │    │ • Directions    │
│ • UI Components │    │ • AI Optimization│    │ • Places API    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
       │                        │
       ▼                        ▼
┌─────────────────┐    ┌──────────────────┐
│   Static Host   │    │   Server Host    │
│   (Vercel)      │    │   (Zeabur)       │
│                 │    │                  │
│ • CDN Delivery  │    │ • Python Runtime │
│ • SSL/HTTPS     │    │ • FastAPI Server │
│ • Auto Deploy   │    │ • ML Libraries   │
└─────────────────┘    └──────────────────┘
```

## 🎨 Frontend Deployment (React App)

### Current Configuration
Your frontend is configured to deploy to **Vercel** (already set up):

**Files involved:**
- `vercel.json` - Deployment configuration
- `src/` - React application code
- `package.json` - Dependencies and build scripts

### Recommended Platforms for Frontend

#### ✅ **Option 1: Vercel (Current Setup)**
```yaml
Platform: Vercel
Type: Static hosting with serverless functions
URL: https://your-app.vercel.app
Cost: Free tier available
Pros: 
  - Zero config deployment
  - Automatic HTTPS
  - Global CDN
  - Git integration
```

**Deploy Command:**
```bash
# Already configured - just push to GitHub
git push origin main
# Vercel auto-deploys
```

#### 🌐 **Option 2: Netlify**
```yaml
Platform: Netlify
Type: Static hosting
URL: https://your-app.netlify.app
Cost: Free tier available
```

**Deploy Steps:**
```bash
# Build the project
npm run build

# Deploy via drag-and-drop or CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### 🔧 **Option 3: AWS Amplify**
```yaml
Platform: AWS Amplify
Type: Static hosting with CI/CD
URL: https://main.your-app.amplifyapp.com
Cost: Pay per use
```

#### 🏠 **Option 4: GitHub Pages**
```yaml
Platform: GitHub Pages
Type: Static hosting
URL: https://username.github.io/repo-name
Cost: Free
```

## 🚀 Backend Deployment (FastAPI)

### Current Configuration
Your backend appears to be already deployed to **Zeabur**:
- URL: `https://deeproute-ai-api.zeabur.app`
- Configured in `vercel.json` as API proxy

**Files involved:**
- `deeproute_api.py` - Development API
- `deeproute_production_api.py` - Production API

### Recommended Platforms for Backend

#### ✅ **Option 1: Zeabur (Current Setup)**
```yaml
Platform: Zeabur
Type: Serverless Python hosting
URL: https://deeproute-ai-api.zeabur.app
Cost: Usage-based pricing (Free tier: 1 vCPU, 512MB RAM)
Features:
  - Auto-scaling (0 to N replicas)
  - Zero config deployment
  - Built-in monitoring and logs
  - Automatic HTTPS
  - GitHub integration
  - Custom domains support
```

**How to Deploy to Zeabur:**
1. **Sign up:** Go to [zeabur.com](https://zeabur.com)
2. **Connect GitHub:** Import your repository
3. **Auto-detection:** Zeabur detects FastAPI automatically
4. **Deploy:** One-click deployment
5. **Configure:** Set environment variables in dashboard

**Required Files:**
```bash
requirements.txt  # Python dependencies
deeproute_production_api.py  # Main FastAPI file
```

**Optional Configuration (`zeabur.json`):**
```json
{
  "name": "pathoptix-api",
  "start": {
    "command": "uvicorn deeproute_production_api:app --host 0.0.0.0 --port $PORT"
  }
}
```

📖 **Detailed Guide:** See `ZEABUR-DEPLOYMENT.md` for complete setup instructions

#### 🐳 **Option 2: Railway**
```yaml
Platform: Railway
Type: Container hosting
URL: https://your-app.railway.app
Cost: $5/month + usage
```

**Deploy Steps:**
```bash
# Create railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn deeproute_production_api:app --host 0.0.0.0 --port $PORT"
  }
}
```

#### ☁️ **Option 3: Heroku**
```yaml
Platform: Heroku
Type: Platform as a Service
URL: https://your-app.herokuapp.com
Cost: $7/month minimum
```

**Deploy Steps:**
```bash
# Create Procfile
echo "web: uvicorn deeproute_production_api:app --host 0.0.0.0 --port \$PORT" > Procfile

# Create requirements.txt
pip freeze > requirements.txt

# Deploy
git push heroku main
```

#### 🌐 **Option 4: DigitalOcean App Platform**
```yaml
Platform: DigitalOcean
Type: Platform as a Service
URL: https://your-app.ondigitalocean.app
Cost: $5/month minimum
```

#### 🔧 **Option 5: AWS Lambda (Serverless)**
```yaml
Platform: AWS Lambda + API Gateway
Type: Serverless functions
URL: https://api-id.execute-api.region.amazonaws.com
Cost: Pay per request
```

## 🔄 Complete Deployment Flow

### Scenario 1: Vercel + Zeabur (Current Setup)

1. **Backend on Zeabur:**
   ```bash
   # Your FastAPI is already deployed at:
   # https://deeproute-ai-api.zeabur.app
   ```

2. **Frontend on Vercel:**
   ```bash
   # Push to GitHub - auto deploys
   git add .
   git commit -m "Deploy PathOptix"
   git push origin main
   ```

3. **Environment Variables:**
   ```bash
   # Vercel Dashboard → Settings → Environment Variables
   VITE_GOOGLE_MAPS_API_KEY=your_production_api_key
   VITE_API_BASE_URL=https://deeproute-ai-api.zeabur.app
   VITE_ENVIRONMENT=production
   ```

### Scenario 2: Alternative Full Setup

1. **Backend on Railway:**
   ```bash
   # Deploy FastAPI to Railway
   railway login
   railway new
   railway up
   ```

2. **Frontend on Netlify:**
   ```bash
   # Build and deploy
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Update Configuration:**
   ```javascript
   // Update vercel.json or create netlify.toml
   VITE_API_BASE_URL=https://your-app.railway.app
   ```

## ⚙️ Configuration Files Needed

### For Backend Deployment

#### `requirements.txt` (if not exists):
```txt
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
python-multipart==0.0.6
httpx==0.25.2
numpy==1.24.3
scikit-learn==1.3.0
python-cors==0.1.0
```

#### `Dockerfile` (optional):
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "deeproute_production_api:app", "--host", "0.0.0.0", "--port", "8000"]
```

### For Frontend Deployment

#### `netlify.toml` (if using Netlify):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🔐 Environment Variables Setup

### Frontend Environment Variables:
```bash
# Production environment (.env.production)
VITE_GOOGLE_MAPS_API_KEY=your_production_api_key
VITE_API_BASE_URL=https://your-backend-url.com
VITE_ENVIRONMENT=production
VITE_DEBUG=false
```

### Backend Environment Variables:
```bash
# Backend environment
CORS_ORIGINS=https://your-frontend-url.com
ENVIRONMENT=production
DEBUG=false
```

## 🌍 Domain Configuration

### Custom Domains:
```yaml
Frontend: https://pathoptix.com
Backend:  https://api.pathoptix.com

# Configure in your hosting platform:
# - Add domain in dashboard
# - Update DNS records
# - Enable SSL
# - Update CORS settings
```

## 📊 Monitoring & Maintenance

### Frontend Monitoring:
- **Vercel Analytics** - Built-in
- **Google Analytics** - Add to `index.html`
- **Sentry** - Error tracking

### Backend Monitoring:
- **Zeabur Metrics** - Built-in
- **Health Checks** - Add `/health` endpoint
- **Logging** - Structured logging with FastAPI

## 💰 Cost Estimation

### Free Tier Setup:
```yaml
Frontend (Vercel): Free tier
Backend (Railway): $5/month
Google Maps: $200 free credit
Total: ~$5/month
```

### Production Setup:
```yaml
Frontend (Vercel Pro): $20/month
Backend (Railway Pro): $20/month
Google Maps: Usage-based
CDN (Cloudflare): Free
Total: ~$40/month + usage
```

## ✅ Deployment Checklist

### Pre-deployment:
- [ ] Remove API keys from code (✅ Done)
- [ ] Environment variables configured
- [ ] Production build successful
- [ ] CORS configured for domains
- [ ] API rate limits set

### Post-deployment:
- [ ] Test all features work
- [ ] Monitor error rates
- [ ] Set up alerts
- [ ] Configure backups
- [ ] Update documentation

---

**Current Recommendation:** Keep your existing setup (Vercel + Zeabur) as it's already configured and working well!
