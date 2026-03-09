# EcomFlow - AI Ecommerce Super Factory

> 自动发现趋势 → 自动生成产品 → 自动创建内容 → 自动引流 → 自动优化

[English](README.md) | [中文](README_CN.md)

## 🎯 Mission

Build a fully automated ecommerce system that generates **$10M+ GMV in 12 months** through 30 Shopify stores.

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/dunyuzoush-ch/ecomflow.git
cd ecomflow
npm install

# Configure
cp .env.example .env
# Edit .env with your API keys

# Run daily pipeline
npm run daily
```

## 📁 Project Structure

```
ecomflow/
├── services/
│   ├── trend-service/      # Trend discovery
│   ├── product-service/    # Product generation & Shopify publish
│   ├── content-service/    # SEO & Social content
│   ├── traffic-service/    # Traffic distribution
│   └── analytics-service/  # Data optimization
├── agents/                 # OpenClaw agents
├── skills/                 # Reusable skills
├── workflows/              # Automation pipelines
├── tests/                  # Test cases
└── config/                 # Configuration
```

## 🔧 Configuration

Required API keys in `.env`:

```env
# Shopify
SHOPIFY_SHOP=yourstore.myshopify.com
SHOPIFY_TOKEN=your_private_app_token

# AI (OpenAI/Claude/Gemini)
OPENAI_API_KEY=sk-...

# Social Media
TIKTOK_API_KEY=...
TWITTER_API_KEY=...
PINTEREST_API_KEY=...

# WordPress (for SEO)
WP_URL=https://yoursite.com
WP_USER=admin
WP_PASS=app_password
```

## 📋 Daily Pipeline

| Time | Task |
|------|------|
| 00:00 | Trend Discovery |
| 02:00 | Product Generation |
| 04:00 | Shopify Publish |
| 08:00 | SEO Articles |
| 12:00 | Social Posts |
| 18:00 | Analytics & Optimization |

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific service
npm run test:trend
npm run test:product
```

## 📊 Architecture

```
┌─────────────────────────────────────────┐
│         OpenClaw Orchestrator          │
└───────────────┬─────────────────────────┘
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼
┌───────┐  ┌───────┐  ┌──────────┐
│ Trend │  │Product│  │ Content  │
│ Agent │  │ Agent │  │  Agent   │
└───┬───┘  └───┬───┘  └────┬─────┘
    │          │           │
    ▼          ▼           ▼
TikTok     Shopify     WordPress
Amazon     Products    Social
Pinterest              TikTok
```

## 🤖 Agents

| Agent | Function |
|-------|----------|
| `niche_agent` | Discover trending niches |
| `product_agent` | Generate & publish products |
| `content_agent` | Create SEO & social content |
| `traffic_agent` | Distribute traffic |
| `analytics_agent` | Optimize performance |

## 📈 Scale Plan

| Phase | Time | Stores | Revenue |
|-------|------|--------|---------|
| 1 | 0-3 months | 1 | $10k-30k/mo |
| 2 | 3-6 months | 5 | $150k/mo |
| 3 | 6-12 months | 30 | $1M/mo |

## 🔐 Security

- Never commit API keys to git
- Use environment variables
- Rotate tokens regularly

## 📝 License

MIT

---

Built with 🤖 by EcomFlow Team
