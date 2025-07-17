#!/bin/bash
# Vercel Deployment Script for PathOptix

echo "🚀 Deploying PathOptix to Vercel..."

# Set environment variables for deployment
export VITE_API_BASE_URL="https://pathoptix-backend-8080.zeabur.app"

# Deploy to Vercel with environment variables
vercel \
  --build-env VITE_API_BASE_URL="https://pathoptix-backend-8080.zeabur.app" \
  --build-env VITE_ENVIRONMENT="production" \
  --name "pathoptix-navigation" \
  --prod

echo "✅ Deployment complete!"
echo "🔧 Remember to set VITE_GOOGLE_MAPS_API_KEY in Vercel dashboard"
