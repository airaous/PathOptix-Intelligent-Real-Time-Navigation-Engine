# ⚡ Quick Environment Variables Setup

## 🔑 **Required Environment Variables**

### **For Vercel Dashboard**
Go to: `Vercel Dashboard → pathoptix-navigation → Settings → Environment Variables`

Add these variables:

```bash
# Required for Google Maps functionality
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Backend API endpoint
VITE_API_BASE_URL=https://pathoptix-backend-8080.zeabur.app

# Optional: Environment identifier
VITE_ENVIRONMENT=production
```

## 🗝️ **Getting Google Maps API Key**

### Step 1: Google Cloud Console
1. Go to: https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Geocoding API

### Step 2: Create API Key
1. Go to: APIs & Services → Credentials
2. Click "Create Credentials" → "API Key"
3. Copy the generated key

### Step 3: Restrict API Key (Security)
1. Edit the API key
2. Application restrictions: HTTP referrers
3. Website restrictions:
   ```
   https://pathoptix-navigation.vercel.app/*
   https://pathoptix-navigation-*.vercel.app/*
   ```

## 🔄 **Setting Variables in Vercel**

### Method 1: Dashboard
1. Login to Vercel
2. Find `pathoptix-navigation` project
3. Settings → Environment Variables
4. Add each variable with "Production" environment
5. Redeploy the project

### Method 2: CLI (Alternative)
```bash
vercel env add VITE_GOOGLE_MAPS_API_KEY production
# Enter your API key when prompted

vercel env add VITE_API_BASE_URL production
# Enter: https://pathoptix-backend-8080.zeabur.app
```

## ✅ **Verification**

After setting variables and redeploying:

1. **Visit your Vercel URL**
2. **Expected**: PathOptix app loads with map
3. **If still showing config page**: Check browser console for errors
4. **Test API**: Try `/api/health` endpoint

## 🚨 **Troubleshooting**

### **Still showing configuration page?**
- Check environment variable names (exact case)
- Ensure "Production" environment is selected
- Trigger manual redeploy in Vercel

### **Google Maps not loading?**
- Verify API key is correct
- Check API restrictions in Google Cloud Console
- Ensure billing is enabled for Google Cloud project

### **API calls failing?**
- Verify backend URL: `https://pathoptix-backend-8080.zeabur.app/api/health`
- Check vercel.json proxy configuration
- Test backend directly

## 🎯 **Success Checklist**

- [ ] Google Maps API key created and restricted
- [ ] Environment variables set in Vercel
- [ ] Project redeployed successfully
- [ ] PathOptix app loads with interactive map
- [ ] Search autocomplete working
- [ ] Backend API integration functional

## 🔗 **Quick Links**

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Google Cloud Console**: https://console.cloud.google.com/
- **Backend Health**: https://pathoptix-backend-8080.zeabur.app/api/health
- **Project Repository**: https://github.com/airaous/PathOptix-Intelligent-Real-Time-Navigation-Engine
