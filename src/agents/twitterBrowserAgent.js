/**
 * EcomFlow MVP - Browser Twitter Agent
 * 使用浏览器自动化发推文
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const TWITTER_USER = 'edwardzou7';
const TWITTER_PASS = 'Dunyu802810';

/**
 * 使用 browser-use 发推文
 */
async function postTweetViaBrowser(content) {
  const scriptPath = path.join(__dirname, '../../scripts/post_tweet.js');
  
  // 创建发推脚本
  const script = `
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 访问Twitter
    await page.goto('https://twitter.com/i/flow/login', { timeout: 30000 });
    await page.waitForTimeout(2000);
    
    // 输入用户名
    await page.fill('input[name="text"]', '${TWITTER_USER}');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(2000);
    
    // 输入密码
    await page.fill('input[name="password"]', '${TWITTER_PASS}');
    await page.click('button:has-text("Log in")');
    await page.waitForTimeout(5000);
    
    // 发推
    await page.goto('https://twitter.com/compose/tweet');
    await page.waitForTimeout(2000);
    
    await page.fill('div[contenteditable="true"]', ${JSON.stringify(content)});
    await page.waitForTimeout(1000);
    
    await page.click('button[data-testid="tweetButton"]');
    await page.waitForTimeout(3000);
    
    console.log('Tweet posted successfully!');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
`;

  return new Promise((resolve, reject) => {
    exec(`node -e "${script.replace(/"/g, '\\"')}"`, { cwd: path.join(__dirname, '../..') }, 
      (error, stdout, stderr) => {
        if (error) {
          console.error('Browser tweet error:', error.message);
          resolve(null);
        } else {
          console.log('🐦 Tweet posted via browser');
          resolve({ status: 'posted' });
        }
      }
    );
  });
}

/**
 * 生成推文内容
 */
function generateTweet(product, url) {
  const templates = [
    `🔥 New dropshipping product!\n\n${product.title}\n\n💰 $${product.price}\n\nShop now 👇\n${url}`,
    
    `🚨 Hot new product alert!\n\n${product.title}\n\n$${product.price} - Great value!\n\n${url}`,
    
    `✨ Just launched: ${product.title}\n\n$${product.price}\n\n👇 Check it out!`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * 社媒Agent：发布推广内容 (支持API和浏览器)
 */
async function postTweet(product) {
  const storeUrl = `https://${process.env.SHOPIFY_STORE}/products/${product.handle}`;
  const tweetContent = generateTweet(product, storeUrl);

  // 先尝试API
  const { postTweet: apiPostTweet } = require('./socialAgent');
  const apiResult = await apiPostTweet(product).catch(() => null);
  
  if (apiResult) {
    return apiResult;
  }
  
  // API失败则用浏览器
  console.log('   🔄 Trying browser-based posting...');
  return await postTweetViaBrowser(tweetContent);
}

module.exports = { postTweet, postTweetViaBrowser, generateTweet };
