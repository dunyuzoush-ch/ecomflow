/**
 * EcomFlow MVP - Complete Daily Pipeline
 * 完整的每日自动化流程
 */

require("dotenv").config();

const { getTrends } = require("../agents/trendAgent");
const { createProduct } = require("../agents/productAgent");
const { postTweet } = require("../agents/socialAgent");
const { generateAndPublishSEO } = require("../agents/seoAgent");
const { launchTestAds, optimizeAds } = require("../agents/adsAgent");
const { generateReport, autoOptimize, detectWinningProducts } = require("../agents/analyticsAgent");

/**
 * 完整每日流程
 */
async function runCompletePipeline() {
  console.log(`
╔══════════════════════════════════════════╗
║   EcomFlow Pro - Complete Pipeline    ║
╚══════════════════════════════════════════╝
  `);
  
  const startTime = Date.now();
  
  // ========== PHASE 1: 选品 ==========
  console.log('\n📊 PHASE 1: Product Discovery');
  console.log('================================');
  const trends = await getTrends();
  console.log(`Found ${trends.length} trending keywords`);
  
  // ========== PHASE 2: 生成产品 ==========
  console.log('\n📦 PHASE 2: Product Generation');
  console.log('================================');
  const products = [];
  for (const keyword of trends) {
    try {
      const product = await createProduct(keyword);
      products.push(product);
      console.log(`   ✅ ${product.title}`);
    } catch (e) {
      console.log(`   ❌ ${keyword}: ${e.message}`);
    }
  }
  console.log(`Generated ${products.length} products`);
  
  // ========== PHASE 3: 社媒推广 ==========
  console.log('\n🐦 PHASE 3: Social Media');
  console.log('================================');
  for (const product of products) {
    try {
      await postTweet(product);
    } catch (e) {
      console.log(`   ⚠️ Tweet failed: ${e.message}`);
    }
  }
  
  // ========== PHASE 4: SEO内容 ==========
  console.log('\n📝 PHASE 4: SEO Content');
  console.log('================================');
  const seoResults = await generateAndPublishSEO(trends, products);
  console.log(`SEO articles: ${seoResults.length}`);
  
  // ========== PHASE 5: 广告测试 ==========
  console.log('\n📊 PHASE 5: Ads Testing');
  console.log('================================');
  const adResults = [];
  for (const product of products.slice(0, 3)) {
    const result = await launchTestAds(product);
    adResults.push(...result);
  }
  console.log(`Launched ${adResults.length} test ads`);
  
  // ========== PHASE 6: 数据分析 ==========
  console.log('\n📈 PHASE 6: Analytics');
  console.log('================================');
  const report = await generateReport();
  const optimizations = await autoOptimize();
  
  console.log(`\n📋 Optimization Actions:`);
  optimizations.forEach(a => console.log(`   - ${a.type}: ${a.action}`));
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log(`
╔══════════════════════════════════════════╗
║   Pipeline Complete in ${duration}s           ║
╚══════════════════════════════════════════╝
  `);
  
  return {
    products: products.length,
    ads: adResults.length,
    seo: seoResults.length,
    duration
  };
}

// 如果直接运行
if (require.main === module) {
  runCompletePipeline()
    .then(r => {
      console.log('\n✅ All done!');
      process.exit(0);
    })
    .catch(e => {
      console.error('\n❌ Error:', e);
      process.exit(1);
    });
}

module.exports = { runCompletePipeline };
