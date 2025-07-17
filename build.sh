#!/bin/bash
echo "🚀 Building PathOptix Frontend with Node.js"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Ensure we're using Node.js
export NODE_ENV=production

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm ci

# Build the React app
echo "🔨 Building React application..."
npm run build

echo "✅ Build completed successfully!"
