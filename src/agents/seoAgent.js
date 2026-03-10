/**
 * EcomFlow MVP - SEO Agent
 * 自动生成SEO文章并发布到WordPress
 */

const axios = require("axios");

/**
 * 生成SEO文章
 */
function generateSEOArticle(keyword, products = []) {
  const templates = [
    {
      title: `The Ultimate ${keyword} Buying Guide for 2026`,
      keyword: keyword,
      content: `
<h2>Introduction</h2>
<p>Welcome to our comprehensive ${keyword} buying guide. Whether you're a beginner or expert, we've got you covered.</p>

<h2>Why ${keyword} Matters</h2>
<p>Choosing the right ${keyword} can significantly impact your daily life. Our research shows...</p>

<h2>Top Recommended Products</h2>
${products.map(p => `<li><a href="${p.link}">${p.title}</a> - $${p.price}</li>`).join('')}

<h2>Key Factors to Consider</h2>
<ul>
<li><strong>Quality:</strong> Look for durable materials</li>
<li><strong>Price:</strong> Balance cost and features</li>
<li><strong>Reviews:</strong> Check customer feedback</li>
</ul>

<h2>Conclusion</h2>
<p>We hope this guide helps you find the perfect ${keyword}.</p>
      `
    },
    {
      title: `Best ${keyword} - Expert Reviews & Top Picks`,
      keyword: keyword,
      content: `
<h2>Our Top ${keyword} Picks</h2>
<p>After extensive testing, here are our top recommendations:</p>
${products.map(p => `<h3>${p.title}</h3><p>${p.description || 'Great product at an amazing price!'}</p>`).join('')}
      `
    }
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * 发布到WordPress - 使用XML-RPC API
 */
async function publishToWordPress(article) {
  if (!process.env.WP_URL || !process.env.WP_USER) {
    console.log('📝 WordPress not configured, skipping...');
    return { status: 'skipped' };
  }
  
  try {
    // 使用 xmlrpc-js 库
    const xmlrpc = require('xmlrpc');
    
    // 创建XML-RPC客户端
    const wpUrl = process.env.WP_URL.replace('http://', '').replace('https://', '');
    const client = xmlrpc.createClient({
      host: wpUrl.split(':')[0],
      port: wpUrl.includes(':') ? parseInt(wpUrl.split(':')[1]) : 80,
      path: '/xmlrpc.php'
    });
    
    // 发布文章
    const post = {
      post_type: 'post',
      post_status: 'publish',
      post_title: article.title,
      post_content: article.content,
      post_author: 1,
      terms: {
        category: [1]
      }
    };
    
    return new Promise((resolve, reject) => {
      client.methodCall('wp.newPost', [0, process.env.WP_USER, process.env.WP_PASS, post], (err, response) => {
        if (err) {
          console.log('❌ WordPress XML-RPC error:', err.message);
          resolve({ status: 'failed', error: err.message });
        } else {
          const postUrl = `${process.env.WP_URL}/?p=${response}`;
          console.log(`✅ Published SEO article: ${article.title}`);
          console.log(`   URL: ${postUrl}`);
          resolve({ status: 'published', url: postUrl });
        }
      });
    });
  } catch (error) {
    console.log('❌ WordPress error:', error.message);
    return { status: 'failed', error: error.message };
  }
}

/**
 * 批量生成SEO文章
 */
async function generateAndPublishSEO(keywords, products) {
  const results = [];
  for (const keyword of keywords) {
    const article = generateSEOArticle(keyword, products);
    const result = await publishToWordPress(article);
    results.push({ keyword, ...result });
  }
  return results;
}

module.exports = { generateSEOArticle, publishToWordPress, generateAndPublishSEO };
