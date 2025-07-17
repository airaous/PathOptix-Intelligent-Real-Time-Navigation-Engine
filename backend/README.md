# 🐍 PathOptix Backend API

## 📍 **Current Deployment**
**Live Backend**: https://pathoptix-backend-8080.zeabur.app

## 🏗️ **Architecture Separation**

This directory contains the Python FastAPI backend that is deployed separately to **Zeabur**. The frontend React app (deployed to Netlify) communicates with this backend via API calls.

## 📁 **Files**
- `deeproute_production_api.py` - Main FastAPI application with ML route optimization
- `requirements.txt` - Python dependencies (PyTorch, FastAPI, etc.)
- `Dockerfile` - Container configuration for Zeabur deployment

## 🔗 **API Endpoints**
```
Base URL: https://pathoptix-backend-8080.zeabur.app

Health Check:
GET /api/health

Route Optimization:
POST /api/predict-route
POST /api/optimize-route
```

## 🚀 **Deployment**
The backend is automatically deployed to Zeabur when changes are pushed to the main branch. The Zeabur deployment reads from this `backend/` directory.

## 🌐 **Frontend Integration**
The Netlify frontend proxies API calls to this backend:
- Frontend: `https://your-site.netlify.app/api/*` 
- Backend: `https://pathoptix-backend-8080.zeabur.app/api/*`

This ensures CORS compatibility and seamless integration between the two platforms.

---

**Note**: This separation ensures Netlify only builds the frontend React app and doesn't attempt to install Python dependencies.
