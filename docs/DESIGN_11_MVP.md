# EcomFlow Pro MVP - 最小可运行版本

> 1天内跑通端到端自动化
> 版本：v1.0 MVP

---

## 一、MVP功能范围（严格控制）

### 第一天只做4件事

| # | 功能 | 说明 |
|---|------|------|
| 1 | 趋势抓取 | 模拟或简单抓取 |
| 2 | 产品生成 | 标题/描述/价格/图片 |
| 3 | Shopify发布 | 自动发布到店铺 |
| 4 | 社媒推广 | 自动发推文 |

### 数据流

```
trend → product → shopify publish → social post
```

---

## 二、MVP项目结构

```
ecomflow-mvp/
│
├ src/
│   ├ agents/
│   │   ├── trendAgent.js      # 趋势Agent
│   │   ├── productAgent.js   # 产品Agent
│   │   └── socialAgent.js    # 社媒Agent
│   │
│   ├ services/
│   │   ├── shopifyService.js # Shopify服务
│   │   └── aiService.js      # AI生成服务
│   │
│   ├ jobs/
│   │   └── dailyJob.js       # 每日任务
│   │
│   └ config/
│       └── env.js            # 配置
│
├ index.js                   # 入口
├ package.json
├ docker-compose.yml
└ .env.example
```

---

## 三、环境配置

### .env

```bash
# ============ Shopify ============
SHOPIFY_STORE=yourstore.myshopify.com
SHOPIFY_TOKEN=xxxx

# ============ OpenAI ============
OPENAI_API_KEY=sk-xxxx

# ============ Twitter/X ============
TWITTER_API_KEY=xxxx
TWITTER_API_SECRET=xxxx
TWITTER_ACCESS_TOKEN=xxxx
TWITTER_ACCESS_SECRET=xxxx
```

---

## 四、AI生成服务

```javascript
// src/services/aiService.js

const axios = require("axios");

/**
 * AI生成产品数据
 */
async function generateProduct(keyword) {
  const prompt = `
Create a dropshipping product.

Keyword: ${keyword}

Return JSON:

{
  "title": "...",
  "description": "...",
  "price": "...",
  "tags": [...]
}
`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-5-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      }
    }
  );

  // 解析JSON响应
  const content = response.data.choices[0].message.content;
  return JSON.parse(content);
}

module.exports = { generateProduct };
```

---

## 五、Shopify发布服务

```javascript
// src/services/shopifyService.js

const axios = require("axios");

/**
 * 发布产品到Shopify
 */
async function publishProduct(product) {
  const url = `https://${process.env.SHOPIFY_STORE}/admin/api/2024-10/products.json`;

  const payload = {
    product: {
      title: product.title,
      body_html: product.description,
      vendor: "EcomFlow",
      status: "active",
      tags: product.tags || [],
      variants: [
        {
          price: product.price,
          sku: `SKU-${Date.now()}`,
          inventory_management: "shopify",
          inventory_quantity: 100
        }
      ]
    }
  };

  try {
    const res = await axios.post(url, payload, {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_TOKEN,
        "Content-Type": "application/json"
      }
    });

    console.log(`✅ Product published: ${res.data.product.title}`);
    return res.data.product;
  } catch (error) {
    console.error("❌ Shopify Error:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * 上传产品图片
 */
async function uploadProductImage(productId, imageUrl) {
  const url = `https://${process.env.SHOPIFY_STORE}/admin/api/2024-10/products/${productId}/images.json`;

  await axios.post(
    url,
    { image: { src: imageUrl } },
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_TOKEN
      }
    }
  );
}

module.exports = { publishProduct, uploadProductImage };
```

---

## 六、Trend Agent

```javascript
// src/agents/trendAgent.js

/**
 * MVP版本：使用预设关键词
 * 后续可升级为真实抓取
 */
async function getTrends() {
  // 预设热门关键词列表
  const trends = [
    "camping gadget",
    "pet grooming tool",
    "kitchen slicer",
    "yoga accessories",
    "fitness equipment",
    "home organization",
    "outdoor gear",
    "smart home device"
  ];

  // 随机选择3-5个
  const selected = trends
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 3);

  console.log(`📊 Trends selected: ${selected.join(", ")}`);
  return selected;
}

/**
 * 后续升级：真实趋势抓取
 */
async function getRealTrends() {
  // TODO: 接入真实数据源
  // - TikTok trending
  // - Amazon bestsellers
  // - Pinterest trends
  return [];
}

module.exports = { getTrends, getRealTrends };
```

---

## 七、Product Agent

```javascript
// src/agents/productAgent.js

const { generateProduct } = require("../services/aiService");
const { publishProduct, uploadProductImage } = require("../services/shopifyService");

/**
 * 产品Agent：生成并发布产品
 */
async function createProduct(keyword) {
  console.log(`\ product for: ${n📦 Creatingkeyword}`);

  // 1. AI生成产品数据
  const productData = await generateProduct(keyword);

  // 2. 发布到Shopify
  const shopifyProduct = await publishProduct(productData);

  // 3. 可选：上传图片
  // if (productData.imageUrl) {
  //   await uploadProductImage(shopifyProduct.id, productData.imageUrl);
  // }

  console.log(`✅ Product created: ${shopifyProduct.handle}`);
  return shopifyProduct;
}

module.exports = { createProduct };
```

---

## 八、Social Agent

```javascript
// src/agents/socialAgent.js

const { TwitterApi } = require("twitter-api-v2");

// 初始化Twitter客户端
const getTwitterClient = () => {
  return new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET
  });
};

/**
 * 社媒Agent：发布推广内容
 */
async function postTweet(product) {
  const storeUrl = `https://${process.env.SHOPIFY_STORE}/products/${product.handle}`;

  // 生成推文内容
  const tweetContent = generateTweet(product, storeUrl);

  try {
    const client = getTwitterClient();
    const tweet = await client.v2.tweet(tweetContent);

    console.log(`🐦 Tweet posted: ${tweet.data.id}`);
    return tweet.data;
  } catch (error) {
    console.error("❌ Twitter Error:", error.message);
    throw error;
  }
}

/**
 * 生成推文内容
 */
function generateTweet(product, url) {
  const templates = [
    `🔥 New dropshipping product just launched!\n\n${product.title}\n\n💰 Just $${product.price}\n\nCheck it out 👇\n${url}`,
    
    `🚨 Hot new product alert!\n\n${product.title}\n\nDon't miss out! 🔥\n\n${url}`,
    
    `✨ New find: ${product.title}\n\n${product.price} - Amazing value!\n\nShop now 👇\n${url}`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * 后续升级：TikTok
 */
async function postToTikTok(videoPath) {
  // TODO: TikTok API集成
  console.log("📹 TikTok posting not implemented yet");
}

/**
 * 后续升级：Pinterest
 */
async function postToPinterest(product, imagePath) {
  // TODO: Pinterest API集成
  console.log("📌 Pinterest posting not implemented yet");
}

module.exports = { postTweet, postToTikTok, postToPinterest };
```

---

## 九、每日自动任务

```javascript
// src/jobs/dailyJob.js

const { getTrends } = require("../agents/trendAgent");
const { createProduct } = require("../agents/productAgent");
const { postTweet } = require("../agents/socialAgent");

/**
 * 每日任务主函数
 */
async function runDaily() {
  console.log("\n🚀 ========== Starting Daily Pipeline ==========\n");

  const startTime = Date.now();

  try {
    // 1. 获取趋势关键词
    console.log("📊 Step 1: Getting trends...");
    const trends = await getTrends();
    console.log(`   Found ${trends.length} trends`);

    // 2. 为每个趋势创建产品
    for (const keyword of trends) {
      try {
        // 生成并发布产品
        const product = await createProduct(keyword);

        // 发布社媒推广
        await postTweet(product);

        // 避免API限流
        await sleep(2000);

      } catch (error) {
        console.error(`   ❌ Failed to process ${keyword}:`, error.message);
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ Pipeline completed in ${duration}s`);

  } catch (error) {
    console.error("❌ Pipeline failed:", error);
  }
}

/**
 * 延迟函数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { runDaily };
```

---

## 十、主程序

```javascript
// index.js

require("dotenv").config();

const { runDaily } = require("./src/jobs/dailyJob");

/**
 * EcomFlow MVP 启动
 */
async function start() {
  console.log(`
╔═══════════════════════════════════════╗
║     EcomFlow Pro MVP - Starting...    ║
╚═══════════════════════════════════════╝
  `);

  try {
    await runDaily();
    console.log("\n🎉 All tasks completed!");
    process.exit(0);
  } catch (error) {
    console.error("\n💥 Error:", error);
    process.exit(1);
  }
}

// 运行
start();
```

---

## 十一、Docker部署

### docker-compose.yml

```yaml
version: "3"

services:
  ecomflow:
    build: .
    image: ecomflow/mvp:latest
    env_file:
      - .env
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  # 可选: 定时任务
  # cron:
  #   image: ecomflow/mvp:latest
  #   command: npm run daily
  #   env_file:
  #     - .env
  #   volumes:
  #     - ./data:/app/data
```

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "index.js"]
```

---

## 十二、运行方式

### 本地运行

```bash
# 1. 安装依赖
npm install

# 2. 配置环境
cp .env.example .env
# 编辑 .env 填入你的配置

# 3. 运行
node index.js
```

### Docker运行

```bash
# 构建并运行
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 定时运行

```bash
# 使用cron
0 0 * * * cd /path/to/ecomflow && node index.js
```

---

## 十三、预期输出

运行后控制台输出：

```
╔═══════════════════════════════════════╗
║     EcomFlow Pro MVP - Starting...    ║
╚═══════════════════════════════════════╝

🚀 ========== Starting Daily Pipeline ==========

📊 Step 1: Getting trends...
   Found 4 trends

📦 Creating product for: camping gadget
✅ Product published: camping-gadget-001
🐦 Tweet posted: 1234567890

📦 Creating product for: pet grooming tool
✅ Product published: pet-grooming-tool-002
🐦 Tweet posted: 1234567891

📦 Creating product for: kitchen slicer
✅ Product published: kitchen-slicer-003
🐦 Tweet posted: 1234567892

✅ Pipeline completed in 45.23s
```

---

## 十四、第二天升级

| # | 升级 | 说明 |
|---|------|------|
| 1 | TikTok视频 | 自动生成视频脚本+发布 |
| 2 | Pinterest | 自动Pin |
| 3 | SEO文章 | WordPress发布 |

---

## 十五、第三天升级

| # | 升级 | 说明 |
|---|------|------|
| 1 | 广告投放 | Meta/TikTok/Google Ads |
| 2 | 数据分析 | 销售/流量报表 |
| 3 | 爆款检测 | 自动识别高ROAS产品 |

---

## 十六、三个月目标

| 指标 | 目标 |
|------|------|
| Shopify Stores | 30 |
| Products | 5000+ |
| Social Posts | 100+/天 |
| 月GMV | $1M+ |

---

## 十七、快速行动建议

### 现在最该做的

```
不要继续设计
↓
把MVP跑起来
↓
每天自动发布20产品
↓
就已经是自动化电商系统
```

### 最小可行步骤

1. 配置 Shopify Token
2. 配置 OpenAI API Key
3. 配置 Twitter 开发者账号
4. 运行 `node index.js`
5. 验证产品发布成功

---

**MVP版本：** v1.0
**更新：** 2026-03-10
