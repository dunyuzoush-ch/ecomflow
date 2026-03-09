/**
 * EcomFlow Analytics Service
 * 数据分析优化服务 - 自动分析 + AI优化
 * 
 * 功能:
 * - 数据收集 (Shopify, GA, 社媒)
 * - 转化分析
 * - AI自动优化建议
 * - 增长报告
 */

const axios = require('axios');
const fs = require('fs');

// ============ 配置 ============
const CONFIG = {
  shopify: {
    shop: process.env.SHOPIFY_SHOP,
    token: process.env.SHOPIFY_TOKEN,
    apiVersion: '2024-01'
  },
  google: {
    analyticsId: process.env.GA_MEASUREMENT_ID,
    apiSecret: process.env.GA_API_SECRET
  }
};

// ============ 数据收集 ============

/**
 * 获取Shopify订单数据
 */
async function getShopifyOrders(days = 7) {
  const { shop, token, apiVersion } = CONFIG.shopify;
  const since = new Date();
  since.setDate(since.getDate() - days);
  
  try {
    const url = `https://${shop}/admin/api/${apiVersion}/orders.json?created_at_min=${since.toISOString()}&status=any`;
    
    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': token
      }
    });
    
    return response.data.orders.map(order => ({
      id: order.id,
      total_price: parseFloat(order.total_price),
      currency: order.currency,
      created_at: order.created_at,
      line_items: order.line_items.length,
      customer: order.customer ? {
        email: order.customer.email,
        orders_count: order.customer.orders_count
      } : null
    }));
  } catch (error) {
    console.error('[Analytics] Shopify orders error:', error.message);
    return [];
  }
}

/**
 * 获取Shopify产品分析
 */
async function getProductAnalytics() {
  const { shop, token, apiVersion } = CONFIG.shopify;
  
  try {
    const url = `https://${shop}/admin/api/${apiVersion}/products.json?limit=50`;
    
    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': token
      }
    });
    
    return response.data.products.map(product => ({
      id: product.id,
      title: product.title,
      status: product.status,
      total_inventory: product.variants.reduce((sum, v) => sum + (v.inventory_quantity || 0), 0),
      price: product.variants[0]?.price || 0,
      created_at: product.created_at
    }));
  } catch (error) {
    console.error('[Analytics] Product analytics error:', error.message);
    return [];
  }
}

// ============ 指标计算 ============

/**
 * 计算关键指标
 */
function calculateMetrics(orders, products) {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total_price, 0);
  const totalOrders = orders.length;
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // 产品表现
  const productPerformance = {};
  orders.forEach(order => {
    order.line_items.forEach(item => {
      if (!productPerformance[item.product_id]) {
        productPerformance[item.product_id] = {
          name: item.title,
          quantity: 0,
          revenue: 0
        };
      }
      productPerformance[item.product_id].quantity += item.quantity;
      productPerformance[item.product_id].revenue += parseFloat(item.price) * item.quantity;
    });
  });
  
  // 排序
  const topProducts = Object.entries(productPerformance)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 10)
    .map(([id, data]) => ({ product_id: id, ...data }));
  
  return {
    summary: {
      totalRevenue,
      totalOrders,
      aov: Math.round(aov * 100) / 100,
      avgOrderValue: Math.round(aov * 100) / 100
    },
    topProducts,
    period: '7 days'
  };
}

/**
 * 计算转化率 (模拟)
 */
function calculateConversionRate(visitors, orders) {
  return {
    conversion: visitors > 0 ? (orders / visitors * 100).toFixed(2) : 0,
    visitors,
    orders
  };
}

// ============ AI优化建议 ============

/**
 * 生成AI优化建议
 */
async function generateOptimizationSuggestions(metrics) {
  const suggestions = [];
  
  // 1. 低转化率优化
  if (metrics.conversion < 1.5) {
    suggestions.push({
      type: 'conversion',
      priority: 'high',
      action: 'replace_product_images',
      reason: `Conversion rate (${metrics.conversion}%) is below 1.5%`,
      suggestion: 'Try A/B testing with lifestyle images instead of studio shots'
    });
  }
  
  // 2. 低点击率优化
  if (metrics.ctr < 2) {
    suggestions.push({
      type: 'ctr',
      priority: 'high',
      action: 'rewrite_headline',
      reason: `CTR is below 2%`,
      suggestion: 'Rewrite product titles to include emotional triggers'
    });
  }
  
  // 3. 低AOV优化
  if (metrics.aov < 35) {
    suggestions.push({
      type: 'aov',
      priority: 'medium',
      action: 'add_upsell',
      reason: `AOV ($${metrics.aov}) is below target`,
      suggestion: 'Add product bundles or cross-sell recommendations'
    });
  }
  
  // 4. 库存警告
  const lowStockProducts = metrics.products?.filter(p => p.total_inventory < 10) || [];
  if (lowStockProducts.length > 0) {
    suggestions.push({
      type: 'inventory',
      priority: 'medium',
      action: 'restock',
      products: lowStockProducts.map(p => p.title),
      suggestion: 'Consider restocking these low inventory products'
    });
  }
  
  // 5. 趋势产品优化
  const topPerformers = metrics.topProducts?.slice(0, 3) || [];
  if (topPerformers.length > 0) {
    suggestions.push({
      type: 'growth',
      priority: 'high',
      action: 'scale_winners',
      products: topPerformers.map(p => p.name),
      suggestion: 'Increase ad budget for top performing products'
    });
  }
  
  return suggestions;
}

// ============ 自动优化执行 ============

/**
 * 执行优化
 */
async function executeOptimizations(suggestions) {
  const results = [];
  
  for (const suggestion of suggestions) {
    try {
      switch (suggestion.action) {
        case 'replace_product_images':
          console.log(`[Optimize] Would replace images for: ${suggestion.reason}`);
          results.push({ action: 'replace_images', status: 'simulated' });
          break;
          
        case 'rewrite_headline':
          console.log(`[Optimize] Would rewrite headlines`);
          results.push({ action: 'rewrite_titles', status: 'simulated' });
          break;
          
        case 'add_upsell':
          console.log(`[Optimize] Would add upsell bundles`);
          results.push({ action: 'add_upsell', status: 'simulated' });
          break;
          
        case 'scale_winners':
          console.log(`[Optimize] Scaling ads for: ${suggestion.products?.join(', ')}`);
          results.push({ action: 'scale_ads', status: 'simulated' });
          break;
          
        default:
          console.log(`[Optimize] Unknown action: ${suggestion.action}`);
      }
    } catch (e) {
      console.error(`[Optimize] Error:`, e.message);
    }
  }
  
  return results;
}

// ============ 报告生成 ============

/**
 * 生成每日报告
 */
async function generateDailyReport(metrics, suggestions) {
  const report = {
    date: new Date().toISOString().split('T')[0],
    metrics,
    suggestions,
    generated_at: new Date().toISOString()
  };
  
  // 保存报告
  fs.writeFileSync(
    `./data/daily_report_${report.date}.json`,
    JSON.stringify(report, null, 2)
  );
  
  return report;
}

// ============ 主函数 ============

/**
 * 每日分析优化流程
 */
async function dailyAnalyticsOptimization() {
  console.log('[Analytics] Starting daily analytics...');
  
  // 1. 收集数据
  const [orders, products] = await Promise.all([
    getShopifyOrders(7),
    getProductAnalytics()
  ]);
  
  // 2. 计算指标
  const metrics = calculateMetrics(orders, products);
  
  // 模拟流量数据
  const visitors = Math.floor(orders.length / 0.02);
  metrics.conversionData = calculateConversionRate(visitors, orders.length);
  metrics.ctr = (Math.random() * 3 + 1).toFixed(2);
  
  console.log(`[Analytics] Revenue: $${metrics.summary.totalRevenue}, Orders: ${metrics.summary.totalOrders}, AOV: $${metrics.summary.aov}`);
  
  // 3. 生成优化建议
  const suggestions = await generateOptimizationSuggestions(metrics);
  
  // 4. 生成报告
  const report = await generateDailyReport(metrics, suggestions);
  
  console.log(`[Analytics] Generated ${suggestions.length} optimization suggestions`);
  
  return report;
}

// ============ 导出 ============

module.exports = {
  getShopifyOrders,
  getProductAnalytics,
  calculateMetrics,
  calculateConversionRate,
  generateOptimizationSuggestions,
  executeOptimizations,
  generateDailyReport,
  dailyAnalyticsOptimization
};

// 如果直接运行
if (require.main === module) {
  dailyAnalyticsOptimization()
    .then(report => console.log('Done:', report))
    .catch(err => console.error(err));
}
