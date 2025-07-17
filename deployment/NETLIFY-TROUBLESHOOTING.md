# 🔧 Netlify Deployment Troubleshooting Guide

## 🚨 **Common Issues & Solutions**

### **Issue 1: Blank Website After Deployment**

#### **Root Cause**
Missing Google Maps API key in Netlify environment variables causes React app to fail rendering.

#### **Solution ✅**
1. **Set Environment Variables in Netlify**:
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add: `VITE_GOOGLE_MAPS_API_KEY = AIzaSyAvaO9ui4INjFE7JQfOxfX8P_bBrEv9R5I`
   - Add: `VITE_API_BASE_URL = https://pathoptix-backend-8080.zeabur.app`
   - Add: `VITE_ENVIRONMENT = production`

2. **Trigger Redeploy**:
   - Netlify automatically redeploys when environment variables change
   - Or manually trigger: Deploys → Trigger deploy → Deploy site

#### **Prevention**
The app now gracefully handles missing API keys by showing a configuration page instead of failing silently.

---

### **Issue 2: API Calls Failing (CORS Errors)**

#### **Root Cause**
Direct API calls to external backend causing CORS issues.

#### **Solution ✅**
API proxy is configured in `netlify.toml`:
```toml
[[redirects]]
  from = "/api/*"
  to = "https://pathoptix-backend-8080.zeabur.app/api/:splat"
  status = 200
```

This means:
- `https://your-site.netlify.app/api/health` → `https://pathoptix-backend-8080.zeabur.app/api/health`
- No CORS issues (same-origin requests)

---

### **Issue 3: 404 Errors on Page Refresh (SPA Routing)**

#### **Root Cause**
Single Page Application routes not handled properly by server.

#### **Solution ✅**
SPA redirect configured in `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This ensures all routes serve the React app, which handles routing client-side.

---

### **Issue 4: Build Failures**

#### **Common Causes & Solutions**

1. **Missing Dependencies**:
   ```bash
   # Check package.json has all dependencies
   npm install
   npm run build
   ```

2. **Environment Variables**:
   ```bash
   # Build locally with production variables
   VITE_GOOGLE_MAPS_API_KEY=your_key npm run build
   ```

3. **Node Version Mismatch**:
   - Netlify uses Node 18 by default
   - Add `.nvmrc` file if needed: `18.17.0`

---

## 🔍 **Debugging Checklist**

### **Before Deployment**
- [ ] Local build successful: `npm run build`
- [ ] Environment variables documented
- [ ] `netlify.toml` configured correctly
- [ ] All dependencies in `package.json`

### **After Deployment**
- [ ] Site loads at Netlify URL
- [ ] Google Maps displays correctly
- [ ] API calls work (check Network tab)
- [ ] SPA routing functions (refresh pages)
- [ ] No console errors

### **Environment Variables Check**
```javascript
// Test in browser console
console.log('API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Set' : 'Missing');
console.log('Backend URL:', import.meta.env.VITE_API_BASE_URL);
console.log('Environment:', import.meta.env.VITE_ENVIRONMENT);
```

### **API Integration Test**
```javascript
// Test API proxy in browser console
fetch('/api/health')
  .then(r => r.json())
  .then(data => console.log('Backend health:', data))
  .catch(err => console.error('API Error:', err));
```

---

## 🎯 **Performance Optimization**

### **Build Optimization**
- ✅ Vite automatically optimizes builds
- ✅ Code splitting enabled
- ✅ Asset optimization included

### **Netlify Features**
- ✅ Global CDN distribution
- ✅ Automatic HTTPS
- ✅ Brotli compression
- ✅ Image optimization

### **Monitoring**
```bash
# Check build logs in Netlify Dashboard
# Monitor Core Web Vitals in browser DevTools
# Use Lighthouse for performance audits
```

---

## 🚨 **Emergency Procedures**

### **If Site Goes Down**
1. **Check Netlify Status**: https://netlifystatus.com
2. **Check Backend Health**: https://pathoptix-backend-8080.zeabur.app/api/health
3. **Review Deploy Logs**: Netlify Dashboard → Deploys → [Latest Deploy]
4. **Rollback if Needed**: Netlify Dashboard → Deploys → [Previous Working Deploy] → Publish

### **If Backend Issues**
1. **Check Zeabur Status**: Backend dashboard
2. **Verify Health Endpoint**: `curl https://pathoptix-backend-8080.zeabur.app/api/health`
3. **Check Backend Logs**: Zeabur dashboard

---

## 🎉 **Success Indicators**

### **Deployment Successful When**
- ✅ Build completes without errors
- ✅ Site loads at Netlify URL
- ✅ Google Maps renders correctly
- ✅ Route search functionality works
- ✅ Backend API integration successful
- ✅ No console errors in browser
- ✅ Mobile responsiveness confirmed

### **Performance Targets**
- Load time: < 3 seconds
- Lighthouse score: 90+
- Core Web Vitals: All green
- API response time: < 500ms

---

**Quick Reference**: For immediate help, check environment variables first - most issues stem from missing API keys! 🔑
