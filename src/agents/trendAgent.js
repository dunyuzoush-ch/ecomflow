/**
 * EcomFlow MVP - Trend Agent
 * 趋势发现
 */

/**
 * MVP版本：使用预设关键词
 * 后续可升级为真实抓取
 */
async function getTrends() {
  // 预设热门关键词列表
  const trends = [
    "camping gadget",
    "pet grooming tool",
    "kitchen slicer",
    "yoga accessories",
    "fitness equipment",
    "home organization",
    "outdoor gear",
    "smart home device"
  ];

  // 随机选择3-5个
  const count = Math.floor(Math.random() * 3) + 3;
  const selected = trends
    .sort(() => Math.random() - 0.5)
    .slice(0, count);

  console.log(`📊 Trends selected: ${selected.join(", ")}`);
  return selected;
}

/**
 * 后续升级：真实趋势抓取
 */
async function getRealTrends() {
  // TODO: 接入真实数据源
  // - TikTok trending
  // - Amazon bestsellers
  // - Pinterest trends
  return [];
}

module.exports = { getTrends, getRealTrends };
