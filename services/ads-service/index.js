/**
 * Ads Service - 自动广告投放系统
 * 支持：Meta Ads, TikTok Ads, Google Ads
 * 
 * 功能：
 * - 生成广告创意
 * - 启动测试广告
 * - 跟踪ROAS
 * - 自动扩量/暂停
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 配置文件
const CONFIG = {
  meta: {
    accessToken: process.env.META_ACCESS_TOKEN,
    adAccountId: process.env.META_AD_ACCOUNT_ID,
    pixelId: process.env.META_PIXEL_ID
  },
  tiktok: {
    advertiserId: process.env.TIKTOK_ADVERTISER_ID,
    accessToken: process.env.TIKTOK_ACCESS_TOKEN
  },
  google: {
    customerId: process.env.GOOGLE_CUSTOMER_ID,
    developerToken: process.env.GOOGLE_DEVELOPER_TOKEN
  },
  rules: {
    minRoas: 2.0,        // 最小ROAS，低于此值暂停
    scaleRoas: 3.0,     // 达到此ROAS扩量
    scaleMultiplier: 1.5 // 扩量倍数
  }
};

/**
 * 广告创意生成器
 * @param {Object} product - 产品数据
 * @returns {Object} 广告创意
 */
async function generateAdCreatives(product) {
  const { title, description, images, price } = product;
  
  // 生成多种广告变体
  const creatives = [
    {
      headline: `${title} - Limited Time Deal`,
      description: `Get this amazing ${title} for just $${price}. Free shipping!`,
      image: images[0],
      cta: 'SHOP_NOW'
    },
    {
      headline: `🔥 Hot ${title} - Don't Miss Out`,
      description: description.substring(0, 100) + '...',
      image: images[0] || images[1],
      cta: 'LEARN_MORE'
    },
    {
      headline: `${title} - Best Value`,
      description: `Premium quality ${title} at an unbeatable price.`,
      image: images[1] || images[0],
      cta: 'SHOP_NOW'
    }
  ];
  
  return creatives;
}

/**
 * Meta Ads 发布
 * @param {Object} campaign - 活动数据
 */
async function createMetaCampaign(campaign) {
  const { name, creative, audience, budget } = campaign;
  
  try {
    // 1. 创建广告系列
    const campaignResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${CONFIG.meta.adAccountId}/campaigns`,
      {
        name,
        objective: 'CONVERSIONS',
        status: 'PAUSED',
        daily_budget: budget
      },
      {
        headers: {
          'Authorization': `Bearer ${CONFIG.meta.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const campaignId = campaignResponse.data.id;
    
    // 2. 创建广告组
    const adsetResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${CONFIG.meta.adAccountId}/adsets`,
      {
        name: `${name}-AdSet`,
        campaign_id: campaignId,
        targeting: audience,
        status: 'PAUSED',
        daily_budget: budget
      },
      {
        headers: {
          'Authorization': `Bearer ${CONFIG.meta.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const adsetId = adsetResponse.data.id;
    
    // 3. 创建广告
    const adResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${CONFIG.meta.adAccountId}/ads`,
      {
        name: `${name}-Ad`,
        adset_id: adsetId,
        creative: {
          name: `${name}-Creative`,
          object_story_spec: {
            link_data: {
              message: creative.description,
              link: `https://${process.env.SHOP_DOMAIN}/products/${campaign.productHandle}`,
              image_url: creative.image,
              call_to_action: {
                type: creative.cta,
                value: {
                  link: `https://${process.env.SHOP_DOMAIN}/products/${campaign.productHandle}`
                }
              }
            }
          }
        },
        status: 'PAUSED'
      },
      {
        headers: {
          'Authorization': `Bearer ${CONFIG.meta.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`✅ Meta Ad created: ${adResponse.data.id}`);
    return { campaignId, adsetId, adId: adResponse.data.id };
    
  } catch (error) {
    console.error('❌ Meta Ads Error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * TikTok Ads 发布
 * @param {Object} campaign - 活动数据
 */
async function createTikTokCampaign(campaign) {
  const { name, creative, budget } = campaign;
  
  try {
    // 创建广告系列
    const response = await axios.post(
      'https://business-api.tiktok.com/open_api/v1.3/campaign/create/',
      {
        advertiser_id: CONFIG.tiktok.advertiserId,
        campaign_name: name,
        objective: 'CONVERSION',
        budget_mode: 'DAILY',
        budget: budget * 100, // 转成分
        status: 'PAUSE'
      },
      {
        headers: {
          'Access-Token': CONFIG.tiktok.accessToken,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const campaignId = response.data.data.campaign_id;
    
    // 创建广告组
    const adGroupResponse = await axios.post(
      'https://business-api.tiktok.com/open_api/v1.3/ad_group/create/',
      {
        advertiser_id: CONFIG.tiktok.advertiserId,
        campaign_id: campaignId,
        ad_group_name: `${name}-Group`,
        placement: ['TIKTOK'],
        budget_mode: 'DAILY',
        budget: budget * 100,
        status: 'PAUSE'
      },
      {
        headers: {
          'Access-Token': CONFIG.tiktok.accessToken,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const adGroupId = adGroupResponse.data.data.ad_group_id;
    
    // 创建广告
    await axios.post(
      'https://business-api.tiktok.com/open_api/v1.3/ad/create/',
      {
        advertiser_id: CONFIG.tiktok.advertiserId,
        ad_group_id: adGroupId,
        ad_name: `${name}-Ad`,
        creatives: [{
          video_id: creative.videoId,
          title: creative.headline.substring(0, 100),
          description: creative.description
        }],
        status: 'PAUSE'
      },
      {
        headers: {
          'Access-Token': CONFIG.tiktok.accessToken,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`✅ TikTok Ad created: ${campaignId}`);
    return { campaignId, adGroupId };
    
  } catch (error) {
    console.error('❌ TikTok Ads Error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Google Ads 发布
 * @param {Object} campaign - 活动数据
 */
async function createGoogleCampaign(campaign) {
  const { name, creative, keywords, budget } = campaign;
  
  console.log(`📢 Creating Google Campaign: ${name}`);
  console.log(`   Budget: $${budget}/day`);
  console.log(`   Keywords: ${keywords.join(', ')}`);
  
  // Google Ads API 集成需要 service account 认证
  // 这里简化处理，实际部署需要完整实现
  console.log('⚠️ Google Ads API integration requires service account setup');
  
  return { status: 'SIMULATED', name };
}

/**
 * 获取广告效果数据
 * @param {string} platform - 平台 (meta/tiktok/google)
 * @param {string} adId - 广告ID
 */
async function getAdPerformance(platform, adId) {
  try {
    let metrics = {};
    
    switch (platform) {
      case 'meta':
        const metaInsights = await axios.get(
          `https://graph.facebook.com/v18.0/${adId}/insights`,
          {
            params: {
              fields: 'spend,impressions,clicks,conversions,ctr,cpc',
              access_token: CONFIG.meta.accessToken
            }
          }
        );
        metrics = metaInsights.data.data[0] || {};
        break;
        
      case 'tiktok':
        const tiktokReport = await axios.post(
          'https://business-api.tiktok.com/open_api/v1.3/report/ad/',
          {
            advertiser_id: CONFIG.tiktok.advertiserId,
            campaign_ids: [adId],
            fields: ['spend', 'impressions', 'clicks', 'conversions']
          },
          {
            headers: {
              'Access-Token': CONFIG.tiktok.accessToken,
              'Content-Type': 'application/json'
            }
          }
        );
        metrics = tiktokReport.data.data[0] || {};
        break;
    }
    
    // 计算ROAS
    const spend = parseFloat(metrics.spend || 0);
    const conversions = parseInt(metrics.conversions || 0);
    const revenue = conversions * 40; // 假设平均订单$40
    
    metrics.roas = spend > 0 ? revenue / spend : 0;
    
    return metrics;
    
  } catch (error) {
    console.error('❌ Get Performance Error:', error.message);
    return { roas: 0, spend: 0, conversions: 0 };
  }
}

/**
 * 自动优化广告
 * @param {Array} campaigns - 活动列表
 */
async function optimizeAds(campaigns) {
  const results = [];
  
  for (const campaign of campaigns) {
    const metrics = await getAdPerformance(campaign.platform, campaign.adId);
    
    const { roas, spend } = metrics;
    
    if (spend < 10) {
      // 花费太少，跳过
      results.push({ ...campaign, action: 'WAIT', reason: 'Low spend' });
      continue;
    }
    
    if (roas >= CONFIG.rules.scaleRoas) {
      // ROAS优秀，扩量
      results.push({ 
        ...campaign, 
        action: 'SCALE', 
        reason: `ROAS ${roas.toFixed(2)} >= ${CONFIG.rules.scaleRoas}`,
        newBudget: spend * CONFIG.rules.scaleMultiplier 
      });
      
      // 调用API扩量
      await scaleAdBudget(campaign, spend * CONFIG.rules.scaleMultiplier);
      
    } else if (roas < CONFIG.rules.minRoas) {
      // ROAS太低，暂停
      results.push({ 
        ...campaign, 
        action: 'PAUSE', 
        reason: `ROAS ${roas.toFixed(2)} < ${CONFIG.rules.minRoas}`
      });
      
      // 调用API暂停
      await pauseAd(campaign);
      
    } else {
      // 继续观察
      results.push({ 
        ...campaign, 
        action: 'KEEP', 
        reason: `${CONFIG.rules.minRoas} <= ROAS <= ${CONFIG.rules.scaleRoas}`
      });
    }
  }
  
  return results;
}

/**
 * 扩量广告预算
 */
async function scaleAdBudget(campaign, newBudget) {
  console.log(`📈 Scaling ${campaign.name} budget to $${newBudget.toFixed(2)}`);
  // 实际API调用略
}

/**
 * 暂停广告
 */
async function pauseAd(campaign) {
  console.log(`⏸ Pausing ${campaign.name}`);
  // 实际API调用略
}

/**
 * 启动测试广告流程
 * @param {Object} product - 产品数据
 */
async function launchTestAds(product) {
  console.log(`\n🚀 Launching test ads for: ${product.title}`);
  
  const creatives = await generateAdCreatives(product);
  const results = [];
  
  // 为每个平台创建测试广告
  const platforms = ['meta', 'tiktok', 'google'];
  
  for (const platform of platforms) {
    const campaign = {
      name: `${product.title}-${platform}-test`,
      productHandle: product.handle,
      creative: creatives[0],
      audience: product.targeting || {},
      budget: 10, // 每天$10测试
      platform
    };
    
    try {
      let result;
      switch (platform) {
        case 'meta':
          result = await createMetaCampaign(campaign);
          break;
        case 'tiktok':
          result = await createTikTokCampaign(campaign);
          break;
        case 'google':
          result = await createGoogleCampaign(campaign);
          break;
      }
      
      results.push({
        platform,
        ...result,
        status: 'ACTIVE'
      });
      
    } catch (error) {
      console.error(`❌ Failed to create ${platform} ad:`, error.message);
    }
  }
  
  return results;
}

/**
 * 主函数：每日广告任务
 */
async function runDailyAdsTask() {
  console.log('\n📊 Starting Daily Ads Task...\n');
  
  // 1. 读取待推广产品
  const productsPath = path.join(__dirname, '../../data/products-to-promote.json');
  let products = [];
  
  if (fs.existsSync(productsPath)) {
    products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
  }
  
  if (products.length === 0) {
    console.log('📝 No products to promote. Run product_agent first.');
    return;
  }
  
  // 2. 为每个产品启动测试广告
  const newAds = [];
  for (const product of products.slice(0, 5)) { // 每天最多5个
    const ads = await launchTestAds(product);
    newAds.push(...ads);
  }
  
  // 3. 优化现有广告
  const existingAdsPath = path.join(__dirname, '../../data/active-ads.json');
  let existingAds = [];
  
  if (fs.existsSync(existingAdsPath)) {
    existingAds = JSON.parse(fs.readFileSync(existingAdsPath, 'utf-8'));
  }
  
  const optimizationResults = await optimizeAds(existingAds);
  
  // 4. 保存结果
  const output = {
    timestamp: new Date().toISOString(),
    newAds,
    optimizationResults
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../../data/ads-report.json'),
    JSON.stringify(output, null, 2)
  );
  
  console.log('\n✅ Daily Ads Task Complete!');
  console.log(`   New Ads: ${newAds.length}`);
  console.log(`   Optimized: ${optimizationResults.length}`);
  
  return output;
}

// 导出模块
module.exports = {
  CONFIG,
  generateAdCreatives,
  createMetaCampaign,
  createTikTokCampaign,
  createGoogleCampaign,
  getAdPerformance,
  optimizeAds,
  launchTestAds,
  runDailyAdsTask
};

// 如果直接运行
if (require.main === module) {
  runDailyAdsTask().catch(console.error);
}
