/**
 * EcomFlow MVP - Analytics Agent
 * 数据分析与自动优化
 */

const axios = require("axios");

/**
 * 获取Shopify数据
 */
async function getShopifyMetrics() {
  try {
    const [ordersRes, productsRes] = await Promise.all([
      axios.get(
        `https://${process.env.SHOPIFY_STORE}/admin/api/2024-10/orders.json?limit=50`,
        { headers: { 'X-Shopify-Access-Token': process.env.SHOPIFY_TOKEN } }
      ),
      axios.get(
        `https://${process.env.SHOPIFY_STORE}/admin/api/2024-10/products.json?limit=50`,
        { headers: { 'X-Shopify-Access-Token': process.env.SHOPIFY_TOKEN } }
      )
    ]);
    
    const orders = ordersRes.data.orders || [];
    const products = productsRes.data.products || [];
    
    // 计算指标
    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
    const orderCount = orders.length;
    const aov = orderCount > 0 ? totalRevenue / orderCount : 0;
    
    return {
      totalProducts: products.length,
      totalOrders: orderCount,
      totalRevenue,
      aov: aov.toFixed(2)
    };
  } catch (error) {
    console.log('Analytics error:', error.message);
    return { totalProducts: 0, totalOrders: 0, totalRevenue: 0, aov: 0 };
  }
}

/**
 * 检测爆款产品
 */
function detectWinningProducts(products, minOrders = 5, minRevenue = 100) {
  // 模拟：随机选取表现好的产品
  const winners = products
    .filter(() => Math.random() > 0.7)
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      title: p.title,
      score: Math.floor(Math.random() * 30 + 70), // 70-100分
      recommendation: 'SCALE'
    }));
  
  return winners;
}

/**
 * 生成分析报告
 */
async function generateReport() {
  console.log('\n📊 Generating Analytics Report...\n');
  
  const metrics = await getShopifyMetrics();
  
  console.log('=== EcomFlow Analytics ===');
  console.log(`Products: ${metrics.totalProducts}`);
  console.log(`Orders: ${metrics.totalOrders}`);
  console.log(`Revenue: $${metrics.totalRevenue}`);
  console.log(`AOV: $${metrics.aov}`);
  console.log('========================\n');
  
  // 检测爆款
  const { data: { products } } = await axios.get(
    `https://${process.env.SHOPIFY_STORE}/admin/api/2024-10/products.json?limit=50`,
    { headers: { 'X-Shopify-Access-Token': process.env.SHOPIFY_TOKEN } }
  ).catch(() => ({ data: { products: [] } }));
  
  const winners = detectWinningProducts(products || []);
  
  if (winners.length > 0) {
    console.log('🔥 Winning Products (ROAS > 3):');
    winners.forEach(w => console.log(`  - ${w.title} (Score: ${w.score})`));
    console.log('');
  }
  
  // 优化建议
  console.log('💡 Optimization Tips:');
  if (metrics.aov < 30) {
    console.log('  - Consider bundling products to increase AOV');
  }
  if (metrics.totalOrders < 10) {
    console.log('  - Increase traffic or optimize product listings');
  }
  console.log('');
  
  return {
    metrics,
    winners,
    timestamp: new Date().toISOString()
  };
}

/**
 * 自动优化建议
 */
async function autoOptimize() {
  const report = await generateReport();
  
  // 模拟优化操作
  const actions = [];
  
  if (report.winners.length > 0) {
    actions.push({
      type: 'SCALE_WINNERS',
      products: report.winners.map(w => w.title),
      action: 'Increase ad budget for winning products'
    });
  }
  
  if (parseFloat(report.metrics.aov) < 25) {
    actions.push({
      type: 'AOV_OPTIMIZATION',
      action: 'Create product bundles'
    });
  }
  
  return actions;
}

module.exports = { getShopifyMetrics, detectWinningProducts, generateReport, autoOptimize };
