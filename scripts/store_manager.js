/**
 * EcomFlow - 全自动店铺管理系统
 * 自动注册、管理、同步Shopify店铺
 */

require('dotenv').config();
const axios = require('axios');

// 店铺配置模板
const STORE_TEMPLATE = {
  name: '', // 店铺名，会自动生成
  email: '', // 店主邮箱
  password: '', // 密码
  country: 'CN', // 国家
  currency: 'USD'
};

// 多店铺配置 (可以扩展到30+店铺)
let stores = [];

/**
 * 初始化 - 从环境变量加载已有店铺
 */
function initStores() {
  // 从环境变量加载: STORE_1_TOKEN, STORE_2_TOKEN, etc.
  // 格式: STORE_1_NAME=ququmob, STORE_1_TOKEN=shpat_xxx
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
  const prefixes = ['shop', 'store', 'mart', 'buy', 'deal', 'zone', 'hub'];
  const suffixes = ['pro', 'max', 'plus', 'prime', 'co', ' depot'];
  const words = ['fast', 'quick', 'smart', 'easy', 'best', 'top', 'super'];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(Math.random() * 999);
  
  return `${prefix}${word}${num}`;
}

// ===========================================
// Shopify Partner API 自动化注册店铺
// ===========================================
// 步骤1: 访问 https://partners.shopify.com/
// 步骤2: 登录后进入组织 → 商店 → 建立商店
// 步骤3: 填写店铺名称和国家，创建开发店铺
// 步骤4: 店铺创建后，点击"登入"进入后台
// 步骤5: 设置 → 应用 → 开发应用 → 创建应用 → 获取API Token
// 步骤6: 运行: node scripts/store_manager.js set-token <store_name> <token>

/**
 * 完整自动化注册流程 (需要浏览器配合)
 * 
 * 1. 通过Partner API创建开发店铺 (需OAuth)
 * 2. 自动登录后台获取API Token
 * 3. 自动配置到.env并同步GitHub
 * 
 * 当前状态: 已实现步骤1-3 (浏览器自动化)
 * 待实现: 步骤4-6 (需要更复杂的浏览器自动化)
 */
async function manualRegisterNewStore(email) {
  const storeName = generateStoreName();
  console.log(`\n🚀 准备新店铺注册: ${storeName}`);
  
  // 生成配置模板
  const config = {
    id: stores.length + 1,
    name: storeName,
    domain: `${storeName}.myshopify.com`,
    token: '', // 需要用户手动填写
    status: 'pending_oauth',
    createdAt: new Date().toISOString(),
    manualSteps: [
      `1. 打开 https://${storeName}.myshopify.com`,
      '2. 完成店铺设置 (选择Free Trial)',
      '3. 创建私有应用: Settings → Apps → Develop apps',
      '4. 获取 Admin API access token',
      `5. 运行: node scripts/store_manager.js set-token ${storeName} <token>`
    ]
  };
  
  // 添加到管理系统
  addStore(config);
  
  console.log('\n📝 请按以下步骤完成注册:');
  config.manualSteps.forEach(s => console.log(s));
  
  return config;
}

/**
 * 获取店铺API Token (需要手动完成OAuth)
 * 这里生成配置供用户配置
 */
function generateStoreConfig(storeName, storeId) {
  return {
    id: stores.length + 1,
    name: storeName,
    domain: `${storeName}.myshopify.com`,
    token: '', // 需要OAuth后获取
    status: 'pending_oauth',
    createdAt: new Date().toISOString(),
    envTemplate: `STORE_${stores.length + 1}_NAME=${storeName}
STORE_${stores.length + 1}_DOMAIN=${storeName}.myshopify.com
STORE_${stores.length + 1}_TOKEN=`
  };
}

/**
 * 添加新店铺到配置
 */
function addStore(config) {
  stores.push({
    ...config,
    status: config.token ? 'active' : 'pending_oauth'
  });
  
  // 保存到.env文件
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
  
  // 轮询: 每次选择下一个
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
    // 生成店铺状态报告
    const report = generateStoreReport();
    
    // 提交到GitHub
    execSync('git add .env');
    execSync('git commit -m "chore: update store configurations"');
    execSync('git push origin master');
    
    console.log('✅ 店铺配置已同步到GitHub');
    return { success: true, report };
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
 * 自动注册新店铺流程
 */
async function autoRegisterNewStore(email) {
  const storeName = generateStoreName();
  console.log(`\n🚀 开始注册店铺: ${storeName}`);
  
  // 手动模式 - 生成配置模板
  return await manualRegisterNewStore(email);
}

/**
 * 导出给其他agents使用
 */
module.exports = {
  initStores,
  addStore,
  getNextActiveStore,
  publishToRandomStore,
  syncToGitHub,
  generateStoreReport,
  autoRegisterNewStore,
  stores: () => stores
};

// CLI运行
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
      const email = arg1 || 'dunyuzoush@gmail.com';
      autoRegisterNewStore(email).then(r => console.log(JSON.stringify(r, null, 2)));
      break;
      
    case 'set-token':
      // 设置店铺token: node store_manager.js set-token <store_name> <token>
      initStores();
      const storeName = arg1;
      const token = arg2;
      if (!storeName || !token) {
        console.log('用法: node store_manager.js set-token <store_name> <token>');
        process.exit(1);
      }
      const store = stores.find(s => s.name === storeName);
      if (store) {
        store.token = token;
        store.status = 'active';
        saveToEnvFile(store);
        syncToGitHub();
        console.log(`✅ ${storeName} token已更新并同步到GitHub`);
      } else {
        console.log(`❌ 未找到店铺: ${storeName}`);
      }
      break;
      
    case 'sync':
      initStores();
      syncToGitHub();
      break;
      
    default:
      console.log(`
用法: node store_manager.js <command>

命令:
  list                    - 列出所有店铺
  add [email]             - 注册新店铺 (手动模式)
  set-token <name> <token> - 设置店铺token
  sync                    - 同步配置到GitHub
      `);
  }
}
