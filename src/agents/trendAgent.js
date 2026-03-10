/**
 * EcomFlow MVP - Trend Agent
 * 趋势发现 - 避免重复关键词
 */

const axios = require("axios");

// 大量关键词库，避免重复
const ALL_KEYWORDS = [
  // Kitchen
  "kitchen organizer", "spice rack", "cutting board", "food storage container",
  "kettle", "coffee maker", "blender", "air fryer", "toaster", "microwave plate",
  "kitchen scale", "measuring cups", "cooking pot", "frying pan", "kitchen knife set",
  // Home
  "storage box", "closet organizer", "drawer divider", "wall shelf", " shoe rack",
  "laundry basket", "bathroom organizer", "mirror with lights", "vanity mirror",
  "bed risers", "curtain rod", "door hook", "wall clock", "lamp shade",
  // Outdoor
  "camping tent", "sleeping bag", "camp chair", "outdoor lantern", "hiking backpack",
  "water bottle", "compass", " GPS", "binoculars", "fishing gear", "outdoor mat",
  // Pet
  "dog bed", "cat tree", "pet carrier", "dog toy", "cat litter box", "pet feeder",
  "dog collar", "pet brush", "pet bowl", "aquarium filter", "fish tank", "bird cage",
  // Fitness
  "yoga mat", "resistance bands", "dumbbell", "kettlebell", "jump rope", "gym bag",
  "workout bench", "pull up bar", "fitness tracker", "foam roller", "exercise ball",
  // Beauty
  "makeup mirror", "hair dryer", "straightener", "curling iron", "skincare device",
  "nail polish", "perfume", "face mask", "sunscreen", "moisturizer",
  // Tech
  "phone charger", "wireless earbuds", "smart watch", "Bluetooth speaker", "USB hub",
  "power bank", "laptop stand", "keyboard", "mouse pad", "webcam",
  // Garden
  "plant pot", "garden tools", "watering can", "seed starter", "outdoor planter",
  "garden hose", "sprinkler", "gnome", "garden fence", "composter"
];

/**
 * 获取趋势关键词 - 随机+去重
 */
async function getTrends() {
  // 随机打乱并选择
  const shuffled = [...ALL_KEYWORDS].sort(() => Math.random() - 0.5);
  
  // 选择3-5个
  const count = Math.floor(Math.random() * 3) + 3;
  const selected = shuffled.slice(0, count);

  console.log(`📊 Trends selected: ${selected.join(", ")}`);
  return selected;
}

/**
 * 后续升级：真实趋势抓取
 */
async function getRealTrends() {
  // TODO: 接入真实数据源
  return [];
}

module.exports = { getTrends, getRealTrends };
