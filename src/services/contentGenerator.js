/**
 * EcomFlow MVP - 改进版AI服务
 * 生成更有吸引力的产品描述、视频脚本和图片
 */

const axios = require("axios");

/**
 * 生成优质产品数据 - 改进版
 */
async function generateProductData(keyword) {
  const prompt = `
Create a compelling dropshipping product listing.

Keyword: ${keyword}

Return JSON with these fields:
{
  "title": "吸引人的产品标题",
  "subtitle": "副标题/USP",
  "description": "<p>HTML格式的产品描述，包含特点和卖点</p>",
  "bullet_points": ["要点1", "要点2", "要点3"],
  "price": "价格",
  "tags": ["标签1", "标签2"]
}

要求：
- 标题要具体，有吸引力
- 描述要突出痛点解决和benefits
- 至少3个bullet points
- 使用HTML格式
`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8
      },
      { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
    );

    const content = response.data.choices[0].message.content;
    // 尝试解析JSON
    try {
      return JSON.parse(content);
    } catch {
      // 如果不是JSON，尝试提取JSON部分
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return null;
    }
  } catch (error) {
    console.log('   (AI生成失败:', error.message.substring(0,30), ')');
    return null;
  }
}

/**
 * 生成产品视频脚本
 */
async function generateVideoScript(product) {
  const prompt = `
Create a 30-second video script for a dropshipping product.

Product: ${product.title}
Description: ${product.description}

Return JSON:
{
  "hook": "前3秒的开场白",
  "problem": "痛点描述 (3秒)",
  "solution": "产品展示和解决方案 (10秒)",
  "benefits": "好处列表 (8秒)",
  "cta": "行动号召 (6秒)"
}

Use simple, punchy marketing language.
`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      },
      { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
    );

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    return generateDefaultVideoScript(product.title);
  }
}

/**
 * 生成更好的产品图片
 */
async function generateProductImage(keyword) {
  const prompt = `Professional ecommerce product photography of ${keyword}, clean white background, studio lighting, high quality, sharp focus, commercial advertising style, no text or watermark`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        model: "dall-e-3",
        prompt: prompt,
        size: "1024x1024",
        quality: "standard",
        n: 1
      },
      { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
    );

    return response.data.data[0].url;
  } catch (error) {
    console.log('   (图片生成失败，使用备用图)');
    return getFallbackImage(keyword);
  }
}

/**
 * 备用图片 - 更好的选择
 */
function getFallbackImage(keyword) {
  const images = {
    'kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    'cooking': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    'home': 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800',
    'storage': 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800',
    'camping': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    'outdoor': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    'pet': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    'dog': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    'cat': 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
    'fitness': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    'gym': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    'yoga': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
    'beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
    'hair': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
    'tech': 'https://images.unsplash.com/photo-1491553895911-0055uj66ef46?w=800',
    'phone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    'garden': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    'plant': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800',
    'office': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  };
  
  const key = keyword.toLowerCase();
  for (const [kw, url] of Object.entries(images)) {
    if (key.includes(kw)) return url;
  }
  
  // 默认高质量图片
  return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800';
}

/**
 * 默认视频脚本
 */
function generateDefaultVideoScript(productTitle) {
  return {
    hook: `🔥 你还在为${productTitle}发愁吗?`,
    problem: "普通产品又贵又不好用?",
    solution: `介绍我们的${productTitle}...`,
    benefits: "✅ 优质材料\n✅ 性价比高\n✅ 买家好评如潮",
    CTA: "立即下单，限时优惠!"
  };
}

/**
 * 主函数：生成完整产品内容
 */
async function generateProductContent(keyword) {
  console.log(`\n🎬 Generating content for: ${keyword}`);
  
  // 1. 生成产品数据
  let productData = await generateProductData(keyword);
  if (!productData) {
    productData = getDefaultProduct(keyword);
  }
  
  // 2. 生成视频脚本
  const videoScript = await generateVideoScript(productData);
  
  // 3. 生成/获取图片
  const imageUrl = await generateProductImage(keyword);
  
  return {
    ...productData,
    imageUrl,
    videoScript,
    keyword
  };
}

/**
 * 默认产品数据
 */
function getDefaultProduct(keyword) {
  return {
    title: `${keyword} - Premium Quality`,
    subtitle: "Best value for money",
    description: `<p>Premium ${keyword} designed for everyday use. Made with high-quality materials for durability and performance.</p>`,
    bullet_points: [
      "Premium quality materials",
      "Durable and long-lasting",
      "Great value for money"
    ],
    price: "29.99",
    tags: [keyword, "premium", "bestseller"]
  };
}

module.exports = { generateProductContent, generateProductData, generateVideoScript, generateProductImage };
