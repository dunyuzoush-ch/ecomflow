# EcomFlow Pro - 快速开始指南

## 5分钟快速开始

### 步骤1: 环境准备

```bash
# 克隆项目
git clone https://github.com/dunyuzoush-ch/ecomflow.git
cd ecomflow

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
```

### 步骤2: 配置Shopify

编辑 `.env` 文件:

```env
SHOPIFY_STORE=your-store.myshopify.com
SHOPIFY_TOKEN=your-access-token
```

### 步骤3: 配置WordPress (可选)

```env
WORDPRESS_URL=http://your-wordpress.com
WORDPRESS_USER=admin
WORDPRESS_PASS=your-app-password
```

### 步骤4: 运行MVP

```bash
node index.js
```

---

## 店铺管理

### 添加新店铺

```bash
# 自动创建新店铺(需要Partner账号)
node scripts/store_manager.js add

# 配置Token
node scripts/store_manager.js set-token mystore shpat_xxx
```

### 查看店铺列表

```bash
node scripts/store_manager.js list
```

---

## 配置说明

### 环境变量

| 变量 | 说明 | 必填 |
|------|------|------|
| SHOPIFY_STORE | Shopify店铺域名 | ✅ |
| SHOPIFY_TOKEN | Shopify Access Token | ✅ |
| WORDPRESS_URL | WordPress地址 | ⏳ |
| WORDPRESS_USER | WordPress用户名 | ⏳ |
| WORDPRESS_PASS | WordPress应用密码 | ⏳ |
| TWITTER_API_KEY | Twitter API Key | ⏳ |
| TWITTER_API_SECRET | Twitter API Secret | ⏳ |

---

## 定时任务

### 设置每日自动运行

```bash
# 编辑crontab
crontab -e

# 添加每日8点运行
0 8 * * * cd /path/to/ecomflow && node index.js
```

---

## 常见问题

### Q: Shopify Token过期怎么办?
A: 系统已配置自动刷新cron，每天自动刷新

### Q: 如何查看运行日志?
A: 日志保存在 `logs/` 目录

### Q: 支持多少店铺?
A: 当前支持30+店铺自动轮询

---

## 技术支持

- GitHub: https://github.com/dunyuzoush-ch/ecomflow
- 问题反馈: 请提交Issue

---

*版本: 0.1.0*
