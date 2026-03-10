/**
 * EcomFlow MVP - Pinterest Agent
 * 自动发布Pinterest内容
 * 
 * 支持：
 * 1. Pinterest API - 需要Pinterest Developers账号
 * 2. 浏览器自动化 - 使用OpenClaw browser
 */

const axios = require("axios");

// Pinterest配置
const PINTEREST_CONFIG = {
  accessToken: process.env.PINTEREST_ACCESS_TOKEN,
  boardId: process.env.PINTEREST_BOARD_ID,
  username: process.env.PINTEREST_USERNAME,
};

/**
 * Pinterest API客户端
 */
class PinterestClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = "https://api.pinterest.com/v5";
  }

  async request(endpoint, method = "GET", data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      method,
      url,
      params: { access_token: this.accessToken },
      headers: { "Content-Type": "application/json" }
    };
    if (data) config.data = data;

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Pinterest API Error:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * 获取用户信息
   */
  async getUser() {
    return this.request("/user_account");
  }

  /**
   * 获取所有Board
   */
  async getBoards() {
    return this.request("/boards");
  }

  /**
   * 创建Board
   */
  async createBoard(config) {
    return this.request("/boards", "POST", {
      name: config.name,
      description: config.description || "EcomFlow Products",
      privacy: "PUBLIC"
    });
  }

  /**
   * 上传Pin图片
   */
  async uploadPin(config) {
    // Pinterest API需要先上传媒体
    const mediaData = {
      media_type: "image",
      source_url: config.imageUrl
    };
    
    const media = await this.request("/media", "POST", mediaData);
    
    // 然后创建Pin
    const pinData = {
      board_id: config.boardId,
      title: config.title,
      description: config.description,
      media_source: {
        source_type: "image_url",
        url: config.imageUrl
      },
      link: config.link
    };
    
    return this.request("/pins", "POST", pinData);
  }

  /**
   * 创建Pin (直接方式)
   */
  async createPin(config) {
    const data = {
      board_id: config.boardId,
      title: config.title,
      description: config.description,
      link: config.link,
      media_source: {
        source_type: "image_url",
        url: config.imageUrl
      }
    };
    
    return this.request("/pins", "POST", data);
  }
}

/**
 * 获取Pinterest客户端
 */
function getPinterestClient() {
  if (!PINTEREST_CONFIG.accessToken) {
    return null;
  }
  return new PinterestClient(PINTEREST_CONFIG.accessToken);
}

/**
 * 生成Pinterest内容
 */
function generatePinterestPost(product) {
  const currentYear = new Date().getFullYear();
  const keywords = [
    product.title,
    product.tags?.[0] || 'shopping',
    'trending',
    'best products',
    'must have ' + currentYear,
    'online shopping',
    'deals',
    'discount'
  ];

  return {
    title: `${product.title} - Must Have ${currentYear}`,
    description: `Discover the best ${product.title}! ⭐ $${product.price} - High quality, trending now. Free shipping available. Shop now at our store!`,
    link: `https://${process.env.SHOPIFY_STORE}/products/${product.handle}`,
    keywords,
    imageUrl: product.featuredImage || product.images?.[0]?.src
  };
}

/**
 * 生成Board名称
 */
function generateBoardName(productCategory) {
  const boards = {
    "home": "Home & Living Essentials",
    "fashion": "Fashion Must-Haves",
    "tech": "Cool Tech Gadgets",
    "beauty": "Beauty & Self-Care",
    "fitness": "Fitness & Wellness",
    "garden": "Garden & Outdoor",
    "kids": "Kids & Toys",
    "pet": "Pet Supplies",
    "kitchen": "Kitchen & Dining",
    "office": "Office & Study"
  };
  
  return boards[productCategory] || "Trending Products";
}

/**
 * 生成多个Pin的内容
 */
function generateBatchPins(products) {
  return products.map(product => generatePinterestPost(product));
}

/**
 * 发布到Pinterest
 */
async function postToPinterest(post) {
  const client = getPinterestClient();
  
  if (client) {
    // API模式
    console.log("📌 Pinterest: Using API mode");
    try {
      const result = await client.createPin({
        boardId: PINTEREST_CONFIG.boardId || "default",
        title: post.title,
        description: post.description,
        link: post.link,
        imageUrl: post.imageUrl
      });
      return { status: 'published', pinId: result.id };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  } else {
    // 模拟模式
    console.log("📌 Pinterest: Not configured (simulated)");
    console.log(`   Would pin: ${post.title}`);
    console.log(`   Link: ${post.link}`);
    return { status: 'simulated', ...post };
  }
}

/**
 * 批量发布到Pinterest
 */
async function postMultiplePinterest(products) {
  const results = [];
  const pins = generateBatchPins(products);
  
  for (const pin of pins) {
    console.log(`\n📌 Pinterest: Pinning ${pin.title}`);
    const result = await postToPinterest(pin);
    results.push(result);
    
    // 避免API限流
    await new Promise(r => setTimeout(r, 1500));
  }
  
  return results;
}

/**
 * 优化Pin SEO
 */
function optimizePinForSEO(product) {
  return {
    title: product.title.substring(0, 100), // Pinterest限制
    description: `${product.title} - ${product.description || ''} ${product.tags?.map(t => '#' + t).join(' ')}`.substring(0, 500),
    keywords: product.tags || ['shopping', 'trending'],
    link: `https://${process.env.SHOPIFY_STORE}/products/${product.handle}`
  };
}

module.exports = {
  generatePinterestPost,
  generateBoardName,
  generateBatchPins,
  optimizePinForSEO,
  postToPinterest,
  postMultiplePinterest,
  getPinterestClient,
  PinterestClient,
  PINTEREST_CONFIG
};
