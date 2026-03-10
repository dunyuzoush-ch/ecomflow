/**
 * Shopify Token 自动获取脚本
 * 
 * 使用方法:
 * 1. 在店铺后台创建应用，获取 client_id 和 client_secret
 * 2. 运行: node scripts/get_shopify_token.js <store_domain> <client_id> <client_secret>
 * 
 * 示例:
 * node scripts/get_shopify_token.js ecomflow2.myshopify.com <client_id> <client_secret>
 */

const axios = require('axios');

async function getAccessToken(storeDomain, clientId, clientSecret) {
  try {
    const response = await axios.post(
      `https://${storeDomain}/admin/oauth/access_token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    return {
      success: true,
      access_token: response.data.access_token,
      scope: response.data.scope
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: error.response?.data
    };
  }
}

// CLI运行
if (require.main === module) {
  const storeDomain = process.argv[2];
  const clientId = process.argv[3];
  const clientSecret = process.argv[4];
  
  if (!storeDomain || !clientId || !clientSecret) {
    console.log(`
用法: node scripts/get_shopify_token.js <store_domain> <client_id> <client_secret>

示例:
node scripts/get_shopify_token.js ecomflow2.myshopify.com abc123def456 ghi789jkl012

获取token后:
node scripts/store_manager.js set-token ecomflow2 <access_token>
    `);
    process.exit(1);
  }
  
  console.log(`正在获取 ${storeDomain} 的Access Token...`);
  
  getAccessToken(storeDomain, clientId, clientSecret)
    .then(result => {
      if (result.success) {
        console.log('\n✅ 成功获取Access Token!');
        console.log(`Access Token: ${result.access_token}`);
        console.log(`Scope: ${result.scope}`);
        console.log(`\n配置命令:`);
        console.log(`node scripts/store_manager.js set-token ${storeDomain.replace('.myshopify.com', '')} ${result.access_token}`);
      } else {
        console.log('\n❌ 获取失败:', result.error);
        if (result.details) {
          console.log('详情:', result.details);
        }
      }
    });
}

module.exports = { getAccessToken };
