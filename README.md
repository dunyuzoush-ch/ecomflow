# EcomFlow Pro 🚀

> 全自动AI电商超级工厂 - 一个人就是一支电商团队

[English](./README_EN.md) | 中文

---

## 📌 简介

EcomFlow Pro 是一款**全自动化AI电商运营系统**，帮助你：

- ✅ **自动选品** - 每天发现50+潜力产品
- ✅ **自动铺货** - AI生成产品并发布到Shopify
- ✅ **自动内容** - SEO文章 + TikTok/X/Pinterest内容
- ✅ **自动流量** - 社媒发布 + 广告投放
- ✅ **自动优化** - 数据驱动，持续优化ROAS

**目标：12个月实现 $10M GMV**

---

## 🚀 一键部署

### Windows
```bash
deploy.bat
```

### Linux/VPS
```bash
chmod +x deploy.sh
./deploy.sh
```

### 远程VPS部署
```bash
chmod +x deploy-vps.sh
./deploy-vps.sh
```

---

## 🎯 功能特性

| 功能 | 说明 | 自动化程度 |
|------|------|------------|
| 趋势发现 | TikTok/Amazon/Etsy趋势抓取 | ✅ 每天自动 |
| 产品生成 | AI生成标题/描述/图片 | ✅ 每天20-50个 |
| Shopify发布 | 自动发布到店铺 | ✅ 每天自动 |
| SEO文章 | WordPress文章生成 | ✅ 每天10篇 |
| 社媒内容 | TikTok/X/Pinterest | ✅ 每天100+条 |
| 广告投放 | Meta/TikTok/Google | ✅ 自动测试 |
| 数据优化 | ROAS/CTR优化 | ✅ 每天自动 |

---

## 📦 系统架构

```
EcomFlow Pro
│
├─ Trend Service     # 趋势发现
├─ Product Service   # 产品生成
├─ Content Service   # 内容工厂
├─ Traffic Service   # 流量分发
├─ Ads Service       # 广告投放
└─ Analytics Service # 数据分析
```

---

## 🛠️ 安装配置

### 环境要求

| 组件 | 最低 | 推荐 |
|------|------|------|
| Docker | 20.10+ | 24.0+ |
| 内存 | 4GB | 8GB+ |
| 硬盘 | 20GB | 100GB |

### 配置步骤

详细步骤见 [安装指南](./INSTALL.md)

#### 1. 获取 Shopify Access Token

```bash
# 在 Shopify 后台：
# 设置 → 应用 → 开发应用 → 创建应用 → 配置权限 → 安装应用
```

#### 2. 配置环境变量

```bash
# 编辑 .env 文件
SHOPIFY_SHOP=yourstore.myshopify.com
SHOPIFY_TOKEN=shpat_xxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxx
```

#### 3. 启动服务

```bash
docker-compose up -d
```

---

## 📖 使用指南

### 每日自动化

系统每天自动执行：

| 时间 | 任务 |
|------|------|
| 00:00 | 趋势发现 |
| 02:00 | 产品生成 |
| 04:00 | Shopify发布 |
| 06:00 | 广告测试 |
| 08:00 | SEO文章 |
| 12:00 | 社媒发布 |
| 18:00 | 数据优化 |
| 20:00 | 广告优化 |

### 手动操作

```bash
# 运行单个模块
npm run pipeline:trends    # 趋势发现
npm run pipeline:products  # 产品生成
npm run pipeline:content   # 内容生成
npm run pipeline:traffic   # 流量发布
npm run pipeline:ads      # 广告投放
npm run pipeline:analytics # 数据分析

# 查看日志
docker-compose logs -f ecomflow
```

---

## 🔧 高级配置

### 可选：广告投放

```bash
# Meta Ads
META_ACCESS_TOKEN=xxx
META_AD_ACCOUNT_ID=act_xxx

# TikTok Ads
TIKTOK_ADVERTISER_ID=xxx
TIKTOK_ACCESS_TOKEN=xxx
```

### 可选：WordPress SEO

```bash
WP_URL=https://yoursite.com
WP_USER=admin
WP_PASS=xxx
```

### 可选：社媒账号

```bash
TWITTER_API_KEY=xxx
TWITTER_ACCESS_TOKEN=xxx
```

---

## 📊 效果预期

### 单店模式

| 阶段 | 时间 | 月GMV |
|------|------|-------|
| 启动 | 0-1月 | $1-5K |
| 成长 | 1-3月 | $5-30K |
| 稳定 | 3-6月 | $30-50K |

### 多店矩阵 (目标)

| 店铺数 | 月GMV | 年GMV |
|--------|--------|--------|
| 10 | $300K | $3.6M |
| 30 | $1M | $12M |

---

## ❓ 常见问题

### Q: 需要多少资金启动？

A: 
- 最低：$500 (Shopify月费 + 广告测试预算)
- 推荐：$2000 (包含广告测试 + 备用)

### Q: 可以只使用部分功能吗？

A: 可以！只需配置你想使用的服务：
- 只需铺货 → 只配Shopify
- 只需SEO → 只配WordPress
- 只需广告 → 只配广告平台

### Q: 需要人工干预吗？

A: 初期建议每天检查一下，稳定后可设置为完全自动化。

### Q: 如何获取支持？

A: 
- GitHub Issues: 报告问题
- GitHub Discussions: 提问交流

---

## 📝 更新日志

### v1.0.0 (2026-03-10)
- ✅ 初始版本发布
- ✅ 6大AI Agent
- ✅ 每日自动化流水线
- ✅ Docker一键部署
- ✅ 完整安装文档

---

## 📄 许可证

MIT License - 欢迎商业使用！

---

## 👤 开发者

**EcomFlow Pro Team**

- GitHub: https://github.com/dunyuzoush-ch/ecomflow
- 文档: https://github.com/dunyuzoush-ch/ecomflow/wiki

---

<div align="center">

**⭐ Star us on GitHub!**

</div>
