# 🚀 How to Deploy FastAPI Backend to Zeabur

## 📋 Overview

Zeabur is a modern serverless platform that makes deploying Python applications incredibly easy. It automatically detects your Python project and handles the deployment configuration.

## 🎯 What is Zeabur?

- **Serverless Python hosting** with auto-scaling
- **Zero configuration** deployment
- **Built-in monitoring** and logs
- **Usage-based pricing** with generous free tier
- **Automatic HTTPS** and domain management

## 📦 Prerequisites

1. **GitHub repository** with your FastAPI code
2. **Zeabur account** (free signup)
3. **FastAPI application** ready for production

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your FastAPI Application

First, ensure your FastAPI app is production-ready:

#### Create `requirements.txt`:
```bash
# In your project root directory
pip freeze > requirements.txt
```

Or create manually:
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
python-multipart==0.0.6
httpx==0.25.2
numpy==1.24.3
scikit-learn==1.3.0
torch==2.1.0
python-cors==0.1.0
```

#### Verify your main file structure:
```python
# deeproute_production_api.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="PathOptix DeepRoute API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "PathOptix DeepRoute API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Your other endpoints...
```

### Step 2: Deploy to Zeabur

#### Option A: Deploy from GitHub (Recommended)

1. **Sign up for Zeabur:**
   - Go to [zeabur.com](https://zeabur.com)
   - Sign up with GitHub account

2. **Create a new project:**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Choose your PathOptix repository

3. **Configure deployment:**
   - Zeabur will automatically detect Python project
   - Select `deeproute_production_api.py` as entry point
   - Or it will auto-detect FastAPI application

4. **Set environment variables (if needed):**
   ```bash
   ENVIRONMENT=production
   DEBUG=false
   CORS_ORIGINS=https://your-frontend-domain.com
   ```

5. **Deploy:**
   - Click "Deploy"
   - Zeabur will build and deploy automatically
   - You'll get a URL like: `https://your-app.zeabur.app`

#### Option B: Deploy with Zeabur CLI

1. **Install Zeabur CLI:**
   ```bash
   npm install -g @zeabur/cli
   # or
   curl -sSL https://zeabur.com/install.sh | bash
   ```

2. **Login to Zeabur:**
   ```bash
   zeabur auth login
   ```

3. **Deploy your application:**
   ```bash
   # In your project directory
   zeabur deploy
   ```

### Step 3: Configuration Files (Optional)

#### Create `zeabur.json` for custom configuration:
```json
{
  "name": "pathoptix-deeproute-api",
  "build": {
    "commands": [
      "pip install -r requirements.txt"
    ]
  },
  "start": {
    "command": "uvicorn deeproute_production_api:app --host 0.0.0.0 --port $PORT"
  },
  "env": {
    "ENVIRONMENT": "production"
  }
}
```

#### Or create `Procfile` (Heroku-style):
```
web: uvicorn deeproute_production_api:app --host 0.0.0.0 --port $PORT
```

### Step 4: Custom Domain (Optional)

1. **Add custom domain:**
   - Go to Zeabur dashboard
   - Select your project
   - Click "Domains"
   - Add your custom domain (e.g., `api.pathoptix.com`)

2. **Configure DNS:**
   ```
   Type: CNAME
   Name: api
   Value: your-app.zeabur.app
   ```

3. **SSL certificate:**
   - Zeabur automatically provisions SSL certificates
   - Your API will be available at `https://api.pathoptix.com`

## 🔧 Advanced Configuration

### Environment Variables

Set these in Zeabur dashboard:

```bash
# Required
ENVIRONMENT=production
DEBUG=false

# CORS Configuration
CORS_ORIGINS=https://your-frontend-domain.vercel.app,https://pathoptix.com

# Optional
API_KEY_SECRET=your-secret-key
DATABASE_URL=your-database-url
REDIS_URL=your-redis-url
```

### Scaling Configuration

```json
{
  "scaling": {
    "minReplicas": 0,
    "maxReplicas": 10,
    "targetCPU": 70
  }
}
```

### Health Checks

Zeabur automatically monitors your `/health` endpoint:

```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }
```

## 📊 Monitoring & Logs

### Built-in Monitoring

Zeabur provides:
- **Real-time logs** in the dashboard
- **Metrics** (CPU, memory, requests)
- **Uptime monitoring**
- **Error tracking**

### Access Logs

```bash
# View logs in Zeabur dashboard
# Or use CLI
zeabur logs --project your-project-id
```

### Performance Monitoring

```python
# Add timing middleware
from time import time
from fastapi import Request

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time()
    response = await call_next(request)
    process_time = time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response
```

## 🔄 Continuous Deployment

### Automatic Deployment

1. **Connect GitHub repository** to Zeabur
2. **Enable auto-deployment** for main branch
3. **Every git push** triggers automatic rebuild and deployment

### Deployment Webhook

```bash
# Set up webhook in GitHub repository
# Zeabur provides webhook URL in project settings
# Triggers deployment on specific events
```

## 💰 Pricing

### Free Tier:
```yaml
Compute: 1 vCPU, 512MB RAM
Bandwidth: 1GB/month
Projects: Unlimited
Builds: 500 build minutes/month
```

### Pro Tier ($5/month):
```yaml
Compute: 2 vCPU, 1GB RAM
Bandwidth: 10GB/month
Custom domains: Unlimited
Build minutes: 1000/month
```

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures:**
   ```bash
   # Check requirements.txt
   # Verify Python version compatibility
   # Check build logs in Zeabur dashboard
   ```

2. **Import Errors:**
   ```bash
   # Ensure all dependencies in requirements.txt
   # Check Python path issues
   # Verify module structure
   ```

3. **Port Issues:**
   ```python
   # Always use PORT environment variable
   import os
   port = int(os.environ.get("PORT", 8000))
   
   if __name__ == "__main__":
       uvicorn.run(app, host="0.0.0.0", port=port)
   ```

4. **CORS Issues:**
   ```python
   # Update CORS origins for production
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "https://your-frontend.vercel.app",
           "https://pathoptix.com"
       ],
       allow_credentials=True,
       allow_methods=["GET", "POST"],
       allow_headers=["*"],
   )
   ```

## 🔐 Security Best Practices

### Environment Variables
```bash
# Never hardcode secrets
SECRET_KEY=your-secret-key
DATABASE_PASSWORD=your-db-password
API_KEYS=your-api-keys
```

### CORS Configuration
```python
# Restrict origins in production
allow_origins=[
    "https://pathoptix.vercel.app",
    "https://pathoptix.com"
]
```

### Rate Limiting
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.get("/api/predict")
@limiter.limit("30/minute")
async def predict_route(request: Request):
    # Your prediction logic
    pass
```

## 📚 Useful Commands

```bash
# Deploy to Zeabur
zeabur deploy

# View logs
zeabur logs

# List projects
zeabur project list

# Set environment variable
zeabur env set KEY=value

# Check deployment status
zeabur status
```

## 🔗 Integration with Frontend

After deploying to Zeabur, update your frontend configuration:

### Update `vercel.json`:
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-app.zeabur.app/api/$1"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "https://your-app.zeabur.app"
  }
}
```

### Test Integration:
```bash
# Test API endpoint
curl https://your-app.zeabur.app/health

# Test from frontend
# Check browser network tab for API calls
```

## ✅ Deployment Checklist

### Pre-deployment:
- [ ] Create `requirements.txt`
- [ ] Test locally with production settings
- [ ] Configure CORS for production domains
- [ ] Set up environment variables
- [ ] Add health check endpoint

### Deployment:
- [ ] Connect GitHub repository to Zeabur
- [ ] Configure build and start commands
- [ ] Set environment variables
- [ ] Deploy and test endpoints
- [ ] Configure custom domain (optional)

### Post-deployment:
- [ ] Test all API endpoints
- [ ] Verify CORS configuration
- [ ] Check logs for errors
- [ ] Set up monitoring alerts
- [ ] Update frontend configuration

---

**Your FastAPI backend will be live at `https://your-app.zeabur.app` and ready to serve your PathOptix frontend! 🚀**
