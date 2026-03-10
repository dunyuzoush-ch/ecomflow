/**
 * EcomFlow MVP - AI Service
 * OpenAI生成产品
 */

const axios = require("axios");

/**
 * AI生成产品数据
 * 如果没有配置OpenAI API Key，使用模拟数据
 */
async function generateProduct(keyword) {
  // 如果没有API Key，使用模拟数据
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-xxxx')) {
    console.log('   (Using mock data - no OpenAI key)');
    return generateMockProduct(keyword);
  }

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
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    // 解析JSON响应
    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.log('   (OpenAI API failed, using mock data)');
    return generateMockProduct(keyword);
  }
}

/**
 * 生成模拟产品数据
 */
function generateMockProduct(keyword) {
  const products = {
    "camping gadget": {
      title: "Portable Camping Hammock - Lightweight Outdoor Hammock",
      description: "<p>Lightweight and portable camping hammock perfect for outdoor adventures. Easy to set up and pack away.</p>",
      price: "29.99",
      tags: ["camping", "outdoor", "hammock", "hiking"]
    },
    "pet grooming tool": {
      title: "Professional Pet Grooming Brush - deshedding tool",
      description: "<p>Premium deshedding brush for dogs and cats. Reduces shedding by 90%.</p>",
      price: "19.99",
      tags: ["pet", "grooming", "dog", "cat"]
    },
    "kitchen slicer": {
      title: "Multi-functional Kitchen Vegetable Slicer",
      description: "<p>Slice, dice, and julienne vegetables in seconds. Safe and easy to use.</p>",
      price: "24.99",
      tags: ["kitchen", "cooking", "kitchenware"]
    },
    "yoga accessories": {
      title: "Premium Yoga Mat with Alignment Lines",
      description: "<p>Non-slip yoga mat with alignment lines. Eco-friendly material.</p>",
      price: "34.99",
      tags: ["yoga", "fitness", "exercise"]
    },
    "fitness equipment": {
      title: "Resistance Bands Set - Home Workout",
      description: "<p>5 different resistance levels. Perfect for home workouts.</p>",
      price: "19.99",
      tags: ["fitness", "workout", "resistance bands"]
    },
    "home organization": {
      title: "Closet Organizer System - Space Saver",
      description: "<p>Maximize your closet space with this 6-shelf organizer.</p>",
      price: "39.99",
      tags: ["home", "organization", "storage"]
    },
    "outdoor gear": {
      title: "LED Camping Lantern - Waterproof",
      description: "<p>Bright LED lantern for camping, hiking, and emergencies.</p>",
      price: "22.99",
      tags: ["outdoor", "camping", "lantern"]
    },
    "smart home device": {
      title: "WiFi Smart Plug - Voice Control",
      description: "<p>Control your devices remotely. Works with Alexa and Google.</p>",
      price: "15.99",
      tags: ["smart home", "wifi", "plug"]
    }
  };

  return products[keyword] || {
    title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} - Premium Quality`,
    description: `<p>High-quality ${keyword} for everyday use. Premium materials and excellent craftsmanship.</p>`,
    price: (Math.random() * 30 + 15).toFixed(2),
    tags: [keyword, "dropshipping", "trending"]
  };
}

module.exports = { generateProduct };
