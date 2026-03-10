/**
 * EcomFlow MVP - Social Agent
 * 发布社媒推广
 */

const { TwitterApi } = require("twitter-api-v2");

/**
 * 初始化Twitter客户端
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

  // 生成推文内容
  const tweetContent = generateTweet(product, storeUrl);

  try {
    const client = getTwitterClient();
    const tweet = await client.v2.tweet(tweetContent);

    console.log(`🐦 Tweet posted: ${tweet.data.id}`);
    return tweet.data;
  } catch (error) {
    console.error("❌ Twitter Error:", error.message);
    throw error;
  }
}

/**
 * 生成推文内容
 */
function generateTweet(product, url) {
  const templates = [
    `🔥 New dropshipping product just launched!\n\n${product.title}\n\n💰 Just $${product.price}\n\nCheck it out 👇\n${url}`,
    
    `🚨 Hot new product alert!\n\n${product.title}\n\nDon't miss out! 🔥\n\n${url}`,
    
    `✨ New find: ${product.title}\n\n$${product.price} - Amazing value!\n\nShop now 👇\n${url}`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

module.exports = { postTweet };
