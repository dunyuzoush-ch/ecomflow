/**
 * EcomFlow MVP - Daily Job
 * 每日自动化任务
 */

const { getTrends } = require("../agents/trendAgent");
const { createProduct } = require("../agents/productAgent");
const { postTweet } = require("../agents/socialManager");

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
