/**
 * EcomFlow MVP - AI Product Agent
 * 生成并发布产品
 */

require('dotenv').config();

const { generateProduct } = require("../services/aiService");
const { publishProduct } = require("../services/shopifyService");

/**
 * 产品Agent：生成并发布产品
 */
async function createProduct(keyword) {
  console.log(`📦 Creating product for: ${keyword}`);

  // 1. AI生成产品数据
  const productData = await generateProduct(keyword);

  // 2. 发布到Shopify
  const shopifyProduct = await publishProduct(productData);

  console.log(`✅ Product created: ${shopifyProduct.handle}`);
  return shopifyProduct;
}

module.exports = { createProduct };
