/**
 * EcomFlow MVP - AI Product Agent
 * 生成并发布产品 - 使用优质产品数据库
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

// 使用优质产品数据库
const { generateProductContent } = require("../services/productDatabase");
const { publishProduct } = require("../services/shopifyService");

/**
 * 产品Agent：生成并发布产品
 */
async function createProduct(keyword) {
  console.log(`📦 Creating product for: ${keyword}`);

  // 1. 从数据库获取优质产品数据
  const productData = generateProductContent(keyword);

  // 2. 发布到Shopify
  const shopifyProduct = await publishProduct(productData);

  console.log(`✅ Product created: ${shopifyProduct.handle}`);
  
  // 3. 保存视频脚本
  if (productData.video_script) {
    const fs = require('fs');
    const path = require('path');
    const scriptDir = path.join(__dirname, '../../data/video_scripts');
    fs.mkdirSync(scriptDir, { recursive: true });
    fs.writeFileSync(
      path.join(scriptDir, `${shopifyProduct.handle}_video.json`),
      JSON.stringify(productData.video_script, null, 2)
    );
    console.log(`🎬 Video script saved`);
  }
  
  return shopifyProduct;
}

module.exports = { createProduct };
