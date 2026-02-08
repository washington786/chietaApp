#!/bin/bash

echo "🚀 Chieta Preview Release Setup"
echo "================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✓ Dependencies already installed"
fi

echo ""
echo "🔐 Checking EAS setup..."

# Check if eas-cli is installed
if ! command -v eas &> /dev/null; then
    echo "📥 Installing EAS CLI..."
    npm install -g eas-cli
else
    echo "✓ EAS CLI already installed"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Review PREVIEW_RELEASE.md for complete checklist"
echo "2. Update RELEASE_NOTES.md with your changes"  
echo "3. Ensure .env file is configured (copy from .env.example)"
echo "4. Create .env file: cp .env.example .env"
echo "5. Edit endpoints.txt to match your preview API"
echo ""
echo "To build preview:"
echo "  • For Android: npm run build:android"
echo "  • For iOS:     npm run build:ios"
echo "  • For both:    npm run build:all"
echo ""
echo "To test locally:"
echo "  • Android: npm run android"
echo "  • iOS:     npm run ios"
echo ""
