/**
 * EcomFlow MVP - Ads Agent (完善版)
 * Meta/TikTok/Google 广告投放与优化
 * 
 * 环境变量配置:
 * - META_ACCESS_TOKEN: Meta Marketing API访问令牌
 * - META_AD_ACCOUNT_ID: Meta广告账户ID (格式: act_xxxxxxxxx)
 * - TIKTOK_ACCESS_TOKEN: TikTok广告访问令牌
 * - GOOGLE_CUSTOMER_ID: Google广告客户ID
 */

const axios = require("axios");

// API配置
const META_GRAPH_VERSION = 'v18.0';
const META_BASE_URL = `https://graph.facebook.com/${META_GRAPH_VERSION}`;

/**
 * 广告配置
 */
const AD_CONFIG = {
  meta: {
    budget: 10, // $10/day per ad
    objective: 'OUTCOME_TRAFFIC',
    status: 'PAUSED', // 默认暂停，上线后启用
    optimization_goal: 'LINK_CLICKS',
    billing_event: 'IMPRESSIONS',
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP'
  },
  tiktok: {
    budget: 10,
    objective: 'CONVERSION'
  },
  google: {
    budget: 10
  }
};

/**
 * Meta API 客户端
 */
class MetaAdsClient {
  constructor(accessToken, adAccountId) {
    this.accessToken = accessToken;
    this.adAccountId = adAccountId;
    this.baseUrl = META_BASE_URL;
  }

  async request(endpoint, method = 'GET', data = null) {
    const url = `${this.baseUrl}/${endpoint}`;
    const config = {
      method,
      url,
      params: { access_token: this.accessToken },
      headers: { 'Content-Type': 'application/json' }
    };
    if (data) config.data = data;
    
    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('Meta API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * 获取广告账户信息
   */
  async getAccountInfo() {
    return this.request(`act_${this.adAccountId}?fields=id,name,account_status,currency,timezone_name`.replace('act_${this.adAccountId}', `act_${this.adAccountId}`));
  }

  /**
   * 获取广告系列列表
   */
  async getCampaigns(params = {}) {
    const fields = 'id,name,status,objective,daily_budget,lifetime_budget,spend_cap';
    return this.request(`act_${this.adAccountId}/campaigns?fields=${fields}&${new URLSearchParams(params)}`);
  }

  /**
   * 创建广告系列 - 使用系列预算
   */
  async createCampaign(config) {
    const { name, objective = 'OUTCOME_SALES', status = 'PAUSED', dailyBudget = 10 } = config;
    
    const data = {
      name,
      objective,
      status,
      special_ad_categories: [],
      daily_budget: dailyBudget * 100
    };
    
    return this.request(`act_${this.adAccountId}/campaigns`, 'POST', data);
  }

  /**
   * 获取广告组列表
   */
  async getAdSets(params = {}) {
    const fields = 'id,name,status,campaign_id,daily_budget,lifetime_budget,targeting,bid_strategy';
    return this.request(`act_${this.adAccountId}/adsets?fields=${fields}&${new URLSearchParams(params)}`);
  }

  /**
   * 创建广告组 (Ad Set) - 需要设置billing和bid和targeting
   */
  async createAdSet(config) {
    const {
      campaignId,
      name,
      targeting = {},
      optimizationGoal = 'OFFSITE_CONVERSIONS'
    } = config;

    // 确保有基本的targeting - 使用正确的API格式
    const finalTargeting = {
      age_min: 25,
      age_max: 55,
      geo_locations: {
        countries: ['US'],
        location_types: ['home', 'recent']
      },
      targeting_automation: { advantage_audience: 0 }
    };

    const data = {
      name,
      campaign_id: campaignId,
      status: 'PAUSED',
      optimization_goal: optimizationGoal,
      billing_event: 'IMPRESSIONS',
      bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
      bid_amount: 100,
      targeting: JSON.stringify(finalTargeting)
    };

    return this.request(`act_${this.adAccountId}/adsets`, 'POST', data);
  }

  /**
   * 创建广告 (Ad)
   */
  async createAd(config) {
    const {
      adSetId,
      name,
      creative,
      status = 'PAUSED'
    } = config;

    const data = {
      name,
      adset_id: adSetId,
      status,
      creative: JSON.stringify({
        name: creative.name,
        object_story_spec: {
          link_data: {
            message: creative.description,
            link: creative.url,
            call_to_action: {
              type: creative.cta || 'SHOP_NOW',
              value: { link: creative.url }
            },
            image_hash: creative.imageHash
          }
        }
      })
    };

    return this.request(`act_${this.adAccountId}/ads`, 'POST', data);
  }

  /**
   * 上传图片获取 hash
   */
  async uploadImage(imageUrl) {
    return this.request(`act_${this.adAccountId}/adimages`, 'POST', {
      url: imageUrl,
      name: 'ad_image'
    });
  }

  /**
   * 获取广告效果报告
   */
  async getInsights(campaignIds, dateRange = 'last_30_days') {
    const fields = 'campaign_name,impressions,clicks,spend,cpc,ctr,conversion_rate,roas';
    const campaigns = campaignIds.join(',');
    return this.request(`insights?fields=${fields}&level=campaign&time_range=${dateRange}&filtering=[{field:'campaign.id','operator':'IN','value':[${campaigns}]}]`);
  }

  /**
   * 更新广告系列状态
   */
  async updateCampaignStatus(campaignId, status) {
    return this.request(`act_${this.adAccountId}/campaigns`, 'POST', {
      campaign_id: campaignId,
      status
    });
  }

  /**
   * 更新广告组预算
   */
  async updateAdSetBudget(adSetId, dailyBudget) {
    return this.request(`act_${this.adAccountId}/adsets`, 'POST', {
      adset_id: adSetId,
      daily_budget: dailyBudget * 100
    });
  }
}

/**
 * 获取 Meta Ads 客户端实例
 */
function getMetaAdsClient() {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const adAccountId = process.env.META_AD_ACCOUNT_ID;
  
  if (!accessToken || !adAccountId) {
    return null;
  }
  
  return new MetaAdsClient(accessToken, adAccountId);
}

/**
 * 生成广告创意
 */
function generateAdCreative(product, options = {}) {
  const { customHeadline, customDescription, cta } = options;
  
  return {
    name: `${product.title} - ${Date.now()}`,
    headline: customHeadline || `${product.title} - Best Price`,
    description: customDescription || `Shop ${product.title} at amazing price. Free shipping! Limited time offer.`,
    cta: cta || 'SHOP_NOW',
    url: `https://${process.env.SHOPIFY_STORE}/products/${product.handle}`,
    imageUrl: product.featuredImage || product.images?.[0]?.src
  };
}

/**
 * 生成受众定位 - 简化版
 */
function generateTargeting(product, options = {}) {
  const { 
    ageMin = 25, 
    ageMax = 55,
    locations = ['US']
  } = options;

  return {
    age_min: ageMin,
    age_max: ageMax,
    geo_locations: {
      countries: locations
    }
  };
}

/**
 * 启动Meta广告 - 完整流程
 */
async function launchMetaAd(product, options = {}) {
  const client = getMetaAdsClient();
  
  if (!client) {
    console.log('📊 Meta Ads: Not configured (simulated)');
    console.log('   需要配置: META_ACCESS_TOKEN, META_AD_ACCOUNT_ID');
    return { status: 'not_configured', platform: 'meta', product: product.title };
  }

  try {
    console.log(`📊 Meta: Launching ad for ${product.title}...`);
    
    const dailyBudget = options.budget || AD_CONFIG.meta.budget;
    
    // 1. 创建广告系列
    const campaign = await client.createCampaign({
      name: `EcomFlow - ${product.title} - ${Date.now()}`,
      objective: options.objective || AD_CONFIG.meta.objective,
      status: 'PAUSED',
      dailyBudget
    });
    console.log(`   ✓ Campaign created: ${campaign.id}`);

    // 2. 创建广告组
    const targeting = generateTargeting(product, options.targeting);
    const adSet = await client.createAdSet({
      campaignId: campaign.id,
      name: `${product.title} - AdSet`,
      dailyBudget,
      targeting,
      optimizationGoal: options.optimizationGoal || AD_CONFIG.meta.optimization_goal,
      billingEvent: AD_CONFIG.meta.billing_event,
      bidStrategy: AD_CONFIG.meta.bid_strategy
    });
    console.log(`   ✓ AdSet created: ${adSet.id}`);

    // 3. 生成创意
    const creative = generateAdCreative(product, options.creative);

    // 4. 上传图片并获取hash (如果有图片)
    let imageHash = null;
    if (creative.imageUrl) {
      try {
        const imageResult = await client.uploadImage(creative.imageUrl);
        imageHash = imageResult.images?.hash;
        console.log(`   ✓ Image uploaded: ${imageHash}`);
      } catch (err) {
        console.log(`   ⚠ Image upload failed, using fallback`);
      }
    }

    // 5. 创建广告
    const ad = await client.createAd({
      adSetId: adSet.id,
      name: creative.name,
      creative: {
        ...creative,
        imageHash
      },
      status: 'PAUSED'
    });
    console.log(`   ✓ Ad created: ${ad.id}`);

    return {
      status: 'created',
      platform: 'meta',
      product: product.title,
      campaignId: campaign.id,
      adSetId: adSet.id,
      adId: ad.id,
      budget: dailyBudget
    };

  } catch (error) {
    console.error(`📊 Meta: Failed to launch ad for ${product.title}`, error.message);
    return { status: 'error', platform: 'meta', product: product.title, error: error.message };
  }
}

/**
 * 启动TikTok广告
 */
async function launchTikTokAd(product) {
  if (!process.env.TIKTOK_ACCESS_TOKEN) {
    console.log('📊 TikTok Ads: Not configured (simulated)');
    console.log('   需要配置: TIKTOK_ACCESS_TOKEN');
    return { status: 'simulated', platform: 'tiktok', product: product.title };
  }
  
  console.log(`📊 TikTok: Would launch ad for ${product.title}`);
  return { status: 'simulated' };
}

/**
 * 启动Google广告
 */
async function launchGoogleAd(product) {
  if (!process.env.GOOGLE_CUSTOMER_ID) {
    console.log('📊 Google Ads: Not configured (simulated)');
    console.log('   需要配置: GOOGLE_CUSTOMER_ID');
    return { status: 'simulated', platform: 'google', product: product.title };
  }
  
  console.log(`📊 Google: Would launch ad for ${product.title}`);
  return { status: 'simulated' };
}

/**
 * 启动所有平台广告
 */
async function launchTestAds(product, options = {}) {
  const results = [];
  
  results.push(await launchMetaAd(product, options));
  results.push(await launchTikTokAd(product));
  results.push(await launchGoogleAd(product));
  
  return results;
}

/**
 * 优化广告（根据ROAS）
 */
async function optimizeAds(campaigns, metaClient = null) {
  const results = [];
  
  for (const campaign of campaigns) {
    // 模拟ROAS计算 - 实际应从API获取
    const roas = Math.random() * 4; // 0-4 模拟
    
    let action = 'KEEP';
    
    if (roas >= 3) {
      console.log(`📈 ${campaign.product}: ROAS ${roas.toFixed(2)} - Scale!`);
      action = 'SCALE';
      
      // 实际增加预算
      if (metaClient && campaign.adSetId) {
        const newBudget = campaign.budget * 1.5;
        await metaClient.updateAdSetBudget(campaign.adSetId, newBudget);
        console.log(`   → Budget increased to $${newBudget}/day`);
      }
    } else if (roas < 1.5) {
      console.log(`📉 ${campaign.product}: ROAS ${roas.toFixed(2)} - Pause!`);
      action = 'PAUSE';
      
      // 实际暂停广告
      if (metaClient && campaign.campaignId) {
        await metaClient.updateCampaignStatus(campaign.campaignId, 'PAUSED');
        console.log(`   → Campaign paused`);
      }
    } else {
      console.log(`📊 ${campaign.product}: ROAS ${roas.toFixed(2)} - Keep`);
    }
    
    results.push({ ...campaign, action, roas });
  }
  
  return results;
}

/**
 * 批量广告投放 - 为多个产品创建广告
 */
async function launchBatchAds(products, options = {}) {
  const results = [];
  const limit = options.limit || 3; // 默认每天最多3个产品
  
  const productsToAds = products.slice(0, limit);
  
  for (const product of productsToAds) {
    console.log(`\n🚀 Launching ads for: ${product.title}`);
    const result = await launchMetaAd(product, options);
    results.push(result);
    
    // 避免API限流
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}

/**
 * 检查广告账户状态
 */
async function checkAccountStatus() {
  const client = getMetaAdsClient();
  
  if (!client) {
    return {
      configured: false,
      message: 'Meta Ads not configured. Set META_ACCESS_TOKEN and META_AD_ACCOUNT_ID'
    };
  }
  
  try {
    const accountInfo = await client.getAccountInfo();
    return {
      configured: true,
      accountId: accountInfo.id,
      accountName: accountInfo.name,
      status: accountInfo.account_status,
      currency: accountInfo.currency,
      timezone: accountInfo.timezone_name
    };
  } catch (error) {
    return {
      configured: false,
      error: error.message
    };
  }
}

module.exports = { 
  generateAdCreative, 
  launchTestAds, 
  launchMetaAd, 
  launchTikTokAd, 
  launchGoogleAd,
  optimizeAds,
  launchBatchAds,
  checkAccountStatus,
  getMetaAdsClient,
  generateTargeting,
  MetaAdsClient,
  AD_CONFIG
};
