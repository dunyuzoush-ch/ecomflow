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
      content: `
<h2>Our Top ${keyword} Picks</h2>
<p>After extensive testing, here are our top recommendations:</p>
${products.map(p => `<h3>${p.title}</h3><p>${p.description}</p>`).join('')}
      `
    }
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * 发布到WordPress
 */
async function publishToWordPress(article) {
  if (!process.env.WP_URL || !process.env.WP_USER) {
    console.log('📝 WordPress not configured, skipping...');
    return { status: 'skipped' };
  }
  
  try {
    const response = await axios.post(
      `${process.env.WP_URL}/wp-json/wp/v2/posts`,
      {
        title: article.title,
        content: article.content,
        status: 'publish',
        categories: [1],
        tags: article.keyword.split(' ')
      },
      {
        auth: {
          username: process.env.WP_USER,
          password: process.env.WP_PASS
        }
      }
    );
    console.log(`✅ Published SEO article: ${article.title}`);
    return { status: 'published', url: response.data.link };
  } catch (error) {
    console.log('❌ WordPress error:', error.message);
    return { status: 'failed' };
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
