# EcomFlow 启动指南

## 1. 创建GitHub仓库

### 方式A: 使用GitHub Token (推荐)
```bash
# 设置Token
export GITHUB_TOKEN=your_github_personal_access_token

# 运行创建脚本
cd ecommerce_factory
npm run github:create
```

### 方式B: 手动创建
1. 打开 https://github.com/new
2. Repository name: `ecomflow`
3. Description: `AI Ecommerce Super Factory`
4. Public: ✓
5. Create repository
6. 运行:
```bash
cd ecommerce_factory
git remote add origin https://github.com/dunyuzoush-ch/ecomflow.git
git push -u origin master
```

## 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 填入你的API keys
```

## 3. 安装依赖

```bash
npm install
```

## 4. 运行测试

```bash
npm test
```

## 5. 启动每日流水线

```bash
npm run daily
```

## 自动化

设置GitHub Token后，可以自动化部署:
```bash
# 每天自动commit + push
npm run github:commit "Daily update"
npm run github:push
```

---

**GitHub Token获取:**
1. 打开 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 创建并复制token
