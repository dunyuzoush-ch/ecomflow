/**
 * EcomFlow MVP - Social Media Manager
 * 生成社媒内容并保存 (API或浏览器发不了时使用)
 */

const fs = require('fs');
const path = require('path');

// 生成推文内容 (不重复声明)
function makeTweet(product, url) {
  const templates = [
    `🔥 New dropshipping product!\n\n${product.title}\n\n💰 $${product.price}\n\nShop now 👇\n${url}`,
    
    `🚨 Hot new product alert!\n\n${product.title}\n\n$${product.price} - Great value!\n\n${url}`,
    
    `✨ Just launched: ${product.title}\n\n$${product.price}\n\n👇 Check it out!`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

// 保存推文到队列
async function queueTweet(product) {
  const storeUrl = `https://${process.env.SHOPIFY_STORE}/products/${product.handle}`;
  const content = makeTweet(product, storeUrl);
  
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const queueFile = path.join(dataDir, 'tweet_queue.json');
  
  let queue = [];
  try {
    queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
  } catch (e) {}
  
  queue.push({
    product: product.title,
    content,
    created: new Date().toISOString(),
    status: 'pending'
  });
  
  fs.writeFileSync(queueFile, JSON.stringify(queue, null, 2));
  console.log(`   📝 Tweet queued: ${product.title}`);
  
  return { queued: true };
}

// 发推主函数 (带fallback)
async function postTweet(product) {
  const { postTweet: apiPost } = require('./socialAgent');
  
  try {
    // 尝试API
    const result = await apiPost(product);
    if (result) return result;
  } catch (e) {
    console.log('   ⚠️ API failed, queuing...');
  }
  
  // Fallback: 队列
  return await queueTweet(product);
}

module.exports = { postTweet, makeTweet, queueTweet };
