
# 🚀 Quick Deployment Commands

## One-Click Deployment
```bash
# Complete automated deployment
python deploy_all.py

# Or deploy individually:

# 1. Deploy API to Zeabur
./deploy_api.sh

# 2. Deploy Frontend to Vercel  
./deploy_frontend.sh
```

## Manual Deployment Steps

### API (Zeabur)
```bash
# Install CLI
npm install -g zeabur

# Login
zeabur auth login

# Deploy
zeabur deploy
```

### Frontend (Vercel)
```bash
# Install CLI
npm install -g vercel

# Build
npm run build

# Deploy
vercel --prod
```

## Production URLs
- 🌐 Frontend: https://pathoptix-deeproute.vercel.app
- 📡 API: https://deeproute-ai-api.zeabur.app
- 📚 Docs: https://deeproute-ai-api.zeabur.app/api/docs
