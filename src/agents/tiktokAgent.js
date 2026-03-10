/**
 * EcomFlow MVP - TikTok Video Agent
 * 自动生成TikTok视频并发布
 * 
 * 支持两种模式：
 * 1. API模式 - 需要TikTok for Developers账号
 * 2. 浏览器自动化 - 使用OpenClaw browser
 */

const axios = require("axios");
const path = require("path");

// TikTok配置
const TIKTOK_CONFIG = {
  // API模式需要配置
  advertiserId: process.env.TIKTOK_ADVERTISER_ID,
  accessToken: process.env.TIKTOK_ACCESS_TOKEN,
  
  // 浏览器模式配置
  username: process.env.TIKTOK_USERNAME,
  password: process.env.TIKTOK_PASSWORD,
  
  // 视频配置
  videoDir: path.join(__dirname, "../../data/videos"),
  maxVideoDuration: 60, // 秒
};

/**
 * 生成TikTok视频脚本
 */
function generateTikTokScript(product) {
  const hooks = [
    `This $${product.price} product is blowing up on TikTok! 🔥`,
    `Stop scrolling! This ${product.title} changed everything!`,
    `Why is everyone talking about this? 🤔`,
    `This hack is insane! 💰`,
    `I can't believe this exists! 😱`,
    `Wait for it... ⏰`,
    `This changed my life! 🌟`
  ];
  
  const painPoints = [
    "solving everyday problems",
    "making life easier",
    "saving time and money",
    "looking amazing",
    "feeling confident"
  ];
  
  const ctas = [
    "👇 Get yours now!",
    "💬 Comment 'YES' if you want one!",
    "🔗 Link in bio!",
    "❤️ Like and share!",
    "📩 DM me to order!"
  ];

  const hook = hooks[Math.floor(Math.random() * hooks.length)];
  const painPoint = painPoints[Math.floor(Math.random() * painPoints.length)];
  const cta = ctas[Math.floor(Math.random() * ctas.length)];

  const scripts = [
    // 模式1: 痛点+解决方案
    `🎬 ${hook}\n\nWhy it's special:\n- ${painPoint}\n- High quality materials\n- Thousands of 5-star reviews\n\n${cta}\n\n#fyp #viral #trending #shopping #dropship`,
    
    // 模式2: POV风格
    `POV: You discovered this before everyone else 😎\n\n${product.title}\n- $${product.price}\n- ⭐⭐⭐⭐⭐\n- Free shipping worldwide!\n\n${cta}\n\n#fyp #viral #pov #shopping #trending`,
    
    // 模式3: 问答式
    `Q: What's the best ${product.tags?.[0] || 'product'} under $50?\n\nA: ${product.title} 🔥\n\nWhy:\n✓ Amazing quality\n✓ Great price\n✓ Fast shipping\n\n${cta}\n\n#fyp #shopping #deals #viral`,
    
    // 模式4: 列表式
    `3 reasons you need ${product.title}:\n\n1. 🔥 It's trending\n2. 💰 Amazing price at $${product.price}\n3. ⭐ 5000+ sold\n\n${cta}\n\n#fyp #viral #trending #shopping`,
    
    // 模式5: 悬念式
    `Wait for it... ⏰\n\nThis $${product.price} product has 10K people going crazy! 🚀\n\n${product.title}\n\n${cta}\n\n#fyp #viral #trending #shopping #viral`
  ];
  
  return scripts[Math.floor(Math.random() * scripts.length)];
}

/**
 * 生成视频描述
 */
function generateCaption(product, url) {
  const hashtags = [
    '#fyp',
    '#viral', 
    '#shopping',
    '#trending',
    '#deals',
    '#' + (product.tags?.[0] || 'product').replace(/\s+/g, ''),
    '#dropship',
    '#ecommerce'
  ];
  
  // 随机选3-5个标签
  const selectedTags = hashtags
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .join(' ');
  
  return `${product.title} - $${product.price} 🔥\n\n${selectedTags}`;
}

/**
 * 生成一组视频脚本（用于批量发布）
 */
function generateBatchScripts(products) {
  return products.map(product => ({
    product,
    script: generateTikTokScript(product),
    caption: generateCaption(product)
  }));
}

/**
 * TikTok API客户端
 */
class TikTokAdsClient {
  constructor(advertiserId, accessToken) {
    this.advertiserId = advertiserId;
    this.accessToken = accessToken;
    this.baseUrl = "https://business-api.tiktok.com/open_api/v1.3";
  }

  async request(endpoint, method = "GET", data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      method,
      url,
      headers: {
        "Content-Type": "application/json",
        "Access-Token": this.accessToken
      }
    };
    if (data) config.data = data;

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("TikTok API Error:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * 获取广告账户信息
   */
  async getAdvertiserInfo() {
    return this.request(`/advertiser/info?advertiser_ids=["${this.advertiserId}"]`);
  }

  /**
   * 创建广告系列
   */
  async createCampaign(config) {
    const data = {
      advertiser_id: this.advertiserId,
      campaign_name: config.name,
      objective_type: config.objective || "CONVERSION",
      budget_mode: config.budgetMode || "DAILY",
      budget: config.budget * 100, // 转换为分
      status: config.status || "PAUSE"
    };
    return this.request("/campaign/create/", "POST", data);
  }

  /**
   * 创建广告组
   */
  async createAdGroup(config) {
    const data = {
      advertiser_id: this.advertiserId,
      campaign_id: config.campaignId,
      adgroup_name: config.name,
      placement: ["TIKTOK"],
      budget_mode: "DAILY",
      budget: config.budget * 100,
      bid: config.bid || 5000, // $50
      status: "PAUSE"
    };
    return this.request("/adgroup/create/", "POST", data);
  }

  /**
   * 创建广告
   */
  async createAd(config) {
    const data = {
      advertiser_id: this.advertiserId,
      adgroup_id: config.adGroupId,
      creative_id: null, // 需要先创建creative
      materials: [{
        video_id: config.videoId,
        display_name: config.name
      }],
      status: "PAUSE"
    };
    return this.request("/ad/create/", "POST", data);
  }
}

/**
 * 获取TikTok客户端
 */
function getTikTokClient() {
  if (!TIKTOK_CONFIG.advertiserId || !TIKTOK_CONFIG.accessToken) {
    return null;
  }
  return new TikTokAdsClient(TIKTOK_CONFIG.advertiserId, TIKTOK_CONFIG.accessToken);
}

/**
 * 发布到TikTok（模拟/API/浏览器）
 */
async function postToTikTok(videoPath, caption) {
  const client = getTikTokClient();
  
  if (client) {
    // API模式
    console.log("📹 TikTok: Using API mode");
    // TODO: 实现完整API发布流程
    return { status: 'api_mode', caption };
  } else if (TIKTOK_CONFIG.username) {
    // 浏览器自动化模式
    console.log("📹 TikTok: Would post via browser automation");
    return { status: 'browser_mode', caption };
  } else {
    // 模拟模式
    console.log("📹 TikTok: Not configured (simulated)");
    console.log(`   Caption: ${caption.substring(0, 50)}...`);
    return { status: 'simulated', caption };
  }
}

/**
 * 批量发布到TikTok
 */
async function postBatchToTikTok(products) {
  const results = [];
  const scripts = generateBatchScripts(products);
  
  for (const item of scripts) {
    console.log(`\n📹 TikTok: Processing ${item.product.title}`);
    const result = await postToTikTok(null, item.caption);
    results.push({
      product: item.product.title,
      ...result
    });
    
    // 避免API限流
    await new Promise(r => setTimeout(r, 2000));
  }
  
  return results;
}

/**
 * 生成视频 idea（用于AI视频生成）
 */
function generateVideoIdeas(product) {
  return [
    {
      type: "unboxing",
      title: `Unboxing ${product.title}`,
      duration: 30,
      style: "exciting"
    },
    {
      type: "product_demo",
      title: `${product.title} - Quick Demo`,
      duration: 45,
      style: "informative"
    },
    {
      type: "lifestyle",
      title: `Using ${product.title} in daily life`,
      duration: 60,
      style: "lifestyle"
    },
    {
      type: "transform",
      title: `Before & After with ${product.title}`,
      duration: 30,
      style: "transformation"
    }
  ];
}

module.exports = {
  generateTikTokScript,
  generateCaption,
  generateBatchScripts,
  generateVideoIdeas,
  postToTikTok,
  postBatchToTikTok,
  getTikTokClient,
  TikTokAdsClient,
  TIKTOK_CONFIG
};
