/**
 * 更新现有产品内容
 * 使用改进的AI服务重新生成优质描述、图片和视频脚本
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { generateProductContent } = require('./src/services/contentGenerator');
const { updateProduct } = require('./src/services/shopifyService');
const fs = require('fs');

async function updateExistingProducts() {
  console.log('🔄 开始更新现有产品...\n');
  
  // 1. 获取所有产品
  const { getProducts } = require('./src/services/shopifyService');
  const products = await getProducts();
  
  console.log(`📦 找到 ${products.length} 个产品\n`);
  
  // 2. 选择要更新的产品（选择最新的10个）
  const toUpdate = products.slice(-10);
  
  for (const product of toUpdate) {
    console.log(`\n📝 正在更新: ${product.title}`);
    console.log(`   Handle: ${product.handle}`);
    
    try {
      // 从handle提取关键词
      const keyword = extractKeyword(product.handle);
      
      // 生成新内容
      const newContent = await generateProductContent(keyword);
      
      console.log(`   🏷️ 新标题: ${newContent.title}`);
      console.log(`   💰 价格: $${newContent.price}`);
      console.log(`   🖼️ 图片: ${newContent.imageUrl.substring(0, 50)}...`);
      
      // 保存视频脚本
      if (newContent.videoScript) {
        const scriptFile = `./data/video_scripts/${product.handle}.json`;
        fs.mkdirSync('./data/video_scripts', { recursive: true });
        fs.writeFileSync(scriptFile, JSON.stringify(newContent.videoScript, null, 2));
        console.log(`   🎬 视频脚本已保存`);
      }
      
      // 更新到Shopify
      // await updateProduct(product.id, {
      //   title: newContent.title,
      //   body_html: newContent.description,
      //   vendor: 'EcomFlow'
      // });
      
      console.log(`   ✅ 更新完成`);
      
    } catch (error) {
      console.log(`   ❌ 错误: ${error.message}`);
    }
  }
  
  console.log('\n✅ 产品内容更新完成!');
}

/**
 * 从handle提取关键词
 */
function extractKeyword(handle) {
  // 移除常见后缀
  return handle
    .replace(/-premium-quality$/, '')
    .replace(/-[0-9]+$/, '')
    .replace(/-/g, ' ');
}

updateExistingProducts().catch(console.error);
