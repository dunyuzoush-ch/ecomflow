/**
 * Agent通知系统
 * 自动同步店铺信息给所有协同agents
 */

require('dotenv').config();
const axios = require('axios');

// 通知配置
const AGENT_ENDPOINTS = {
  // Feishu webhook (如果有)
  feishu: process.env.FEISHU_WEBHOOK_URL || null,
  // 其他agent的回调地址
  agents: []
};

/**
 * 店铺状态变更通知
 */
async function notifyStoreUpdate(storeInfo) {
  const message = {
    type: 'store_update',
    timestamp: new Date().toISOString(),
    store: storeInfo,
    action: '店铺配置已更新'
  };
  
  console.log('📢 通知: 店铺配置已更新', storeInfo);
  
  // 可以扩展: 发送到Feishu/Discord/Slack等
  if (AGENT_ENDPOINTS.feishu) {
    try {
      await axios.post(AGENT_ENDPOINTS.feishu, message);
    } catch (e) {
      console.error('Feishu通知失败:', e.message);
    }
  }
  
  return message;
}

/**
 * 同步所有配置给指定agent
 */
async function syncToAgent(agentId, config) {
  const message = {
    type: 'config_sync',
    agentId,
    config,
    timestamp: new Date().toISOString()
  };
  
  console.log(`📢 同步配置给 agent: ${agentId}`);
  return message;
}

/**
 * 批量同步到所有相关系统
 */
async function broadcastUpdate(data) {
  const results = [];
  
  // 1. 通知主系统
  results.push({ target: 'main', ...await notifyStoreUpdate(data) });
  
  // 2. 可以扩展更多通知渠道
  // - Discord webhook
  // - Telegram bot
  // - Email
  
  return results;
}

module.exports = {
  notifyStoreUpdate,
  syncToAgent,
  broadcastUpdate
};
