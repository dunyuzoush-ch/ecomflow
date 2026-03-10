/**
 * EcomFlow MVP - AI Service
 * OpenAI生成产品 + 图片
 */

const axios = require("axios");

/**
 * AI生成产品数据 + 图片
 */
async function generateProduct(keyword) {
  // 如果没有API Key，使用模拟数据
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-xxxx')) {
    console.log('   (Using mock data - no Openai key)');
    return generateMockProduct(keyword);
  }

  // 使用OpenAI DALL-E生成图片
  const imageUrl = await generateProductImage(keyword);
  
  const product = await generateProductData(keyword);
  product.imageUrl = imageUrl;
  
  return product;
}

/**
 * 生成产品数据
 */
async function generateProductData(keyword) {
  const prompt = `
Create a dropshipping product.

Keyword: ${keyword}

Return JSON:

{
  "title": "...",
  "description": "...",
  "price": "...",
  "tags": [...]
}
`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-5-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      },
      { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
    );

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    return generateMockProduct(keyword);
  }
}

/**
 * DALL-E生成产品图片
 */
async function generateProductImage(keyword) {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-xxxx')) {
    // 返回免费placeholder图片
    return getPlaceholderImage(keyword);
  }

  const prompt = `High quality product photo of ${keyword}, white background, professional ecommerce photography, clean and modern`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        model: "dall-e-3",
        prompt: prompt,
        size: "1024x1024",
        n: 1
      },
      { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
    );

    return response.data.data[0].url;
  } catch (error) {
    console.log('   (Image gen failed, using placeholder)');
    return getPlaceholderImage(keyword);
  }
}

/**
 * 获取Placeholder图片 - 免费图床
 */
function getPlaceholderImage(keyword) {
  // 使用Unsplash Source作为免费图床
  const keywords = {
    "camping gadget": "camping,hammock,outdoor",
    "pet grooming tool": "pet,dog,brush",
    "kitchen slicer": "kitchen,cooking,vegetable",
    "yoga accessories": "yoga,mat,fitness",
    "fitness equipment": "fitness,workout,bands",
    "home organization": "home,organization,storage",
    "outdoor gear": "outdoor,camping,lantern",
    "smart home device": "smart,home,tech"
  };
  
  const tag = keywords[keyword] || "product";
  // 使用 picsum.photos 作为备用
  return `https://picsum.photos/seed/${keyword.replace(/\s/g,'')}/1024/1024`;
}

/**
 * 生成模拟产品数据
 */
function generateMockProduct(keyword) {
  const products = {
    "camping gadget": {
      title: "Portable Camping Hammock - Lightweight Outdoor Hammock",
      description: "<p>Lightweight and portable camping hammock perfect for outdoor adventures. Easy to set up and pack away. Made from durable parachute nylon material.</p>",
      price: "29.99",
      tags: ["camping", "outdoor", "hammock", "hiking"],
      imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1024"
    },
    "pet grooming tool": {
      title: "Professional Pet Grooming Brush - Deshedding Tool",
      description: "<p>Premium deshedding brush for dogs and cats. Reduces shedding by 90%. Gentle on pet skin, effective for all fur types.</p>",
      price: "19.99",
      tags: ["pet", "grooming", "dog", "cat"],
      imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1024"
    },
    "kitchen slicer": {
      title: "Multi-functional Kitchen Vegetable Slicer",
      description: "<p>Slice, dice, and julienne vegetables in seconds. Safe and easy to use. Includes multiple blade attachments.</p>",
      price: "24.99",
      tags: ["kitchen", "cooking", "kitchenware"],
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1024"
    },
    "yoga accessories": {
      title: "Premium Yoga Mat with Alignment Lines",
      description: "<p>Non-slip yoga mat with alignment lines. Eco-friendly TPE material. Perfect for yoga, pilates, and floor exercises.</p>",
      price: "34.99",
      tags: ["yoga", "fitness", "exercise"],
      imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=1024"
    },
    "fitness equipment": {
      title: "Resistance Bands Set - Home Workout",
      description: "<p>5 different resistance levels. Perfect for home workouts, strength training, and physical therapy.</p>",
      price: "19.99",
      tags: ["fitness", "workout", "resistance bands"],
      imageUrl: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=1024"
    },
    "home organization": {
      title: "Closet Organizer System - Space Saver",
      description: "<p>Maximize your closet space with this 6-shelf organizer. Collapsible design, durable construction.</p>",
      price: "39.99",
      tags: ["home", "organization", "storage"],
      imageUrl: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=1024"
    },
    "outdoor gear": {
      title: "LED Camping Lantern - Waterproof",
      description: "<p>Bright LED lantern for camping, hiking, and emergencies. 3 lighting modes, USB rechargeable.</p>",
      price: "22.99",
      tags: ["outdoor", "camping", "lantern"],
      imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1024"
    },
    "smart home device": {
      title: "WiFi Smart Plug - Voice Control",
      description: "<p>Control your devices remotely. Works with Alexa and Google Assistant. Energy monitoring.</p>",
      price: "15.99",
      tags: ["smart home", "wifi", "plug"],
      imageUrl: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=1024"
    }
  };

  return products[keyword] || {
    title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} - Premium Quality`,
    description: `<p>High-quality ${keyword} for everyday use. Premium materials and excellent craftsmanship.</p>`,
    price: (Math.random() * 30 + 15).toFixed(2),
    tags: [keyword, "dropshipping", "trending"],
    imageUrl: `https://picsum.photos/seed/${keyword.replace(/\s/g,'')}/1024/1024`
  };
}

module.exports = { generateProduct };
