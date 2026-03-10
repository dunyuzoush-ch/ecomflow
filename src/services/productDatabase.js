/**
 * EcomFlow - 优质产品数据库
 * 包含详细描述、卖点和视频脚本
 */

const PRODUCT_DATABASE = {
  // Kitchen
  "kitchen knife set": {
    title: "Professional 8-Piece Kitchen Knife Set with Block",
    subtitle: "Premium German Stainless Steel - Chef Quality",
    description: `<h2>🍳 Professional Kitchen Knife Set</h2>
<p>Upgrade your cooking experience with our premium 8-piece knife set. Crafted from high-carbon German stainless steel for exceptional sharpness and durability.</p>

<h3>What's Included:</h3>
<ul>
<li>🔪 8" Chef Knife - For all-purpose cutting</li>
<li>🔪 8" Bread Knife - Perfect slices every time</li>
<li>🔪 7" Santoku Knife - Japanese precision</li>
<li>🔪 6" Cleaver - Heavy-duty chopping</li>
<li>🔪 5" Utility Knife - Everyday tasks</li>
<li>🔪 4" Paring Knife - Detailed work</li>
<li>🍴 Kitchen Shears - Multi-purpose</li>
<li>🪵 Acrylic Block - Safe storage</li>
</ul>

<h3>Why Customers Love It:</h3>
<ul>
<li>✅ Razor-sharp blades that stay sharp for years</li>
<li>✅ Ergonomic handles for comfortable grip</li>
<li>✅ Perfect weight distribution</li>
<li>✅ Gift-ready packaging</li>
</ul>

<p><strong>Free shipping</strong> | <strong>30-day money back</strong> | <strong>Lifetime warranty</strong></p>`,
    price: "49.99",
    tags: ["kitchen", "knife set", "cooking", "chef", "gifts"],
    video_script: {
      hook: "🔪 还在用钝刀切菜？",
      problem: "普通刀具切不动、容易钝、握着手疼",
      solution: "专业8件套厨师刀组，德国不锈钢，锋利耐用",
      benefits: "✅ 终身质保\n✅ 送礼首选\n✅ 厨房升级",
      cta: "点击下方链接，限时优惠价$49.99!"
    }
  },
  
  "air fryer": {
    title: "Digital Air Fryer XXL - 8 Quart Family Size",
    subtitle: "1800W Rapid Air Technology - Oil-Free Cooking",
    description: `<h2>🍟 健康烹饪，从这台空气炸锅开始</h2>
<p>8夸脱超大容量，1800W大功率，满足全家需求。无需油炸也能做出酥脆美食!</p>

<h3>核心功能:</h3>
<ul>
<li>🔥 1800W大功率，烹饪更快</li>
<li>📱 数字触摸屏，精准控温</li>
<li>🌡️ 80-200°C广域温控</li>
<li>⏰ 60分钟定时器</li>
<li>🧼 不粘涂层，清洗超方便</li>
</ul>

<h3>为什么选择我们:</h3>
<ul>
<li>✅ 油脂减少90%，健康美食</li>
<li>✅ 一机多用：炸、烤、烘、焙</li>
<li>✅ 预设8种智能菜单</li>
<li>✅ 过热保护，安全无忧</li>
</ul>

<p><strong>配件:</strong> 炸篮、烤架、披萨盘 | <strong>质保:</strong> 1年</p>`,
    price: "89.99",
    tags: ["air fryer", "kitchen", "healthy", "cooking", "appliances"],
    video_script: {
      hook: "🍟 想吃炸鸡又怕油?",
      problem: "油炸食品热量高、不健康",
      solution: "空气炸锅，不用一滴油做出酥脆炸鸡",
      benefits: "✅ 零油炸\n✅ 8L大容量\n✅ 一机多用",
      cta: "立即下单，健康美食每一天!"
    }
  },
  
  "blender": {
    title: "Professional High-Speed Blender - 2000W",
    subtitle: "Cold & Hot Blending - Meal Prep Master",
    description: `<h2>🥤 专业级破壁机</h2>
<p>2000W强劲马达，冰块瞬间粉碎。冷热双打，满足全家需求。</p>

<h3>规格:</h3>
<ul>
<li>⚡ 2000W纯铜电机</li>
<li>🔄 38000RPM转速</li>
<li>📱 12种智能程序</li>
<li>🫙 2.5L大容量</li>
</ul>`,
    price: "79.99",
    tags: ["blender", "kitchen", "health", "smoothie"],
    video_script: {
      hook: "🥤 还在喝外面的奶茶?",
      problem: "添加剂多、不健康、费钱",
      solution: "自己在家打果汁，健康又省钱",
      benefits: "✅ 2000W大功率\n✅ 冷热双打\n✅ 一键清洗",
      cta: "点击购买，早餐从此不一样!"
    }
  },
  
  "camp chair": {
    title: "Portable Folding Camping Chair - Heavy Duty",
    subtitle: "Padded Seat with Cup Holder - Lightweight Aluminum",
    description: `<h2>🪑 户外折叠椅</h2>
<p>轻量化铝合金支架，承重300斤。便携折叠设计，戶外露营、野餐、钓鱼必备!</p>

<h3>特点:</h3>
<ul>
<li>🔧 7075航空级铝合金</li>
<li>🪑 加厚EVA坐垫</li>
<li>☕ 杯架设计</li>
<li>🎒 收纳袋便携</li>
</ul>`,
    price: "34.99",
    tags: ["camping", "chair", "outdoor", "folding", "hiking"],
    video_script: {
      hook: "🪑 露营没有椅子坐?",
      problem: "坐在地上不舒服、累",
      solution: "便携折叠椅，打开就能坐",
      benefits: "✅ 承重300斤\n✅ 1秒折叠\n✅ 送收纳袋",
      cta: "露营必备，点击立即购买!"
    }
  },
  
  "dog bed": {
    title: "Orthopedic Memory Foam Dog Bed",
    subtitle: "Waterproof & Washable - Large Dogs",
    description: `<h2>🐕 高端宠物床</h2>
<p>记忆棉支撑，保护狗狗关节。可拆洗面料，舒适耐用。</p>

<h3>特点:</h3>
<ul>
<li>🧠 记忆棉内芯</li>
<li>💧 防水底布</li>
<li>🧺 可机洗外套</li>
<li>🌡️ 四季通用</li>
</ul>`,
    price: "59.99",
    tags: ["dog bed", "pet", "orthopedic", "comfortable"],
    video_script: {
      hook: "🐕 狗狗睡地板会着凉?",
      problem: "普通狗窝不舒服、容易脏",
      solution: "记忆棉狗床，保护关节更舒适",
      benefits: "✅ 记忆棉支撑\n✅ 防水可洗\n✅ 大中小可选",
      cta: "给毛孩子一个温暖的家!"
    }
  },
  
  "yoga mat": {
    title: "Premium Non-Slip Yoga Mat - Extra Wide",
    subtitle: "Eco-Friendly TPE Material - Alignment Lines",
    description: `<h2>🧘 瑜伽垫</h2>
<p>环保TPE材质，厚5mm适中回弹。双面防滑，附有对齐线指引。</p>

<h3>特点:</h3>
<ul>
<li>🌿 环保TPE</li>
<li>💪 双面防滑</li>
<li>📏 183x61cm加宽</li>
<li>🧼 清水即净</li>
</ul>`,
    price: "24.99",
    tags: ["yoga", "fitness", "mat", "exercise"],
    video_script: {
      hook: "🧘 瑜伽垫太滑?",
      problem: "普通垫子容易滑倒、味道大",
      solution: "高端防滑瑜伽垫，环保无异味",
      benefits: "✅ 双面防滑\n✅ 环保材质\n✅ 加宽舒适",
      cta: "瑜伽入门，从一块好垫子开始!"
    }
  },
  
  "water bottle": {
    title: "Insulated Water Bottle - 32oz",
    subtitle: "Stainless Steel - Keep Cold 24hrs",
    description: `<h2>🍶 保温杯</h2>
<p>双层真空保温，保冷24小时，保温12小时。316不锈钢，饮水更安全。</p>

<h3>特点:</h3>
<ul>
<li>❄️ 保冷24小时</li>
<li>♨️ 保温12小时</li>
<li>🔬 316不锈钢</li>
<li>🚿 防漏设计</li>
</ul>`,
    price: "19.99",
    tags: ["water bottle", "insulated", "sports", "hydration"],
    video_script: {
      hook: "🥤 想要随时喝到冰水?",
      problem: "普通杯子保温效果差",
      solution: "316不锈钢保温杯，保冷24小时",
      benefits: "✅ 24h保冷\n✅ 12h保温\n✅ 防漏便携",
      cta: "每天8杯水，从好杯子开始!"
    }
  },
  
  "phone stand": {
    title: "Adjustable Aluminum Phone Stand",
    subtitle: "360° Rotation - Desktop Cell Phone Mount",
    description: `<h2>📱 手机支架</h2>
<p>铝合金材质，360°旋转。桌面使用，追剧、办公、视频通话必备!</p>

<h3>特点:</h3>
<ul>
<li>🔄 360°自由旋转</li>
<li>🔧 铝合金材质</li>
<li>📱 兼容所有手机</li>
<li>🖥️ 桌面稳固</li>
</ul>`,
    price: "15.99",
    tags: ["phone stand", "desk", "accessories", "tech"],
    video_script: {
      hook: "📱 追剧手机没地方放?",
      problem: "拿着手累、找不到角度",
      solution: "360度旋转手机支架",
      benefits: "✅ 铝合金\n✅ 360°旋转\n✅ 稳固桌面",
      cta: "追剧神器，点击购买!"
    }
  },
  
  "plant pot": {
    title: "Self-Watering Plant Pot Set - 5 Piece",
    subtitle: "Modern Design - Indoor Outdoor",
    description: `<h2>🪴 自吸水花盆</h2>
<p>现代简约设计，自动吸水功能。室内绿植、阳台花园必备!</p>

<h3>特点:</h3>
<ul>
<li>💧 自动吸水</li>
<li>🎨 现代简约</li>
<li>🏠 室内户外</li>
<li>🌿 5件套装</li>
</ul>`,
    price: "22.99",
    tags: ["plant pot", "garden", "indoor", "flowers"],
    video_script: {
      hook: "🪴 经常忘记浇水?",
      problem: "植物容易干死",
      solution: "自吸水花盆，智能浇水",
      benefits: "✅ 自动吸水\n✅ 5件套装\n✅ 简约美观",
      cta: "让植物更好养!"
    }
  },
  
  "fitness tracker": {
    title: "Smart Fitness Watch - Heart Rate Monitor",
    subtitle: "Sleep Tracking - 10-Day Battery",
    description: `<h2>⌚ 智能手环</h2>
<p>心率监测、睡眠追踪、步数统计。10天超长续航!</p>

<h3>特点:</h3>
<ul>
<li>❤️ 心率监测</li>
<li>😴 睡眠追踪</li>
<li>👟 运动模式</li>
<li>🔋 10天续航</li>
</ul>`,
    price: "39.99",
    tags: ["fitness tracker", "smart watch", "health", "wearable"],
    video_script: {
      hook: "⌚ 想运动但不知道效果?",
      problem: "不知道运动数据",
      solution: "智能手环实时监测",
      benefits: "✅ 心率监测\n✅ 睡眠分析\n✅ 10天续航",
      cta: "科学运动，从了解自己开始!"
    }
  }
};

/**
 * 获取产品数据
 */
function getProductData(keyword) {
  const key = keyword.toLowerCase().trim();
  
  // 直接匹配
  if (PRODUCT_DATABASE[key]) {
    return PRODUCT_DATABASE[key];
  }
  
  // 模糊匹配
  for (const [kw, data] of Object.entries(PRODUCT_DATABASE)) {
    if (key.includes(kw) || kw.includes(key)) {
      return data;
    }
  }
  
  // 默认产品
  return getDefaultProduct(keyword);
}

/**
 * 获取默认产品数据
 */
function getDefaultProduct(keyword) {
  return {
    title: `${keyword} - Premium Quality`,
    subtitle: "Best Value for Money",
    description: `<h2>${keyword}</h2>
<p>High-quality ${keyword} for everyday use. Premium materials and excellent craftsmanship.</p>

<h3>Features:</h3>
<ul>
<li>✅ Premium quality</li>
<li>✅ Durable construction</li>
<li>✅ Great value</li>
<li>✅ Fast shipping</li>
</ul>`,
    price: "29.99",
    tags: [keyword, "premium", "bestseller"],
    video_script: {
      hook: `🔥 你需要${keyword}吗?`,
      problem: "质量差、不耐用",
      solution: `优质${keyword}，性价比之王`,
      benefits: "✅ 优质材料\n✅ 耐用持久\n✅ 限时优惠",
      cta: "点击购买，限时特价!"
    }
  };
}

/**
 * 生成完整内容
 */
function generateProductContent(keyword) {
  const data = getProductData(keyword);
  const fallbackImage = getFallbackImage(keyword);
  
  return {
    ...data,
    imageUrl: fallbackImage,
    keyword
  };
}

/**
 * 获取备用图片
 */
function getFallbackImage(keyword) {
  const images = {
    kitchen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    knife: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800',
    air: 'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=800',
    fryer: 'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=800',
    blender: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800',
    camping: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    chair: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    dog: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    pet: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    yoga: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
    mat: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
    bottle: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
    water: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
    phone: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800',
    stand: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800',
    plant: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800',
    pot: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800',
    fitness: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    tracker: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
    watch: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
  };
  
  const key = keyword.toLowerCase();
  for (const [kw, url] of Object.entries(images)) {
    if (key.includes(kw)) return url;
  }
  
  return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800';
}

module.exports = { getProductData, getDefaultProduct, generateProductContent, getFallbackImage };
