# EcomFlow Pro 安装部署指南

> 快速安装，一个人人可用的AI电商超级工厂

---

## 快速开始 (5分钟)

### 1. 克隆项目

```bash
git clone https://github.com/dunyuzoush-ch/ecomflow-pro.git
cd ecomflow-pro
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 填写你的配置
```

### 3. 一键启动

```bash
# 使用Docker (推荐)
docker-compose up -d

# 或使用Node.js
npm install
npm run setup
npm start
```

---

## 环境要求

| 组件 | 最低配置 | 推荐配置 |
|------|----------|----------|
| Node.js | v18+ | v20+ |
| Docker | 20.10+ | 24.0+ |
| PostgreSQL | 14+ | 15+ |
| Redis | 6+ | 7+ |
| 内存 | 4GB | 8GB+ |

---

## 配置说明 (.env)

### 必需配置

```bash
# ============ Shopify ============
SHOPIFY_SHOP=yourstore.myshopify.com
SHOPIFY_TOKEN=your_access_token
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret

# ============ OpenAI ============
OPENAI_API_KEY=sk-xxxxx

# ============ WordPress (可选) ============
WP_URL=https://yoursite.com
WP_USER=admin
WP_PASS=your_app_password

# ============ 数据库 ============
DATABASE_URL=postgresql://user:pass@localhost:5432/ecomflow
REDIS_URL=redis://localhost:6379

# ============ Agent 配置 ============
OPENCLAW_API_KEY=your_openclaw_key
```

### 可选配置 (广告)

```bash
# Meta Ads
META_ACCESS_TOKEN=your_token
META_AD_ACCOUNT_ID=act_xxxxx
META_PIXEL_ID=xxxxx

# TikTok Ads
TIKTOK_ADVERTISER_ID=xxxxx
TIKTOK_ACCESS_TOKEN=your_token

# Google Ads
GOOGLE_CUSTOMER_ID=xxxxx
GOOGLE_DEVELOPER_TOKEN=your_token
```

### 可选配置 (社媒)

```bash
# Twitter/X
TWITTER_API_KEY=xxxxx
TWITTER_API_SECRET=xxxxx
TWITTER_ACCESS_TOKEN=xxxxx
TWITTER_ACCESS_SECRET=xxxxx

# TikTok
TIKTOK_USERNAME=your_username
TIKTOK_PASSWORD=your_password
```

---

## Docker 部署 (推荐)

### 1. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  # 主应用
  ecomflow:
    image: ecomflow/pro:latest
    ports:
      - "3000:3000"
    env_file:
      - .env
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  # 数据库
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ecomflow
      POSTGRES_USER: ecomflow
      POSTGRES_PASSWORD: your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  # 缓存/队列
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

  # 可选: WordPress
  # wordpress:
  #   image: wordpress:php8.2
  #   ports:
  #     - "8080:80"
  #   volumes:
  #     - wp_data:/var/www/html

volumes:
  postgres_data:
  redis_data:
  # wp_data:
```

### 2. 启动

```bash
docker-compose up -d
docker-compose logs -f ecomflow
```

### 3. 访问

- 主应用: http://localhost:3000
- 健康检查: http://localhost:3000/health

---

## 本地开发部署

### 1. 安装依赖

```bash
# 克隆项目
git clone https://github.com/dunyuzoush-ch/ecomflow-pro.git
cd ecomflow-pro

# 安装Node.js依赖
npm install

# 安装PostgreSQL和Redis (或使用Docker)
# macOS
brew install postgresql redis

# Ubuntu
sudo apt install postgresql redis-server
```

### 2. 配置

```bash
# 复制配置
cp .env.example .env

# 编辑配置
nano .env
```

### 3. 初始化数据库

```bash
npm run db:init
```

### 4. 启动服务

```bash
# 开发模式 (热重载)
npm run dev

# 生产模式
npm start
```

---

## 服务管理命令

```bash
# 查看所有服务状态
npm run status

# 查看日志
npm run logs

# 重启服务
npm restart

# 停止服务
npm stop

# 清理数据
npm run clean
```

---

## 每日任务调度

### 使用Cron

```bash
# 编辑crontab
crontab -e

# 添加以下行 (每天0点执行)
0 0 * * * cd /path/to/ecomflow && npm run pipeline:daily >> /var/log/ecomflow.log 2>&1
```

### 使用PM2

```bash
# 安装PM2
npm install -g pm2

# 启动
pm2 start ecosystem.config.js

# 设置开机自启
pm2 startup
pm2 save
```

---

## 监控与报警

### 健康检查

```bash
# 检查服务状态
curl http://localhost:3000/health
```

### 日志

```bash
# 查看实时日志
tail -f logs/ecomflow.log

# 查看错误日志
grep ERROR logs/ecomflow.log
```

### 报警配置 (可选)

```bash
# Slack Webhook
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx

# 邮件通知
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your_password
```

---

## 常见问题

### Q: 如何获取Shopify Access Token?

```bash
# 方法1: Private App
# Shopify后台 → 设置 → 应用 → 开发应用 → 创建应用

# 方法2: OAuth (参考文档)
```

### Q: 广告投放需要什么账户?

- **Meta Ads**: 需要Facebook广告账户
- **TikTok Ads**: 需要TikTok商业账户
- **Google Ads**: 需要Google Ads账户

### Q: 可以只使用部分功能吗?

可以! 只需配置你想使用的服务:

- 只需Shopify? 只配置SHOPIFY_相关变量
- 只需SEO? 只配置WP_相关变量
- 只需广告? 配置ADS_相关变量

---

## 一键安装脚本

```bash
# 下载安装脚本
curl -O https://raw.githubusercontent.com/dunyuzoush-ch/ecomflow-pro/main/setup.sh
chmod +x setup.sh

# 运行安装
./setup.sh
```

---

## 升级更新

```bash
# 拉取最新代码
git pull origin main

# 重新构建
docker-compose build

# 重启服务
docker-compose restart

# 或Node.js模式
npm install
npm run db:migrate
npm restart
```

---

## 技术支持

- 文档: https://ecomflow.pro/docs
- 问题: https://github.com/dunyuzoush-ch/ecomflow-pro/issues
- 讨论: https://github.com/dunyuzoush-ch/ecomflow-pro/discussions

---

## 许可证

MIT License - 欢迎商业使用!

---

版本: 1.0.0
更新: 2026-03-10
