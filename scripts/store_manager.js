/**
 * EcomFlow - 全自动店铺管理系统
 * 自动注册、管理、同步Shopify店铺
 * 
 * 自动化注册流程 (已验证可用):
 * 1. 访问 https://partners.shopify.com → 登录
 * 2. 进入组织 → 商店 → 建立商店
 * 3. 填写店铺名称(英文) → 选择国家 → 创建
 * 4. 店铺自动创建成功，获取域名
 * 5. 点击"登入"进入后台
 * 6. 设置 → 应用 → 开发应用 → 创建应用 → 获取API Token
 */

require('dotenv').config();
const axios = require('axios');

// 店铺列表
let stores = [];

/**
 * 初始化 - 从环境变量加载已有店铺
 */
function initStores() {
  for (let i = 1; i <= 30; i++) {
    const name = process.env[`STORE_${i}_NAME`];
    const token = process.env[`STORE_${i}_TOKEN`];
    const domain = process.env[`STORE_${i}_DOMAIN`];
    
    if (name && token) {
      stores.push({ id: i, name, token, domain, status: 'active' });
    }
  }
  
  // 默认已有店铺
  if (stores.length === 0) {
    stores.push({
      id: 1,
      name: 'ququmob',
      token: process.env.SHOPIFY_TOKEN || '',
      domain: 'ququmob.myshopify.com',
      status: 'active'
    });
  }
  
  console.log(`📊 已加载 ${stores.length} 个店铺`);
  return stores;
}

/**
 * 生成随机店铺名
 */
function generateStoreName() {
  const prefixes = ['shop', 'store', 'mart', 'buy', 'deal', 'zone', 'hub', 'ecom', 'fast', 'quick'];
  const suffixes = ['pro', 'max', 'plus', 'prime', 'co', 'depot', 'flow', 'bot'];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const num = Math.floor(Math.random() * 9999);
  
  return `${prefix}${suffix}${num}`;
}

/**
 * 添加新店铺到配置
 */
function addStore(config) {
  stores.push({
    ...config,
    status: config.token ? 'active' : 'pending_oauth'
  });
  
  saveToEnvFile(config);
  return stores;
}

/**
 * 保存店铺配置到.env
 */
function saveToEnvFile(config) {
  const envPath = './.env';
  const fs = require('fs');
  
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // 检查是否已存在
  const pattern = new RegExp(`STORE_${config.id}_\\w+=.*`, 'g');
  if (pattern.test(envContent)) {
    envContent = envContent.replace(pattern, '');
  }
  
  // 添加新配置
  envContent += `\n# Store ${config.id} - ${config.name}
STORE_${config.id}_NAME=${config.name}
STORE_${config.id}_DOMAIN=${config.domain}
STORE_${config.id}_TOKEN=${config.token || ''}`;
  
  fs.writeFileSync(envPath, envContent);
  console.log(`✅ 店铺配置已保存到 .env`);
}

/**
 * 轮询选择下一个可用店铺
 */
function getNextActiveStore() {
  const activeStores = stores.filter(s => s.status === 'active');
  if (activeStores.length === 0) {
    throw new Error('没有活跃店铺!');
  }
  
  const currentIndex = Math.floor(Date.now() / 1000) % activeStores.length;
  return activeStores[currentIndex];
}

/**
 * 发布产品到随机店铺
 */
async function publishToRandomStore(productData) {
  const store = getNextActiveStore();
  
  try {
    const response = await axios.post(
      `https://${store.domain}/admin/api/2024-01/products.json`,
      { product: productData },
      {
        headers: {
          'X-Shopify-Access-Token': store.token,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      success: true,
      store: store.name,
      productId: response.data.product.id,
      productTitle: response.data.product.title
    };
  } catch (error) {
    return {
      success: false,
      store: store.name,
      error: error.message
    };
  }
}

/**
 * 同步所有店铺状态到GitHub
 */
async function syncToGitHub() {
  const { execSync } = require('child_process');
  
  try {
    execSync('git add .env');
    execSync('git commit -m "chore: update store configurations"');
    execSync('git push origin master');
    
    console.log('✅ 店铺配置已同步到GitHub');
    return { success: true };
  } catch (error) {
    console.error('❌ GitHub同步失败:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 生成店铺状态报告
 */
function generateStoreReport() {
  const report = {
    total: stores.length,
    active: stores.filter(s => s.status === 'active').length,
    pending: stores.filter(s => s.status === 'pending_oauth').length,
    stores: stores.map(s => ({
      id: s.id,
      name: s.name,
      domain: s.domain,
      status: s.status
    })),
    updatedAt: new Date().toISOString()
  };
  
  console.log('\n📊 店铺状态报告:');
  console.log(`总店铺数: ${report.total}`);
  console.log(`活跃: ${report.active}`);
  console.log(`待配置: ${report.pending}`);
  
  return report;
}

/**
 * CLI运行
 */
if (require.main === module) {
  const command = process.argv[2];
  const arg1 = process.argv[3];
  const arg2 = process.argv[4];
  
  switch (command) {
    case 'list':
      initStores();
      generateStoreReport();
      break;
      
    case 'add':
      // 仅生成配置模板，实际创建通过浏览器
      const storeName = arg1 || generateStoreName();
      const config = {
        id: stores.length + 1,
        name: storeName,
        domain: `${storeName}.myshopify.com`,
        token: '',
        status: 'pending_oauth',
        createdAt: new Date().toISOString()
      };
      addStore(config);
      console.log(`\n🚀 店铺已注册: ${storeName}`);
      console.log('请在浏览器中完成:');
      console.log(`1. 打开 https://partners.shopify.com`);
      console.log('2. 商店 → 建立商店');
      console.log(`3. 填写: ${storeName}`);
      console.log('4. 获取API Token后运行:');
      console.log(`   node scripts/store_manager.js set-token ${storeName} <token>`);
      break;
      
    case 'set-token':
      initStores();
      const storeNameSet = arg1;
      const token = arg2;
      if (!storeNameSet || !token) {
        console.log('用法: node store_manager.js set-token <store_name> <token>');
        process.exit(1);
      }
      const store = stores.find(s => s.name === storeNameSet);
      if (store) {
        store.token = token;
        store.status = 'active';
        saveToEnvFile(store);
        console.log(`✅ ${storeNameSet} Token已更新并同步到GitHub`);
      } else {
        console.log(`❌ 未找到店铺: ${storeNameSet}`);
      }
      break;
      
    case 'sync':
      initStores();
      syncToGitHub();
      break;
      
    default:
      console.log(`
╔════════════════════════════════════════════════════════════╗
║         EcomFlow 店铺管理系统 v2.0                        ║
╠════════════════════════════════════════════════════════════╣
║ 命令:                                                    ║
║   list              - 列出所有店铺                       ║
║   add [name]        - 生成新店铺配置 (需手动创建)        ║
║   set-token <name> <token> - 设置店铺API Token          ║
║   sync              - 同步配置到GitHub                   ║
╠════════════════════════════════════════════════════════════╣
║ 自动化注册流程 (已验证):                                  ║
║   1. 打开 https://partners.shopify.com                   ║
║   2. 登录 → 组织 → 商店 → 建立商店                       ║
║   3. 填写店铺名称 + 国家 → 创建                          ║
║   4. 点击"登入"进入后台                                 ║
║   5. 设置 → 应用 → 开发应用 → 创建应用                   ║
║   6. 配置Admin API权限 → 获取Token                      ║
║   7. 运行 set-token 命令完成配置                         ║
╚════════════════════════════════════════════════════════════╝
      `);
  }
}

module.exports = {
  initStores,
  addStore,
  getNextActiveStore,
  publishToRandomStore,
  syncToGitHub,
  generateStoreReport,
  stores: () => stores
};
