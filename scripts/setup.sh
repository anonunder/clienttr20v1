#!/bin/bash

# TR20 Client Setup Script
# This script automates the initial setup process

set -e

echo "🚀 TR20 Client Setup"
echo "===================="
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "Node.js version: $NODE_VERSION"

# Install dependencies
echo ""
echo "📥 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo ""
  echo "📝 Creating .env file..."
  cp .env.example .env
  echo "✅ .env file created. Please update it with your API URLs."
else
  echo ""
  echo "✅ .env file already exists."
fi

# Create asset directories if they don't exist
echo ""
echo "📁 Creating asset directories..."
mkdir -p assets/images
mkdir -p assets/fonts

echo ""
echo "✅ Setup complete!"
echo ""
echo "📱 Next steps:"
echo "   1. Update .env with your API URLs"
echo "   2. Run 'npm start' to start the development server"
echo "   3. Press 'i' for iOS, 'a' for Android, or 'w' for Web"
echo ""
echo "📚 For more information, see:"
echo "   - README.md for project overview"
echo "   - SETUP_GUIDE.md for detailed setup instructions"
echo "   - ARCHITECTURE.md for architecture details"
echo ""

