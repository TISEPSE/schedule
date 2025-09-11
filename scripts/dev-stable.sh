#!/bin/bash

# Development stability script
# This script ensures a clean development environment

echo "🔧 Starting stable development environment..."

# Kill any existing Next.js processes
echo "🛑 Stopping existing processes..."
pkill -f next || true

# Clean all caches
echo "🧹 Cleaning caches..."
rm -rf .next
rm -rf node_modules/.cache
npm cache clean --force

# Check for environment issues
echo "🔍 Checking environment..."
if [ ! -f ".env.local" ]; then
    echo "⚠️  Creating .env.local..."
    cat > .env.local << EOF
# Development environment settings
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
__NEXT_DISABLE_OVERLAY=1
REACT_EDITOR=code
GENERATE_SOURCEMAP=false
PORT=3001
EOF
fi

# Start development server with fallback
echo "🚀 Starting development server..."
if npm run dev; then
    echo "✅ Development server started successfully"
else
    echo "❌ Failed to start with standard config, trying fallback..."
    # Fallback: disable more features
    export FAST_REFRESH=false
    export GENERATE_SOURCEMAP=false
    npm run dev
fi