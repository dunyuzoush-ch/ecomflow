/**
 * EcomFlow Content Service
 * 内容工厂 - SEO文章 + 社媒内容自动生成
 * 
 * 功能:
 * - SEO文章生成 (WordPress)
 * - TikTok视频脚本
 * - Twitter推文
 * - Pinterest图片
 */

const axios = require('axios');
const fs = require('fs');

// ============ 配置 ============
const CONFIG = {
  wordpress: {
    url: process.env.WP_URL || 'https://yoursite.com',
    user: process.env.WP_USER || 'admin',
    password: process.env.WP_PASS || 'app_password'
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-5-mini'
  },
  content: {
    minArticlesPerDay: 10,
    minSocialPostsPerDay: 30
  }
};

// ============ 关键词研究 ============

/**
 * 关键词发现
 */
async function discoverKeywords(niche) {
  const keywords = [
    `${niche} for beginners`,
    `best ${niche} 2026`,
    `${niche} review`,
    `top ${niche}`,
    `how to choose ${niche}`,
    `${niche} buying guide`,
    `${niche} comparison`,
    `cheap ${niche}`,
    `premium ${niche}`,
    `${niche} deals`
  ];
  
  // 可以调用Google Keyword Planner或Tavily获取真实搜索量
  return keywords.map(kw => ({
    keyword: kw,
    volume: Math.floor(Math.random() * 50000) + 1000, // 模拟数据
    difficulty: Math.floor(Math.random() * 100)
  }));
}

// ============ SEO文章生成 ============

/**
 * AI生成SEO文章
 */
async function generateSEOArticle(keyword, products = []) {
  const prompt = `
生成一篇SEO友好的购买指南文章:

关键词: ${keyword}

要求:
1. 2000-3000词
2. 包含SEO关键词
3. 购买指南结构:
   - 介绍
   - 产品推荐 (包含具体产品)
   - 购买要点
   - 常见问题
   - 结论
4. 包含购买链接 (格式: [Product Name](shopify-link))
5. 吸引人的标题和Meta描述

请生成完整的HTML格式文章。
  `;
  
  // 简化版: 本地生成
  const article = {
    title: generateTitle(keyword),
    content: generateContent(keyword, products),
    metaDescription: `Find the best ${keyword}. Our comprehensive guide covers top products, buying tips, and expert recommendations.`,
    keyword: keyword,
    tags: [keyword, 'buying guide', 'review'],
    categories: ['Shopping', 'Reviews']
  };
  
  return article;
}

/**
 * 生成标题
 */
function generateTitle(keyword) {
  const templates = [
    `The Ultimate ${capitalize(keyword)} Buying Guide for 2026`,
    `Best ${capitalize(keyword)} - Top 10 Products Reviewed`,
    `${capitalize(keyword)}: Complete Guide & Recommendations`,
    `How to Choose the Best ${capitalize(keyword)} in 2026`,
    `${capitalize(keyword)} - Expert Reviews & Comparisons`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * 生成文章内容
 */
function generateContent(keyword, products = []) {
  const productList = products.length > 0 
    ? products.map(p => `<li><a href="${p.link}">${p.name}</a> - $${p.price}</li>`).join('\n')
    : '<li>Product 1 - $29.99</li><li>Product 2 - $39.99</li><li>Product 3 - $49.99</li>';
  
  return `
<h2>Introduction</h2>
<p>Welcome to our comprehensive ${keyword} buying guide. Whether you're a beginner or a seasoned expert, finding the right product can be challenging. This guide will help you make an informed decision.</p>

<h2>Why This ${capitalize(keyword)} Matters</h2>
<p>Choosing the right ${keyword} can significantly impact your experience. We've researched dozens of products to bring you the most reliable options.</p>

<h2>Top Recommended Products</h2>
<ul>
${productList}
</ul>

<h2>Key Factors to Consider</h2>
<ul>
<li><strong>Quality:</strong> Look for durable materials and excellent craftsmanship</li>
<li><strong>Price:</strong> Balance between cost and features</li>
<li><strong>Reviews:</strong> Check customer feedback and ratings</li>
<li><strong>Warranty:</strong> Prefer products with reliable warranty</li>
</ul>

<h2>How We Test</h2>
<p>Our evaluation process includes: product testing, customer review analysis, and price comparison. We update our recommendations monthly.</p>

<h2>Frequently Asked Questions</h2>

<h3>Q: What's the best ${keyword}?</h3>
<p>A: Based on our testing, the top picks vary by budget and needs. Check our product list above for details.</p>

<h3>Q: How long do these products last?</h3>
<p>A: Quality products typically last 2-5 years with proper care.</p>

<h3>Q: Are they worth the price?</h3>
<p>A: Our recommended products offer the best value for money in their category.</p>

<h2>Conclusion</h2>
<p>We hope this ${keyword} buying guide helps you find the perfect product. Remember to consider your specific needs and budget when making a decision.</p>

<p><strong>Ready to shop? Browse our recommended ${keyword} above!</strong></p>

<div style="background: #f5f5f5; padding: 15px; margin-top: 20px;">
<p><em>Disclaimer: This post contains affiliate links. We may earn a commission at no extra cost to you.</em></p>
</div>
  `;
}

function capitalize(str) {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}

// ============ WordPress发布 ============

/**
 * 发布文章到WordPress
 */
async function publishToWordPress(article) {
  const { url, user, password } = CONFIG.wordpress;
  
  try {
    const response = await axios.post(
      `${url}/wp-json/wp/v2/posts`,
      {
        title: article.title,
        content: article.content,
        status: 'publish',
        meta: {
          description: article.metaDescription
        },
        tags: article.tags,
        categories: article.categories
      },
      {
        auth: {
          username: user,
          password: password
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`[WordPress] Published: ${article.title}`);
    return {
      id: response.data.id,
      url: response.data.link,
      title: article.title
    };
  } catch (error) {
    console.error('[WordPress] Error:', error.message);
    throw error;
  }
}

// ============ 社媒内容生成 ============

/**
 * 生成TikTok视频脚本
 */
async function generateTikTokScript(product) {
  const hooks = [
    `This $${product.price} product is blowing up on TikTok!`,
    `Stop scrolling! This ${product.name} changed everything`,
    `Why is everyone talking about this ${product.name}?`,
    `This $${product.price} hack is insane!`,
    `I can't believe this ${product.name} exists!`
  ];
  
  const scripts = [
    `🎬 HOOK: ${hooks[Math.floor(Math.random() * hooks.length)]}\n\nWhy it's special:\n- ${product.features?.[0] || 'High quality'}\n- ${product.features?.[1] || 'Trending'}\n- ${product.features?.[2] || 'Great value'}\n\n👇 Get yours link in bio!`,
    
    `POV: You discovered this before everyone else 😎\n\n${product.name}\n- ${product.price}\n- ⭐⭐⭐⭐⭐\n- Ships worldwide!\n\n#fyp #viral #shopping #${product.category || 'trending'}`
  ];
  
  return scripts[Math.floor(Math.random() * scripts.length)];
}

/**
 * 生成Twitter推文
 */
async function generateTweet(product) {
  const tweets = [
    `Just found this ${product.name} for $${product.price} 🔥\n\nAnyone tried it?\n\n#Shopping #Deals #Finds`,
    
    `The ${product.name} is trending! 💰\n\n$${product.price} - Not bad for the quality\n\nAnyone else jumping on this?`,
    
    `This $${product.price} ${product.name} might be the best find of the year 🎯\n\nLink in bio to check it out!\n\n#MustHave #Shopping`,
    
    `Stop overpaying! This ${product.name} delivers way more value than the price tag ($${product.price}) 👀\n\n#Budget #Shopping #Deals`
  ];
  
  return tweets[Math.floor(Math.random() * tweets.length)];
}

/**
 * 生成Pinterest图描述
 */
async function generatePinterestDescription(product) {
  return {
    title: `${product.name} - Must Have ${new Date().getFullYear()}`,
    description: `Discover the best ${product.name}! ⭐ ${product.price} - High quality, trending now. #${product.category || 'shopping'} #${product.niche || 'products'}`,
    keywords: [product.name, product.category, 'trending', 'best', '2026']
  };
}

// ============ 批量生成 ============

/**
 * 每日内容生成主函数
 */
async function dailyContentGeneration() {
  console.log('[Content] Starting daily content generation...');
  
  const results = {
    articles: [],
    tiktok: [],
    tweets: [],
    pinterest: []
  };
  
  // 1. 读取今日产品和趋势
  let niches = ['pets', 'fitness', 'kitchen', 'gaming'];
  let products = [];
  
  try {
    const data = fs.readFileSync('./data/daily_trending_products.json', 'utf8');
    const trends = JSON.parse(data);
    niches = [...new Set(trends.map(t => t.category))];
  } catch (e) {
    console.log('[Content] Using default niches');
  }
  
  // 2. 生成SEO文章 (每个niche 2-3篇)
  for (const niche of niches.slice(0, 3)) {
    const keywords = await discoverKeywords(niche);
    
    for (const kw of keywords.slice(0, 3)) {
      try {
        const article = await generateSEOArticle(kw.keyword, products);
        
        // 发布到WordPress (可选,生产环境启用)
        // const published = await publishToWordPress(article);
        
        results.articles.push({
          keyword: kw.keyword,
          title: article.title,
          status: 'generated'
        });
      } catch (e) {
        console.error('[Content] Article error:', e.message);
      }
    }
  }
  
  // 3. 生成TikTok脚本
  const tiktokProducts = products.length > 0 ? products.slice(0, 10) : [
    { name: 'Portable Espresso Maker', price: '25.99', category: 'kitchen' },
    { name: 'Cat Toys Set', price: '15.99', category: 'pets' },
    { name: 'Yoga Mat Premium', price: '29.99', category: 'fitness' }
  ];
  
  for (const product of tiktokProducts) {
    results.tiktok.push({
      product: product.name,
      script: await generateTikTokScript(product)
    });
  }
  
  // 4. 生成推文
  for (const product of tiktokProducts) {
    results.tweets.push({
      product: product.name,
      tweet: await generateTweet(product)
    });
  }
  
  // 5. 生成Pinterest内容
  for (const product of tiktokProducts) {
    results.pinterest.push({
      product: product.name,
      ...await generatePinterestDescription(product)
    });
  }
  
  // 保存结果
  fs.writeFileSync(
    './data/daily_generated_content.json',
    JSON.stringify(results, null, 2)
  );
  
  console.log(`[Content] Generated: ${results.articles.length} articles, ${results.tiktok.length} TikTok, ${results.tweets.length} tweets`);
  
  return results;
}

// ============ 导出 ============

module.exports = {
  discoverKeywords,
  generateSEOArticle,
  publishToWordPress,
  generateTikTokScript,
  generateTweet,
  generatePinterestDescription,
  dailyContentGeneration
};

// 如果直接运行
if (require.main === module) {
  dailyContentGeneration()
    .then(results => console.log('Done:', results))
    .catch(err => console.error(err));
}
