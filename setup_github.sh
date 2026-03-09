#!/bin/bash
# EcomFlow GitHub Setup Script

echo "🚀 EcomFlow GitHub Setup"

# 1. Create GitHub repository (go to: https://github.com/new)
#    Name: ecomflow
#    Description: AI Ecommerce Super Factory - Automated ecommerce system
#    Public: Yes

echo ""
echo "📋 Step 1: Create GitHub repository"
echo "   Go to: https://github.com/new"
echo "   - Repository name: ecomflow"
echo "   - Description: AI Ecommerce Super Factory"
echo "   - Public: ✓"
echo "   - Click 'Create repository'"
echo ""

# 2. Push code
echo "📋 Step 2: Push code"
echo "   Run these commands:"
echo ""
echo "   cd ecommerce_factory"
echo "   git remote add origin https://github.com/dunyuzoush-ch/ecomflow.git"
echo "   git push -u origin master"
echo ""

# Alternative: Use GitHub CLI
echo "📋 Alternative: Using GitHub CLI (if installed)"
echo "   gh repo create ecomflow --public --source=. --description 'AI Ecommerce Super Factory'"
echo "   gh repo push origin master"
echo ""
