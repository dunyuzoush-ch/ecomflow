/**
 * Meta Ads Token 自动刷新工具
 * 使用方法: node scripts/refresh_meta_token.js
 * 需要在浏览器中手动授权一次，然后保存token
 */

const fs = require('fs');
const path = require('path');

const TOKEN_FILE = path.join(__dirname, '../.meta_token');

/**
 * 保存Token
 */
function saveToken(token) {
  fs.writeFileSync(TOKEN_FILE, token);
  console.log('✅ Token saved to', TOKEN_FILE);
}

/**
 * 读取Token
 */
function loadToken() {
  if (fs.existsSync(TOKEN_FILE)) {
    return fs.readFileSync(TOKEN_FILE, 'utf8').trim();
  }
  return null;
}

/**
 * 验证Token是否有效
 */
async function validateToken(token) {
  const axios = require('axios');
  try {
    const response = await axios.get(
      'https://graph.facebook.com/v18.0/me',
      { params: { access_token: token } }
    );
    return response.data.id ? true : false;
  } catch (error) {
    return false;
  }
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args[0] === 'save') {
    // 保存新token
    const newToken = args[1];
    if (!newToken) {
      console.error('❌ 请提供token: node refresh_meta_token.js save <token>');
      process.exit(1);
    }
    saveToken(newToken);
    console.log('✅ Token saved!');
    process.exit(0);
  }
  
  if (args[0] === 'validate') {
    // 验证token
    const token = loadToken();
    if (!token) {
      console.log('❌ No token found');
      process.exit(1);
    }
    const isValid = await validateToken(token);
    console.log(isValid ? '✅ Token valid' : '❌ Token invalid');
    process.exit(isValid ? 0 : 1);
  }
  
  // 默认：显示当前token状态
  const token = loadToken();
  if (token) {
    console.log('📋 Current token:', token.substring(0, 20) + '...');
    const isValid = await validateToken(token);
    console.log(isValid ? '✅ Token valid' : '❌ Token invalid - please refresh');
  } else {
    console.log('❌ No token found');
    console.log('\n📝 To set token:');
    console.log('   1. Go to https://developers.facebook.com/tools/explorer/');
    console.log('   2. Login and click "Get Token" → "Get User Access Token"');
    console.log('   3. Select ads_management, ads_read permissions');
    console.log('   4. Copy the token and run: node scripts/refresh_meta_token.js save <token>');
  }
}

main().catch(console.error);
