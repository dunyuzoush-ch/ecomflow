# EcomFlow Configuration Guide

## 环境变量文件

项目目录 `ecommerce_factory/.env` 已创建，包含以下配置：

### 1. Shopify (必需)
```env
SHOPIFY_SHOP=ququmob.myshopify.com
SHOPIFY_TOKEN=shpat_你的access_token
```

获取 Shopify Access Token:
1. 登录 Shopify Admin
2. 进入 Settings → Apps and sales channels → Develop apps
3. 创建App → Configure Admin API scopes
4. 安装App → 获取Access Token

### 2. AI Providers (可选)
```env
OPENAI_API_KEY=sk-...
```

### 3. Twitter (已有配置)
```env
TWITTER_AUTH_TOKEN=3bcb9f64d326234ad4b42740cf4be7e6a6666085
TWITTER_CT0=6c0b18631cafd3e5da8ae75cbbeaee1cab8945598...
```

### 4. 其他API (可选)
- TikTok API
- Pinterest API  
- Facebook/Meta Ads
- WordPress (SEO)
- Google Analytics

## 本地运行

```bash
cd ecommerce_factory
npm install
# 编辑 .env 填入你的API keys
npm test
```

## 注意

- `.env` 文件已在 .gitignore 中，不会提交到GitHub
- 所有API Key都保存在本地
