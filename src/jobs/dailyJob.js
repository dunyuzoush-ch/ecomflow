/**
 * EcomFlow MVP - Daily Job
 * 每日自动化任务 - 使用新服务
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const { discoverTrends } = require("../../services/trend-service");
const { generateProductFromTrend } = require("../../services/product-service");
const { publishProduct, STORES, loadProductCache, removeDuplicates } = require("../services/shopifyService");
const { generateSEOArticle } = require("../../services/content-service");
const { generateTwitterContent } = require("../../services/traffic-service");

/**
 * 每日任务主函数
 */
async function runDaily() {
  console.log(`
╔═══════════════════════════════════════╗
║     EcomFlow Pro MVP - Starting...    ║
║     ${new Date().toLocaleDateString()}                    ║
╚═══════════════════════════════════════╝
  `);

  const startTime = Date.now();

  try {
    // Step 1: 趋势发现
    console.log("\n📊 Step 1: Discovering trends...");
    const trends = await discoverTrends();
    console.log(`   Found ${trends.length} trending products`);

    // Step 2: 加载产品缓存
    console.log("\n📋 Step 2: Loading product caches...");
    for (const store of STORES) {
      await loadProductCache(store);
    }

    // Step 3: 生成并发布产品
    console.log("\n📦 Step 3: Creating products...");
    let published = 0;
    let skipped = 0;

    for (const trend of trends.slice(0, 10)) {
      try {
        // 使用product-service生成产品
        const product = await generateProductFromTrend(trend);
        
        // 使用shopify-service发布
        const result = await publishProduct(product);
        
        if (result) {
          published++;
          console.log(`   ✅ ${result.store}: ${result.title}`);
          
          // 生成Twitter内容
          const twitterContent = await generateTwitterContent(product);
          console.log(`   🐦 Tweet ready`);
          
        } else {
          skipped++;
        }

        // 避免API限流
        await new Promise(r => setTimeout(r, 1000));

      } catch (error) {
        console.error(`   ❌ Failed:`, error.message);
      }
    }

    console.log(`\n📈 Published: ${published}, Skipped: ${skipped}`);

    // Step 4: 生成SEO文章
    console.log("\n📝 Step 4: Creating SEO articles...");
    const keywords = trends.slice(0, 3).map(t => t.name || t.title);
    
    for (const kw of keywords) {
      try {
        const article = await generateSEOArticle(kw);
        console.log(`   📄 Article ready: ${article.title}`);
      } catch (e) {
        console.log(`   ⚠️ Article failed:`, e.message);
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ Pipeline completed in ${duration}s`);

  } catch (error) {
    console.error("\n💥 Pipeline failed:", error);
    throw error;
  }
}

/**
 * 清理重复产品
 */
async function cleanupDuplicates() {
  console.log("\n🧹 Starting cleanup...");
  
  for (const store of STORES) {
    await removeDuplicates(store);
  }
  
  console.log("✅ Cleanup complete");
}

module.exports = { runDaily, cleanupDuplicates };
