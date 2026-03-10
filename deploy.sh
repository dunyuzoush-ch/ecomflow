#!/bin/bash
# EcomFlow Pro 一键部署脚本
# 适用于 Linux/VPS

set -e

echo "=========================================="
echo "   EcomFlow Pro 一键部署脚本"
echo "=========================================="

# 1. 检查Docker
echo "[1/6] 检查Docker环境..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker: https://docs.docker.com/get-docker/"
    exit 1
fi
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose未安装"
    exit 1
fi
echo "✅ Docker环境检查通过"

# 2. 检查Node.js
echo "[2/6] 检查Node.js环境..."
if ! command -v node &> /dev/null; then
    echo "⚠️ Node.js未安装，将使用Docker方式运行"
    USE_DOCKER_ONLY=true
else
    USE_DOCKER_ONLY=false
    NODE_VERSION=$(node -v)
    echo "✅ Node.js $NODE_VERSION"
fi

# 3. 创建环境配置文件
echo "[3/6] 配置环境变量..."
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ 已创建 .env 配置文件，请编辑并填入你的API密钥"
    else
        echo "⚠️ 未找到 .env.example，请手动创建 .env 文件"
    fi
else
    echo "✅ .env 配置文件已存在"
fi

# 4. 构建Docker镜像
echo "[4/6] 构建Docker镜像..."
docker-compose build
echo "✅ Docker镜像构建完成"

# 5. 启动服务
echo "[5/6] 启动EcomFlow服务..."
docker-compose up -d
echo "✅ 服务已启动"

# 6. 显示状态
echo "[6/6] 检查服务状态..."
sleep 3
docker-compose ps

echo ""
echo "=========================================="
echo "   🎉 部署完成！"
echo "=========================================="
echo ""
echo "访问地址："
echo "  - 本地: http://localhost:3000"
echo ""
echo "常用命令："
echo "  - 查看日志: docker-compose logs -f"
echo "  - 停止服务: docker-compose down"
echo "  - 重启服务: docker-compose restart"
echo "  - 运行任务: docker-compose exec ecomflow node index.js"
echo ""
