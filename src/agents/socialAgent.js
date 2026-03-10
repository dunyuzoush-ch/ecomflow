/**
 * EcomFlow MVP - Social Agent
 * 发布社媒推广 - 使用 twitter-api-v2
 */

const { TwitterApi } = require("twitter-api-v2");

/**
 * 初始化Twitter客户端 - OAuth 1.0a User Context
 */
const getTwitterClient = () => {
  return new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET
  });
};

/**
 * 社媒Agent：发布推广内容
 */
async function postTweet(product) {
  const storeUrl = `https://${process.env.SHOPIFY_STORE}/products/${product.handle}`;
  const tweetContent = generateTweet(product, storeUrl);

  try {
    const client = getTwitterClient();
    
    // 使用v1.1 API (更兼容)
    const tweet = await client.v1.uploadMedia() // 先不传图片
      .then(() => client.v1.post('statuses/update', { status: tweetContent }))
      .catch(async () => {
        // 如果v1失败，尝试v2
        return await client.v2.tweet(tweetContent);
      });

    console.log(`🐦 Tweet posted: ${tweet.id || tweet.data?.id}`);
    return tweet;
  } catch (error) {
    console.error('   ❌ Twitter Error:', error.message);
    if (error.code === 403) {
      console.log('   ⚠️ Twitter API权限不足，可能是App没有Write权限');
    }
    return null;
  }
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
 * 批量发推
 */
async function postMultipleTweets(products) {
  const results = [];
  for (const product of products) {
    const result = await postTweet(product);
    results.push(result);
    // 避免API限流
    await new Promise(r => setTimeout(r, 2000));
  }
  return results;
}

module.exports = { postTweet, postMultipleTweets };
