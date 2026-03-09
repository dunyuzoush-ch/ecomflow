/**
 * EcomFlow Daily Pipeline
 * 每日自动化流水线入口
 */

const fs = require('fs');
const path = require('path');

// 服务导入
const trendService = require('./services/trend-service');
const productService = require('./services/product-service');
const contentService = require('./services/content-service');
const trafficService = require('./services/traffic-service');
const analyticsService = require('./services/analytics-service');

// ============ 配置 ============
const CONFIG = {
  dataDir: './data',
  services: {
    trend: true,
    product: true,
    content: true,
    traffic: true,
    analytics: true
  }
};

// 确保data目录存在
if (!fs.existsSync(CONFIG.dataDir)) {
  fs.mkdirSync(CONFIG.dataDir, { recursive: true });
}

// ============ Pipeline步骤 ============

/**
 * Step 1: 趋势发现 (00:00)
 */
async function runTrendDiscovery() {
  console.log('\n========== Step 1: Trend Discovery ==========');
  try {
    const trends = await trendService.discoverTrends();
    console.log(`✓ Found ${trends.length} trending products`);
    return trends;
  } catch (error) {
    console.error('✗ Trend discovery failed:', error.message);
    return [];
  }
}

/**
 * Step 2: 产品生成 (02:00)
 */
async function runProductGeneration(trends) {
  console.log('\n========== Step 2: Product Generation ==========');
  try {
    const results = await productService.dailyProductGeneration();
    console.log(`✓ Generated ${results.generated.length} products`);
    return results;
  } catch (error) {
    console.error('✗ Product generation failed:', error.message);
    return { generated: [], published: [], failed: [] };
  }
}

/**
 * Step 3: 内容生成 (08:00)
 */
async function runContentGeneration() {
  console.log('\n========== Step 3: Content Generation ==========');
  try {
    const results = await contentService.dailyContentGeneration();
    console.log(`✓ Generated ${results.articles.length} articles, ${results.tiktok.length} TikTok, ${results.tweets.length} tweets`);
    return results;
  } catch (error) {
    console.error('✗ Content generation failed:', error.message);
    return { articles: [], tiktok: [], tweets: [], pinterest: [] };
  }
}

/**
 * Step 4: 流量发布 (12:00)
 */
async function runTrafficPost() {
  console.log('\n========== Step 4: Traffic Posting ==========');
  try {
    const results = await trafficService.dailyTrafficPost();
    console.log(`✓ Posted ${results.tiktok.length} TikTok, ${results.twitter.length} Twitter, ${results.pinterest.length} Pinterest`);
    return results;
  } catch (error) {
    console.error('✗ Traffic posting failed:', error.message);
    return { tiktok: [], twitter: [], pinterest: [], ads: [] };
  }
}

/**
 * Step 5: 数据分析优化 (18:00)
 */
async function runAnalyticsOptimization() {
  console.log('\n========== Step 5: Analytics & Optimization ==========');
  try {
    const report = await analyticsService.dailyAnalyticsOptimization();
    console.log(`✓ Generated report with ${report.suggestions.length} suggestions`);
    return report;
  } catch (error) {
    console.error('✗ Analytics failed:', error.message);
    return { metrics: {}, suggestions: [] };
  }
}

// ============ 主流程 ============

/**
 * 运行完整每日流水线
 */
async function runDailyPipeline() {
  const startTime = Date.now();
  console.log('🚀 EcomFlow Daily Pipeline Starting...');
  console.log(`📅 Date: ${new Date().toISOString()}`);
  
  try {
    // Step 1: 趋势发现
    if (CONFIG.services.trend) {
      const trends = await runTrendDiscovery();
      global.trends = trends;
    }
    
    // Step 2: 产品生成
    if (CONFIG.services.product) {
      const productResults = await runProductGeneration(global.trends || []);
      global.productResults = productResults;
    }
    
    // Step 3: 内容生成
    if (CONFIG.services.content) {
      const contentResults = await runContentGeneration();
      global.contentResults = contentResults;
    }
    
    // Step 4: 流量发布
    if (CONFIG.services.traffic) {
      await runTrafficPost();
    }
    
    // Step 5: 数据分析
    if (CONFIG.services.analytics) {
      const analyticsReport = await runAnalyticsOptimization();
      global.analyticsReport = analyticsReport;
    }
    
    // 完成
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('\n========== Pipeline Complete ==========');
    console.log(`✅ Total time: ${duration}s`);
    console.log('=======================================\n');
    
    return {
      success: true,
      duration,
      results: {
        trends: global.trends?.length || 0,
        products: global.productResults?.published?.length || 0,
        articles: global.contentResults?.articles?.length || 0,
        suggestions: global.analyticsReport?.suggestions?.length || 0
      }
    };
    
  } catch (error) {
    console.error('\n✗ Pipeline Failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 运行单个服务
 */
async function runService(serviceName) {
  switch (serviceName) {
    case 'trend':
      return await runTrendDiscovery();
    case 'product':
      return await runProductGeneration(global.trends || []);
    case 'content':
      return await runContentGeneration();
    case 'traffic':
      return await runTrafficPost();
    case 'analytics':
      return await runAnalyticsOptimization();
    default:
      console.log(`Unknown service: ${serviceName}`);
  }
}

// ============ 入口 ============

const args = process.argv.slice(2);

if (args.length > 0) {
  // 运行单个服务
  const service = args[0];
  runService(serviceName).then(result => {
    console.log('Result:', result);
    process.exit(0);
  });
} else {
  // 运行完整流水线
  runDailyPipeline()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { runDailyPipeline, runService };
