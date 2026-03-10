# EcomFlow Pro - 工程级代码架构蓝图 v1

> 可开发、可部署、可扩展的系统
> 版本：v1.0 工程代码版

---

## 一、Monorepo 项目结构

### 推荐结构：单仓库 + 多服务

```
ecomflow-pro/
│
├ core/
│   ├ orchestrator/           # 核心编排器
│   ├ event-bus/             # 事件总线
│   └ scheduler/               # 调度器
│
├ agents/
│   ├ trend_agent/           # 趋势Agent
│   ├ niche_agent/           # 赛道Agent
│   ├ product_agent/          # 产品Agent
│   ├ content_agent/          # 内容Agent
│   ├ creative_agent/         # 创意Agent
│   ├ traffic_agent/          # 流量Agent
│   ├ ads_agent/             # 广告Agent
│   ├ growth_agent/           # 增长Agent
│   ├ cro_agent/             # 转化优化Agent
│   ├ risk_agent/            # 风控Agent
│   └ analytics_agent/        # 分析Agent
│
├ services/
│   ├ trend-service/         # 趋势服务
│   ├ product-service/        # 产品服务
│   ├ content-service/        # 内容服务
│   ├ creative-service/       # 创意服务
│   ├ traffic-service/        # 流量服务
│   ├ ads-service/            # 广告服务
│   └ analytics-service/     # 分析服务
│
├ factories/
│   ├ store-factory/          # 店铺工厂
│   ├ product-factory/       # 产品工厂
│   ├ content-factory/        # 内容工厂
│   └ video-factory/          # 视频工厂
│
├ integrations/
│   ├ shopify/              # Shopify集成
│   ├ tiktok/               # TikTok集成
│   ├ twitter/               # Twitter集成
│   └ pinterest/             # Pinterest集成
│
├ database/
│   ├ schema.sql             # 数据库Schema
│   └ migrations/            # 迁移文件
│
├ infra/
│   ├ docker/               # Docker配置
│   ├ kubernetes/            # K8s配置
│   └ terraform/            # IaC配置
│
└ workflows/
    ├ daily_pipeline.yaml    # 日常流水线
    └ growth_pipeline.yaml   # 增长流水线
```

---

## 二、Agent Orchestrator

### 核心代码

```javascript
// core/orchestrator/index.js

const kafka = require('../event-bus/kafka');
const agents = require('../../agents');

/**
 * Agent编排器 - 事件处理核心
 */
class AgentOrchestrator {
  
  /**
   * 处理各类事件
   */
  async handleEvent(event) {
    const { type, payload } = event;
    
    switch(type) {
      // 趋势发现
      case 'trend_detected':
        await agents.nicheAgent.process(payload);
        break;
        
      // 赛道评分
      case 'niche_scored':
        await agents.productAgent.generate(payload);
        break;
        
      // 产品创建
      case 'product_created':
        await agents.contentAgent.create(payload);
        break;
        
      // 内容创建
      case 'content_created':
        await agents.trafficAgent.publish(payload);
        break;
        
      // 销售事件
      case 'sales_event':
        await agents.analyticsAgent.optimize(payload);
        break;
        
      // 优化触发
      case 'optimization_triggered':
        await agents.growthAgent.scale(payload);
        break;
        
      default:
        console.warn(`Unknown event type: ${type}`);
    }
  }
  
  /**
   * 启动编排器
   */
  async start() {
    // 订阅事件主题
    await kafka.subscribe('factory-events', this.handleEvent.bind(this));
    console.log('Agent Orchestrator started');
  }
}

module.exports = new AgentOrchestrator();
```

---

## 三、Kafka 事件系统

### 3.1 Kafka Producer

```javascript
// core/event-bus/kafka.js

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'ecomflow',
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

const producer = kafka.producer();

/**
 * 发布事件到Kafka
 */
async function publishEvent(type, payload) {
  await producer.connect();
  
  await producer.send({
    topic: 'factory-events',
    messages: [
      {
        key: type,
        value: JSON.stringify({
          type,
          payload,
          timestamp: Date.now()
        })
      }
    ]
  });
  
  console.log(`Event published: ${type}`);
}

/**
 * 创建消费者
 */
async function createConsumer(groupId, handler) {
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  await consumer.subscribe({ topic: 'factory-events', fromBeginning: false });
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      await handler(event);
    }
  });
  
  return consumer;
}

module.exports = {
  kafka,
  producer,
  publishEvent,
  createConsumer
};
```

### 3.2 事件Topics

| Topic | 说明 | 消息量/天 |
|-------|------|-----------|
| trend-events | 趋势事件 | 1K+ |
| product-events | 产品事件 | 10K+ |
| content-events | 内容事件 | 500+ |
| traffic-events | 流量事件 | 100K+ |
| sales-events | 销售事件 | 1K+ |
| optimization-events | 优化事件 | 100+ |

---

## 四、Trend Agent 示例

```javascript
// agents/trend_agent/index.js

const axios = require('axios');
const { publishEvent } = require('../../core/event-bus/kafka');

/**
 * 趋势发现Agent
 */
class TrendAgent {
  
  /**
   * 主函数：发现趋势
   */
  async discoverTrends() {
    console.log('[TrendAgent] Starting trend discovery...');
    
    // 抓取各平台趋势
    const [tiktokTrends, amazonBestsellers, pinterestTrends] = await Promise.all([
      this.scrapeTikTokTrends(),
      this.scrapeAmazonBestsellers(),
      this.scrapePinterestTrends()
    ]);
    
    // 合并趋势
    const allTrends = [...tiktokTrends, ...amazonBestsellers, ...pinterestTrends];
    
    // 过滤和评分
    const scoredTrends = this.scoreTrends(allTrends);
    
    // 发布事件
    for (const trend of scoredTrends) {
      await publishEvent('trend_detected', {
        keyword: trend.keyword,
        velocity: trend.velocity,
        volume: trend.volume,
        competition: trend.competition,
        source: trend.source
      });
    }
    
    console.log(`[TrendAgent] Discovered ${scoredTrends.length} trends`);
    return scoredTrends;
  }
  
  /**
   * 抓取TikTok趋势
   */
  async scrapeTikTokTrends() {
    // 实际实现调用TikTok API
    return [
      { keyword: 'camping gear', velocity: 95, volume: 50000, source: 'tiktok' },
      { keyword: 'yoga mat', velocity: 88, volume: 45000, source: 'tiktok' }
    ];
  }
  
  /**
   * 抓取Amazon热销
   */
  async scrapeAmazonBestsellers() {
    return [
      { keyword: 'pet toys', velocity: 80, volume: 80000, source: 'amazon' }
    ];
  }
  
  /**
   * 抓取Pinterest趋势
   */
  async scrapePinterestTrends() {
    return [
      { keyword: 'home decor', velocity: 75, volume: 60000, source: 'pinterest' }
    ];
  }
  
  /**
   * 趋势评分
   */
  scoreTrends(trends) {
    return trends.map(t => ({
      ...t,
      score: (t.velocity * 0.4) + (t.volume / 1000) * 0.3 + (100 - t.competition) * 0.3
    })).filter(t => t.score > 50);
  }
}

module.exports = new TrendAgent();
```

---

## 五、Product Factory（Shopify自动铺货）

### 核心代码

```javascript
// services/product-service/shopifyPublisher.js

const axios = require('axios');

/**
 * Shopify产品发布服务
 */
class ShopifyPublisher {
  
  constructor() {
    this.baseUrl = `https://${process.env.SHOP}/admin/api/2024-10`;
    this.headers = {
      'X-Shopify-Access-Token': process.env.SHOPIFY_TOKEN,
      'Content-Type': 'application/json'
    };
  }
  
  /**
   * 发布产品到Shopify
   */
  async publishProduct(product) {
    const payload = {
      product: {
        title: product.title,
        body_html: product.description,
        vendor: product.vendor || 'EcomFlow',
        product_type: product.type,
        tags: product.tags || [],
        status: 'active',
        variants: [
          {
            price: product.price,
            sku: product.sku || `SKU-${Date.now()}`,
            inventory_management: 'shopify',
            inventory_quantity: product.quantity || 100
          }
        ],
        images: product.images?.map(url => ({ src: url })) || []
      }
    };
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/products.json`,
        payload,
        { headers: this.headers }
      );
      
      console.log(`[Shopify] Product published: ${response.data.product.id}`);
      return response.data.product;
      
    } catch (error) {
      console.error('[Shopify] Error:', error.response?.data || error.message);
      throw error;
    }
  }
  
  /**
   * 批量发布产品
   */
  async publishBatch(products) {
    const results = [];
    
    for (const product of products) {
      try {
        const published = await this.publishProduct(product);
        results.push({ success: true, product: published });
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
      
      // 避免API限流
      await this.delay(1000);
    }
    
    return results;
  }
  
  /**
   * 延迟
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new ShopifyPublisher();
```

### Shopify API列表

| API | 用途 |
|-----|------|
| POST /products.json | 创建产品 |
| PUT /products/{id}.json | 更新产品 |
| POST /products/{id}/images.json | 上传图片 |
| GET /products.json | 获取产品列表 |
| POST /inventory_levels/set.json | 设置库存 |

---

## 六、Content Factory

### 6.1 文章生成

```javascript
// factories/content-factory/generateArticle.js

const openai = require('../ai/openai');

/**
 * SEO文章生成器
 */
class ArticleGenerator {
  
  /**
   * 生成SEO文章
   */
  async generateArticle(keyword, products = []) {
    const prompt = `
Write a 2000-word SEO article about "${keyword}".

Requirements:
1. Include SEO keywords naturally
2. Product recommendations with buy links
3. Buying guide structure
4. FAQ section
5. Call-to-action

Products to recommend:
${products.map(p => `- ${p.name} - $${p.price}`).join('\n')}
    `;
    
    const result = await openai.generate(prompt, {
      max_tokens: 4000,
      temperature: 0.7
    });
    
    return {
      title: this.generateTitle(keyword),
      keyword,
      content: result.text,
      wordCount: result.text.split(' ').length,
      products: products
    };
  }
  
  /**
   * 生成标题
   */
  generateTitle(keyword) {
    const templates = [
      `The Ultimate ${keyword} Buying Guide for 2026`,
      `Best ${keyword} - Expert Reviews & Recommendations`,
      `${keyword}: Complete Guide & Top Picks`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }
  
  /**
   * 发布到WordPress
   */
  async publishToWordPress(article) {
    const response = await axios.post(
      `${process.env.WP_URL}/wp-json/wp/v2/posts`,
      {
        title: article.title,
        content: article.content,
        status: 'publish',
        categories: [1], // 默认分类
        tags: article.keyword.split(' ')
      },
      {
        auth: {
          username: process.env.WP_USER,
          password: process.env.WP_PASS
        }
      }
    );
    
    return response.data;
  }
}

module.exports = new ArticleGenerator();
```

### 6.2 视频脚本生成

```javascript
// factories/video-factory/scriptGenerator.js

/**
 * 视频脚本生成器
 */
class ScriptGenerator {
  
  /**
   * 生成TikTok脚本
   */
  generateScript(product) {
    const hook = this.generateHook(product);
    const problem = this.generateProblem(product);
    const solution = this.generateSolution(product);
    const proof = this.generateProof(product);
    const cta = this.generateCTA(product);
    
    return {
      hook,
      problem,
      solution,
      proof,
      cta,
      fullScript: `${hook}\n\n${problem}\n\n${solution}\n\n${proof}\n\n${cta}`
    };
  }
  
  /**
   * 生成Hook (0-3秒)
   */
  generateHook(product) {
    const hooks = [
      `You won't believe this ${product.category}!`,
      `This ${product.category} changed everything!`,
      `Stop scrolling! You need this ${product.category}.`,
      `Every ${product.category} owner needs this!`
    ];
    return hooks[Math.floor(Math.random() * hooks.length)];
  }
  
  /**
   * 生成痛点 (3-10秒)
   */
  generateProblem(product) {
    return `Problem: ${product.problem || 'Finding quality products is hard'}`;
  }
  
  /**
   * 生成方案 (10-20秒)
   */
  generateSolution(product) {
    return `Solution: This ${product.name} - ${product.benefit || 'Premium quality'}`;
  }
  
  /**
   * 生成证明 (20-25秒)
   */
  generateProof(product) {
    return `Proof: 5000+ happy customers, 4.9 star rating!`;
  }
  
  /**
   * 生成CTA (25-30秒)
   */
  generateCTA(product) {
    return `CTA: Link in bio to get yours now!`;
  }
}

module.exports = new ScriptGenerator();
```

---

## 七、Video Factory

### 模块结构

```
video-factory/
│
├ scriptGenerator.js      # 脚本生成
├ voiceGenerator.js        # TTS语音
├ videoEditor.js          # 视频剪辑
├ uploader.js             # 平台上传
│
└ index.js                # 入口
```

### 主流程

```javascript
// factories/video-factory/index.js

const scriptGenerator = require('./scriptGenerator');
const voiceGenerator = require('./voiceGenerator');
const videoEditor = require('./videoEditor');
const uploader = require('./uploader');

/**
 * 视频工厂
 */
class VideoFactory {
  
  /**
   * 生成并发布视频
   */
  async createAndPublish(product, platforms = ['tiktok', 'twitter']) {
    // 1. 生成脚本
    const script = scriptGenerator.generateScript(product);
    console.log('[Video] Script generated');
    
    // 2. 生成语音
    const voiceUrl = await voiceGenerator.generate(script.fullScript);
    console.log('[Video] Voice generated');
    
    // 3. 生成视频
    const videoUrl = await videoEditor.create(product, script, voiceUrl);
    console.log('[Video] Video created');
    
    // 4. 发布到各平台
    const results = [];
    for (const platform of platforms) {
      const result = await uploader.upload(platform, videoUrl, script);
      results.push({ platform, ...result });
    }
    
    return results;
  }
}

module.exports = new VideoFactory();
```

---

## 八、数据库 Schema v2

### 核心表

```sql
-- 店铺表
CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255),
  shopify_id VARCHAR(100),
  shopify_domain VARCHAR(255),
  niche_id INTEGER REFERENCES niches(id),
  status VARCHAR(50) DEFAULT 'active',
  risk_score DECIMAL DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 品牌表
CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  niche_id INTEGER REFERENCES niches(id),
  name VARCHAR(255) NOT NULL,
  story TEXT,
  logo_url VARCHAR(500),
  colors JSONB,
  domain VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 赛道表
CREATE TABLE niches (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  score DECIMAL,
  search_volume INTEGER,
  competition VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 产品表
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES stores(id),
  niche_id INTEGER REFERENCES niches(id),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  cost DECIMAL,
  score DECIMAL,
  shopify_product_id VARCHAR(100),
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 订单表
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES stores(id),
  shopify_order_id VARCHAR(100),
  customer_email VARCHAR(255),
  total_amount DECIMAL,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创意表
CREATE TABLE creatives (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  platform VARCHAR(50),
  creative_type VARCHAR(50),
  content JSONB,
  hook VARCHAR(255),
  ctr DECIMAL,
  cvr DECIMAL,
  roas DECIMAL,
  status VARCHAR(50) DEFAULT 'testing',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 实验表
CREATE TABLE experiments (
  id SERIAL PRIMARY KEY,
  experiment_type VARCHAR(50),
  product_id INTEGER REFERENCES products(id),
  variants JSONB,
  metric VARCHAR(50),
  winner VARCHAR(10),
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP
);

-- 流量表
CREATE TABLE traffic (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  source VARCHAR(50),
  campaign VARCHAR(255),
  clicks INTEGER DEFAULT 0,
  cost DECIMAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 客户表
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES stores(id),
  email VARCHAR(255),
  order_count INTEGER DEFAULT 0,
  total_revenue DECIMAL DEFAULT 0,
  cac DECIMAL,
  ltv DECIMAL,
  first_order_at TIMESTAMP,
  last_order_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 九、Docker 部署

### docker-compose.yml

```yaml
version: "3"

services:
  # OpenClaw核心
  openclaw:
    image: openclaw/openclaw:latest
    ports:
      - "3000:3000"
    env_file:
      - .env
    volumes:
      - ./data:/app/data
    depends_on:
      - kafka
      - redis
      - postgres

  # Kafka消息队列
  kafka:
    image: bitnami/kafka:latest
    ports:
      - "9092:9092"
    environment:
      - KAFKA_CFG_NODE_ID=1
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092
      - KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181
    depends_on:
      - zookeeper

  zookeeper:
    image: bitnami/zookeeper:latest
    ports:
      - "2181:2181"

  # Redis缓存
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  # PostgreSQL数据库
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=ecomflow
      - POSTGRES_USER=ecomflow
      - POSTGRES_PASSWORD=ecomflow_pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # 趋势服务
  trend-service:
    build: ./services/trend-service
    env_file:
      - .env
    depends_on:
      - kafka

  # 产品服务
  product-service:
    build: ./services/product-service
    env_file:
      - .env
    depends_on:
      - kafka
      - postgres

  # 内容服务
  content-service:
    build: ./services/content-service
    env_file:
      - .env
    depends_on:
      - kafka

volumes:
  postgres_data:
```

---

## 十、Kubernetes 架构

### 部署结构

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ecomflow-orchestrator
  namespace: ecomflow
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ecomflow-orchestrator
  template:
    spec:
      containers:
      - name: orchestrator
        image: ecomflow/orchestrator:latest
        ports:
        - containerPort: 3000

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: trend-worker
  namespace: ecomflow
spec:
  replicas: 5
  selector:
    matchLabels:
      worker: trend
  template:
    spec:
      containers:
      - name: trend
        image: ecomflow/trend-service:latest

---
# HPA 自动扩容
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: trend-worker-hpa
  namespace: ecomflow
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: trend-worker
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

## 十一、开发阶段

### 第一阶段：MVP（2周）

```
目标：基础功能跑通
├── trend agent
│   └── 趋势抓取
├── product factory
│   └── Shopify铺货
└── 日常：20产品/天
```

### 第二阶段：流量（2周）

```
目标：内容+流量
├── content factory
│   └── SEO文章
├── video factory
│   └── TikTok视频
└── 日常：50社媒/天
```

### 第三阶段：增长（2周）

```
目标：规模化
├── ads automation
│   └── 广告投放
├── creative testing
│   └── A/B测试
└── growth engine
    └── 爆款复制
```

---

## 十二、工程评价

### 系统能力

| 维度 | 水平 |
|------|------|
| 架构 | 创业公司级 |
| 可扩展性 | K8s级 |
| 事件驱动 | 生产级 |
| 代码质量 | 可维护 |

### 最终形态

```
AI电商自动化 SaaS
├── 30 stores
├── 100K+ products
├── 100M+ social impressions
└── $10M GMV/year
```

---

**文档版本：** v1.0
**更新：** 2026-03-10
