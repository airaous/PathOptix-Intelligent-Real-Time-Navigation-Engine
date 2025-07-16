#!/bin/bash
echo "🚀 Deploying PathOptix Frontend to Vercel..."

# Install Vercel CLI (if not installed)
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project
echo "Building production bundle..."
npm run build

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "✅ Frontend deployment completed!"
echo "🌐 Your app will be available at: https://pathoptix-deeproute.vercel.app"
