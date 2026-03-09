/**
 * EcomFlow Product Service
 * 产品自动生成服务 - AI生成产品数据并发布到Shopify
 */

const axios = require('axios');
const fs = require('fs');

// ============ 配置 ============
const CONFIG = {
  shopify: {
    shop: process.env.SHOPIFY_SHOP || 'ququmob.myshopify.com',
    token: process.env.SHOPIFY_TOKEN,
    apiVersion: '2024-01'
  },
  ai: {
    provider: 'openai', // or 'claude', 'gemini'
    model: 'gpt-5-mini'
  },
  generation: {
    minProductsPerDay: 20,
    maxProductsPerDay: 50
  }
};

// ============ Shopify API ============

/**
 * 创建Shopify产品
 */
async function createShopifyProduct(product) {
  const { shop, token, apiVersion } = CONFIG.shopify;
  const url = `https://${shop}/admin/api/${apiVersion}/products.json`;
  
  const payload = {
    product: {
      title: product.title,
      body_html: product.description,
      vendor: product.vendor || 'EcomFlow',
      product_type: product.type || 'General',
      tags: product.tags || [],
      status: 'active',
      variants: [{
        price: product.price,
        sku: product.sku || `EF-${Date.now()}`,
        inventory_quantity: product.inventory || 100,
        weight: product.weight || 0.1,
        weight_unit: 'lb'
      }],
      images: product.images || []
    }
  };
  
  try {
    const response = await axios.post(url, payload, {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`[Shopify] Created product: ${product.title}`);
    return response.data.product;
  } catch (error) {
    console.error(`[Shopify] Error creating product:`, error.response?.data || error.message);
    throw error;
  }
}

/**
 * 获取产品列表
 */
async function getShopifyProducts(limit = 50) {
  const { shop, token, apiVersion } = CONFIG.shopify;
  const url = `https://${shop}/admin/api/${apiVersion}/products.json?limit=${limit}`;
  
  const response = await axios.get(url, {
    headers: {
      'X-Shopify-Access-Token': token
    }
  });
  
  return response.data.products;
生成 =========}

// ============ AI===

/**
 * AI生成产品标题
 */
async function generateTitle(productName) {
  const prompts = [
    `生成一个吸引人的Shopify产品标题，关于: ${productName}`,
    `Create an catchy product title for: ${productName}`
  ];
  
  // 调用AI API (可以用OpenAI/Claude/Gemini)
  // 这里简化处理
  const title = `Premium ${productName} - High Quality`;
  
  return title;
}

/**
 * AI生成产品描述
 */
async function generateDescription(product) {
  const prompt = `
生成一个SEO友好的产品描述:
产品名: ${product.name}
特点: ${product.features || 'High quality, Durable, Practical'}
目标用户: ${product.targetAudience || 'Everyone'}

要求:
- 200-300词
- 包含SEO关键词
- 突出卖点
- 包含行动号召
  `;
  
  // AI生成 (简化)
  const description = `
<h2>${product.name}</h2>
<p>Premium quality ${product.name.toLowerCase()} designed for ${product.targetAudience || 'everyone'}.</p>
<h3>Features:</h3>
<ul>
<li>High quality materials</li>
<li>Durable and long-lasting</li>
<li>Practical design</li>
<li>Perfect gift</li>
</ul>
<p>Order now and enjoy free shipping!</p>
  `;
  
  return description;
}

/**
 * AI生成产品图片 (调用图片生成API)
 */
async function generateProductImage(product) {
  // 调用DALL-E/Stable Diffusion生成
  const prompt = `Professional product photo, ${product.name}, white background, studio lighting, e-commerce`;
  
  // 返回生成的图片URL (需要接入图片生成API)
  return null;
}

// ============ 产品数据模板 ============

/**
 * 产品模板
 */
const PRODUCT_TEMPLATE = {
  name: '',
  price: '',
  vendor: 'EcomFlow',
  type: 'General',
  tags: [],
  features: [],
  targetAudience: '',
  images: [],
  margin: 15
};

/**
 * 从趋势产品生成完整产品数据
 */
async function generateProductFromTrend(trend) {
  const product = { ...PRODUCT_TEMPLATE };
  
  product.name = trend.name || trend.title;
  product.price = trend.price || calculatePrice(trend);
  product.tags = [trend.category, 'trending', 'new'];
  product.features = trend.features || [];
  product.targetAudience = trend.audience || 'General';
  product.source = trend.source;
  product.trendScore = trend.score;
  
  // AI生成
  product.title = await generateTitle(product.name);
  product.description = await generateDescription(product);
  
  // 图片
  // product.images = await generateProductImage(product);
  
  return product;
}

/**
 * 计算价格 (基于成本和利润率)
 */
function calculatePrice(product) {
  const cost = product.cost || 15;
  const margin = product.margin || 15;
  const profit = cost * (margin / 100);
  return (cost + profit).toFixed(2);
}

// ============ 主函数 ============

/**
 * 从趋势生成产品并发布
 */
async function generateAndPublish(trendingProducts) {
  const results = {
    generated: [],
    published: [],
    failed: []
  };
  
  for (const trend of trendingProducts) {
    try {
      // 1. 生成产品数据
      const product = await generateProductFromTrend(trend);
      results.generated.push(product);
      
      // 2. 发布到Shopify
      const shopifyProduct = await createShopifyProduct(product);
      results.published.push({
        trend,
        shopifyId: shopifyProduct.id,
        title: shopifyProduct.title
      });
      
      console.log(`[Product] Published: ${shopifyProduct.title}`);
    } catch (error) {
      results.failed.push({
        trend,
        error: error.message
      });
      console.error(`[Product] Failed: ${trend.name}`, error.message);
    }
  }
  
  // 保存结果
  fs.writeFileSync(
    './data/daily_published_products.json',
    JSON.stringify(results, null, 2)
  );
  
  return results;
}

/**
 * 每日产品生成主函数
 */
async function dailyProductGeneration() {
  console.log('[Product] Starting daily product generation...');
  
  // 1. 读取今日趋势
  let trendingProducts = [];
  try {
    const data = fs.readFileSync('./data/daily_trending_products.json', 'utf8');
    trendingProducts = JSON.parse(data);
  } catch (error) {
    console.log('[Product] No trending products found, using template products');
    trendingProducts = getTemplateProducts();
  }
  
  // 2. 生成并发布
  const results = await generateAndPublish(trendingProducts.slice(0, 30));
  
  console.log(`[Product] Done: ${results.published.length} published, ${results.failed.length} failed`);
  
  return results;
}

/**
 * 模板产品 (当没有趋势数据时)
 */
function getTemplateProducts() {
  return [
    { name: 'Portable Espresso Maker', category: 'kitchen', price: '25.99' },
    { name: 'Cat Enrichment Toys', category: 'pets', price: '15.99' },
    { name: 'Home Gym Accessories', category: 'fitness', price: '19.99' },
    { name: 'Car Camping Gear', category: 'outdoor', price: '35.99' },
    { name: 'Standing Desk Accessories', category: 'office', price: '22.99' }
  ];
}

// ============ 导出 ============

module.exports = {
  createShopifyProduct,
  getShopifyProducts,
  generateProductFromTrend,
  dailyProductGeneration,
  generateTitle,
  generateDescription
};

// 如果直接运行
if (require.main === module) {
  dailyProductGeneration()
    .then(results => console.log('Done:', results))
    .catch(err => console.error(err));
}
