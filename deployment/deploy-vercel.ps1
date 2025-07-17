# Vercel Deployment Script for PathOptix
# PowerShell script for Windows

Write-Host "🚀 Deploying PathOptix to Vercel..." -ForegroundColor Green

# Deploy to Vercel with environment variables
vercel `
  --build-env VITE_API_BASE_URL="https://pathoptix-backend-8080.zeabur.app" `
  --build-env VITE_ENVIRONMENT="production" `
  --name "pathoptix-navigation" `
  --prod

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🔧 Remember to set VITE_GOOGLE_MAPS_API_KEY in Vercel dashboard" -ForegroundColor Yellow
