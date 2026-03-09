/**
 * EcomFlow GitHub Automation
 * 自动创建GitHub仓库并push代码
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_NAME = 'ecomflow';
const REPO_DESC = 'AI Ecommerce Super Factory - Automated ecommerce system';
const USER = 'dunyuzoush-ch';

async function createGitHubRepo() {
  if (!GITHUB_TOKEN) {
    console.log('❌ 请设置 GITHUB_TOKEN 环境变量');
    console.log('   export GITHUB_TOKEN=your_github_token');
    console.log('');
    console.log('📋 手动创建步骤:');
    console.log('   1. 打开 https://github.com/new');
    console.log('   2. Repository name: ecomflow');
    console.log('   3. Public: ✓');
    console.log('   4. Create repository');
    console.log('   5. 运行: git remote add origin https://github.com/dunyuzoush-ch/ecomflow.git');
    console.log('   6. 运行: git push -u origin master');
    return;
  }

  console.log('🚀 Creating GitHub repository...');

  // 创建仓库API
  const createRepoCmd = `curl -s -X POST https://api.github.com/user/repos \
    -H "Authorization: token ${GITHUB_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"name":"${REPO_NAME}","description":"${REPO_DESC}","private":false,"auto_init":false}'`;

  try {
    execSync(createRepoCmd, { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    console.log('✅ Repository created!');
  } catch (e) {
    // 仓库可能已存在
    console.log('⚠️ Repository may already exist, continuing...');
  }

  // 添加remote
  try {
    execSync('git remote add origin https://github.com/' + USER + '/' + REPO_NAME + '.git', 
      { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
  } catch (e) {
    // remote可能已存在
  }

  // Push代码
  console.log('📤 Pushing code to GitHub...');
  try {
    execSync('git push -u origin master', 
      { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    console.log('✅ Code pushed successfully!');
    console.log('');
    console.log('🎉 仓库地址: https://github.com/' + USER + '/' + REPO_NAME);
  } catch (e) {
    console.log('❌ Push failed. 可能需要手动运行:');
    console.log('   git push -u origin master');
  }
}

createGitHubRepo();
