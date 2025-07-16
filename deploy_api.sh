#!/bin/bash
echo "🚀 Deploying DeepRoute AI API to Zeabur..."

# Install Zeabur CLI (if not installed)
if ! command -v zeabur &> /dev/null; then
    echo "Installing Zeabur CLI..."
    npm install -g zeabur
fi

# Login to Zeabur (interactive)
echo "Please login to Zeabur:"
zeabur auth login

# Deploy to Zeabur
echo "Deploying API..."
zeabur deploy

echo "✅ API deployment initiated!"
echo "🌐 Your API will be available at: https://deeproute-ai-api.zeabur.app"
