# 🚀 PathOptix Deployment Guide

## ✅ Security Status
- [x] API keys secured with environment variables
- [x] No hardcoded secrets in source code
- [x] Proper .gitignore configuration
- ⚠️ **WARNING**: Clean `deeproute_ai_development.ipynb` before deployment

## 🔧 Deployment Options

### Option 1: Vercel (Recommended)

#### Prerequisites
1. GitHub account connected to Vercel
2. Clean Google Maps API key (production-ready)

#### Steps
1. **Push clean code to GitHub**
   ```bash
   # Remove notebook with API key
   git rm deeproute_ai_development.ipynb
   git commit -m "Remove development notebook with API keys"
   git push
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables:
     - `VITE_GOOGLE_MAPS_API_KEY`: Your production API key
     - `VITE_API_BASE_URL`: https://deeproute-ai-api.zeabur.app
     - `VITE_ENVIRONMENT`: production

3. **Verify deployment**
   - Check build logs for errors
   - Test all navigation features
   - Verify API calls work

### Option 2: Netlify

#### Steps
1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or connect GitHub repository

3. **Configure environment variables**
   - In Netlify dashboard → Site settings → Environment variables
   - Add: `VITE_GOOGLE_MAPS_API_KEY`

### Option 3: GitHub Pages

#### Setup GitHub Pages with Actions
1. **Create workflow file**: `.github/workflows/deploy.yml`
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
         
         - name: Install dependencies
           run: npm ci
         
         - name: Build
           run: npm run build
           env:
             VITE_GOOGLE_MAPS_API_KEY: ${{ secrets.VITE_GOOGLE_MAPS_API_KEY }}
         
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

2. **Add secrets to GitHub**
   - Repository → Settings → Secrets and variables → Actions
   - Add: `VITE_GOOGLE_MAPS_API_KEY`

## 🌐 Production Configuration

### Google Maps API Key Setup
1. **Create production API key**
   ```
   Google Cloud Console → Credentials → Create API Key
   ```

2. **Restrict the API key**
   - Application restrictions: HTTP referrers
   - Add your domain: `https://your-app.vercel.app/*`
   - API restrictions: Enable only:
     - Maps JavaScript API
     - Places API
     - Directions API

3. **Set billing alerts**
   - Billing → Budgets & alerts
   - Set monthly budget alert

### Domain Configuration
1. **Custom domain** (optional)
   - Configure in your deployment platform
   - Update API key restrictions
   - Setup SSL/TLS

2. **CORS configuration**
   - Already configured in `vercel.json`
   - Update API base URL if needed

## 📊 Performance Optimization

### Build Optimization
The current build is already optimized with:
- ✅ Vite for fast builds
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification

### Additional Optimizations
```bash
# Analyze bundle size
npm run build -- --analyze

# Check for unused dependencies
npx depcheck
```

## 🧪 Testing Before Deployment

### Local Production Build
```bash
# Build for production
npm run build

# Test production build locally
npm run preview
```

### Checklist
- [ ] All navigation features work
- [ ] Google Maps loads correctly
- [ ] Route calculation functions
- [ ] Mobile responsiveness
- [ ] No console errors
- [ ] API rate limits appropriate

## 🔄 Continuous Deployment

### Automatic Deployment
Most platforms support automatic deployment:
- **Vercel**: Auto-deploys on git push
- **Netlify**: Auto-deploys on git push
- **GitHub Pages**: Uses GitHub Actions

### Environment-specific Deployments
Consider separate environments:
- **Development**: `dev.your-app.com`
- **Staging**: `staging.your-app.com`
- **Production**: `your-app.com`

## 📈 Monitoring

### Analytics
Consider adding:
- Google Analytics 4
- Vercel Analytics
- Error tracking (Sentry)

### Performance Monitoring
- Core Web Vitals
- API response times
- Google Maps API quota usage

## 🆘 Troubleshooting

### Common Issues
1. **API key not working**
   - Check environment variable name
   - Verify API restrictions
   - Check billing status

2. **Build failures**
   - Check Node.js version (use 18+)
   - Clear node_modules and reinstall
   - Check for TypeScript errors

3. **CORS errors**
   - Verify API base URL
   - Check deployment domain

### Support
- Check Vercel/Netlify documentation
- Google Maps Platform documentation
- GitHub Issues for project-specific problems

---

**Ready to deploy? Follow the security checklist first!**
