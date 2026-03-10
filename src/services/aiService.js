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
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-xxxx') {
    console.log('   (Using mock data - no OpenAI key)');
    return generateMockProduct(keyword);
  }

  // 使用OpenAI生成
  console.log('   (Using OpenAI...)');
  try {
    const product = await generateProductData(keyword);
    const imageUrl = await generateProductImage(keyword);
    product.imageUrl = imageUrl;
    return product;
  } catch (error) {
    console.log('   (OpenAI failed:', error.message.substring(0,30), ')');
    return generateMockProduct(keyword);
  }
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
    // 返回默认图片
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1024';
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
    return IMAGE_MAP.default || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1024';
  }
}

// Unsplash图片映射 - 每个关键词对应不同图片
const IMAGE_MAP = {
  // Kitchen
  'kitchen organizer': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1024',
  'spice rack': 'https://images.unsplash.com/photo-1590794056226-79ef3a7cbe47?w=1024',
  'cutting board': 'https://images.unsplash.com/photo-1588165114095-48a7b44a5991?w=1024',
  'food storage': 'https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=1024',
  'kettle': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1024',
  'coffee': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1024',
  'blender': 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=1024',
  // Home
  'storage box': 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=1024',
  'closet': 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=1024',
  'drawer': 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=1024',
  'wall shelf': 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=1024',
  'shoe rack': 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=1024',
  'laundry': 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=1024',
  'mirror': 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1024',
  // Outdoor
  'camping': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1024',
  'tent': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1024',
  'sleeping bag': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1024',
  'camp chair': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1024',
  'lantern': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1024',
  'hiking': 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1024',
  'water bottle': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1024',
  // Pet
  'dog bed': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1024',
  'cat tree': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1024',
  'pet carrier': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1024',
  'dog toy': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1024',
  'pet brush': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1024',
  // Fitness
  'yoga mat': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=1024',
  'resistance bands': 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=1024',
  'dumbbell': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1024',
  'kettlebell': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1024',
  'jump rope': 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=1024',
  'gym': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1024',
  // Beauty
  'makeup': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1024',
  'hair': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1024',
  'skincare': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1024',
  // Tech
  'phone charger': 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=1024',
  'earbuds': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1024',
  'smart watch': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1024',
  'Bluetooth speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1024',
  'USB': 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=1024',
  // Garden
  'plant pot': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1024',
  'garden': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1024',
  'watering': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1024',
};

/**
 * 获取关键词对应的图片
 */
function getImageForKeyword(keyword) {
  const key = keyword.toLowerCase();
  
  for (const [kw, url] of Object.entries(IMAGE_MAP)) {
    if (key.includes(kw)) {
      // 添加随机参数避免重复
      return url + '?v=' + Date.now();
    }
  }
  
  // 默认产品图 - 使用可靠的图片
  const defaultImages = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1024',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1024',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1024',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=1024',
    'https://images.unsplash.com/photo-1491553895911-0055uj66ef46?w=1024'
  ];
  const randomImg = defaultImages[Math.floor(Math.random() * defaultImages.length)];
  return randomImg + '?v=' + Date.now();
}

/**
 * 生成模拟产品数据 - 使用关键词对应图片
 */
function generateMockProduct(keyword) {
  // 每个关键词对应唯一产品
  const products = {
    "kitchen organizer": {
      title: "Premium Kitchen Organizer Set - 6 Piece Cabinet Storage Solution",
      description: "<p>Premium kitchen organizer set with 6 pieces. Maximize your cabinet space with this sleek storage solution. Perfect for plates, cups, and utensils.</p>",
      price: "34.99",
      tags: ["kitchen", "organization", "storage"],
      imageUrl: getImageForKeyword(keyword)
    },
    "spice rack": {
      title: "Rotating Spice Rack - 12 Jar Set with Labels",
      description: "<p>Space-saving rotating spice rack with 12 jars. Easy access to all your favorite seasonings.</p>",
      price: "29.99",
      tags: ["kitchen", "spice", "cooking"],
      imageUrl: getImageForKeyword(keyword)
    },
    "cutting board": {
      title: "Professional Bamboo Cutting Board - Extra Large",
      description: "<p>Eco-friendly bamboo cutting board, extra large size. Durable and knife-friendly surface.</p>",
      price: "24.99",
      tags: ["kitchen", "cooking", "bamboo"],
      imageUrl: getImageForKeyword(keyword)
    },
    "food storage container": {
      title: "Airtight Food Storage Set - 10 Piece Glass Containers",
      description: "<p>Borosilicate glass containers with airtight lids. Microwave and dishwasher safe.</p>",
      price: "39.99",
      tags: ["kitchen", "storage", "food"],
      imageUrl: getImageForKeyword(keyword)
    },
    "storage box": {
      title: "Multi-Purpose Storage Box - Collapsible Fabric Organizer",
      description: "<p>Collapsible fabric storage box with handles. Perfect for closet, garage, and moving.</p>",
      price: "19.99",
      tags: ["storage", "organization", "home"],
      imageUrl: getImageForKeyword(keyword)
    },
    "closet organizer": {
      title: "Premium Closet Organizer System - Hanging Storage",
      description: "<p>Complete closet organizer system with hanging shelves and drawers. Maximize your wardrobe space.</p>",
      price: "44.99",
      tags: ["closet", "organization", "storage"],
      imageUrl: getImageForKeyword(keyword)
    },
    "wall shelf": {
      title: "Modern Floating Wall Shelf Set - 3 Piece",
      description: "<p>Sleek floating wall shelves, easy to install. Perfect for books, plants, and decor.</p>",
      price: "27.99",
      tags: ["home", "decor", "shelf"],
      imageUrl: getImageForKeyword(keyword)
    },
    "camping tent": {
      title: "2-Person Pop-Up Camping Tent - Waterproof",
      description: "<p>Easy setup pop-up tent for 2. Waterproof with UV protection. Perfect for weekend camping.</p>",
      price: "79.99",
      tags: ["camping", "outdoor", "tent"],
      imageUrl: getImageForKeyword(keyword)
    },
    "sleeping bag": {
      title: "Premium Sleeping Bag - Cold Weather Rated",
      description: "<p>Warm sleeping bag rated to 20°F. Lightweight and compressible for easy carrying.</p>",
      price: "49.99",
      tags: ["camping", "sleeping bag", "outdoor"],
      imageUrl: getImageForKeyword(keyword)
    },
    "camp chair": {
      title: "Portable Folding Camp Chair with Carry Bag",
      description: "<p>Lightweight folding camp chair with cup holder. Includes carrying bag for easy transport.</p>",
      price: "39.99",
      tags: ["camping", "chair", "outdoor"],
      imageUrl: getImageForKeyword(keyword)
    },
    "led lantern": {
      title: "LED Camping Lantern - Rechargeable USB",
      description: "<p>Bright LED lantern with 3 modes. USB rechargeable, long battery life.</p>",
      price: "22.99",
      tags: ["camping", "lantern", "led"],
      imageUrl: getImageForKeyword(keyword)
    },
    "hiking backpack": {
      title: "40L Hiking Backpack - Waterproof Daypack",
      description: "<p>40-liter hiking backpack with rain cover. Multiple compartments for organization.</p>",
      price: "59.99",
      tags: ["hiking", "backpack", "outdoor"],
      imageUrl: getImageForKeyword(keyword)
    },
    "water bottle": {
      title: "Insulated Water Bottle - 32oz Stainless Steel",
      description: "<p>Double-walled insulated water bottle. Keeps drinks cold 24hrs, hot 12hrs.</p>",
      price: "24.99",
      tags: ["water bottle", "hydration", "fitness"],
      imageUrl: getImageForKeyword(keyword)
    },
    "dog bed": {
      title: "Orthopedic Dog Bed - Memory Foam",
      description: "<p>Premium orthopedic dog bed with memory foam. Removable washable cover.</p>",
      price: "49.99",
      tags: ["dog", "pet", "bed"],
      imageUrl: getImageForKeyword(keyword)
    },
    "cat tree": {
      title: "Multi-Level Cat Tree Tower - 62 inch",
      description: "<p>Tall cat tree with multiple levels and scratching posts. Keeps cats entertained for hours.</p>",
      price: "69.99",
      tags: ["cat", "pet", "furniture"],
      imageUrl: getImageForKeyword(keyword)
    },
    "pet carrier": {
      title: "Soft-Sided Pet Carrier - Airline Approved",
      description: "<p>Airline approved pet carrier with mesh ventilation. Comfortable for pets up to 15lbs.</p>",
      price: "34.99",
      tags: ["pet", "carrier", "travel"],
      imageUrl: getImageForKeyword(keyword)
    },
    "dog toy": {
      title: "Interactive Dog Toy Set - 7 Pack",
      description: "<p>Durable dog toy set including balls, ropes, and chew toys. Great for indoor play.</p>",
      price: "19.99",
      tags: ["dog", "toy", "pet"],
      imageUrl: getImageForKeyword(keyword)
    },
    "pet brush": {
      title: "Professional Pet Grooming Brush - Self Cleaning",
      description: "<p>Self-cleaning deshedding brush. Reduces pet hair while grooming.</p>",
      price: "16.99",
      tags: ["pet", "grooming", "brush"],
      imageUrl: getImageForKeyword(keyword)
    },
    "yoga mat": {
      title: "Premium Yoga Mat - Non-Slip TPE",
      description: "<p>Eco-friendly TPE yoga mat with alignment lines. Non-slip surface for stability.</p>",
      price: "29.99",
      tags: ["yoga", "fitness", "mat"],
      imageUrl: getImageForKeyword(keyword)
    },
    "resistance bands": {
      title: "Resistance Bands Set - 5 Levels with Handles",
      description: "<p>Complete resistance band set with 5 levels. Includes handles and door anchor.</p>",
      price: "19.99",
      tags: ["fitness", "resistance", "workout"],
      imageUrl: getImageForKeyword(keyword)
    },
    "dumbbell": {
      title: "Adjustable Dumbbell Set - 5-25 lbs",
      description: "<p>Space-saving adjustable dumbbell. Quick weight changes from 5 to 25 lbs.</p>",
      price: "89.99",
      tags: ["fitness", "dumbbell", "weights"],
      imageUrl: getImageForKeyword(keyword)
    },
    "kettlebell": {
      title: "Cast Iron Kettlebell - Adjustable Weight",
      description: "<p>Premium cast iron kettlebell with adjustable weight. Perfect for strength training.</p>",
      price: "44.99",
      tags: ["fitness", "kettlebell", "strength"],
      imageUrl: getImageForKeyword(keyword)
    },
    "jump rope": {
      title: "Speed Jump Rope - Adjustable Length",
      description: "<p>High-speed jump rope with ball bearings. Adjustable length for all heights.</p>",
      price: "12.99",
      tags: ["fitness", "jumprope", "cardio"],
      imageUrl: getImageForKeyword(keyword)
    },
    "makeup mirror": {
      title: "LED Vanity Mirror - Hollywood Style",
      description: "<p>Hollywood-style LED vanity mirror with dimmer. Touch control and USB charging.</p>",
      price: "49.99",
      tags: ["makeup", "mirror", "beauty"],
      imageUrl: getImageForKeyword(keyword)
    },
    "hair dryer": {
      title: "Professional Hair Dryer - Ionic Technology",
      description: "<p>Professional ionic hair dryer with multiple heat settings. Reduces frizz.</p>",
      price: "39.99",
      tags: ["hair", "beauty", "dryer"],
      imageUrl: getImageForKeyword(keyword)
    },
    "phone charger": {
      title: "Fast Phone Charger - 20W USB-C",
      description: "<p>20W fast charger compatible with all phones. Compact and travel-friendly.</p>",
      price: "14.99",
      tags: ["phone", "charger", "tech"],
      imageUrl: getImageForKeyword(keyword)
    },
    "wireless earbuds": {
      title: "True Wireless Earbuds - Bluetooth 5.2",
      description: "<p>Premium wireless earbuds with active noise cancellation. 30-hour battery life.</p>",
      price: "49.99",
      tags: ["earbuds", "wireless", "tech"],
      imageUrl: getImageForKeyword(keyword)
    },
    "smart watch": {
      title: "Fitness Smart Watch - Heart Rate Monitor",
      description: "<p>Smart watch with heart rate, sleep tracking, and 10-day battery.</p>",
      price: "59.99",
      tags: ["smartwatch", "fitness", "tech"],
      imageUrl: getImageForKeyword(keyword)
    },
    "bluetooth speaker": {
      title: "Portable Bluetooth Speaker - Waterproof",
      description: "<p>Waterproof bluetooth speaker with 360° sound. 20-hour playtime.</p>",
      price: "34.99",
      tags: ["speaker", "bluetooth", "audio"],
      imageUrl: getImageForKeyword(keyword)
    },
    "plant pot": {
      title: "Self-Watering Plant Pot Set - 5 Piece",
      description: "<p>Modern self-watering plant pots with drainage. Perfect for indoor plants.</p>",
      price: "24.99",
      tags: ["plant", "pot", "garden"],
      imageUrl: getImageForKeyword(keyword)
    },
    "garden tools": {
      title: "Garden Tool Set - 8 Piece Ergonomic",
      description: "<p>Ergonomic garden tool set with trowel, pruner, and gloves.</p>",
      price: "29.99",
      tags: ["garden", "tools", "outdoor"],
      imageUrl: getImageForKeyword(keyword)
    }
  };

  // 查找匹配的产品
  const key = keyword.toLowerCase();
  for (const [kw, product] of Object.entries(products)) {
    if (key.includes(kw)) {
      return { ...product, imageUrl: getImageForKeyword(kw) };
    }
  }
  
  // 默认产品
  return {
    title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} - Premium Quality`,
    description: `<p>High-quality ${keyword} for everyday use. Premium materials and excellent craftsmanship.</p>`,
    price: (Math.random() * 30 + 15).toFixed(2),
    tags: [keyword, "dropshipping", "trending"],
    imageUrl: getImageForKeyword(keyword)
  };
}

module.exports = { generateProduct };
