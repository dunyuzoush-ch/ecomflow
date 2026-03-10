#!/bin/bash
# EcomFlow Pro VPS远程部署脚本
# 使用方法: ./deploy-vps.sh

VPS_HOST="139.180.210.157"
VPS_USER="root"
VPS_PASS="Tangzou_79800616"
PROJECT_DIR="/opt/ecomflow"

echo "=========================================="
echo "   EcomFlow Pro VPS部署脚本"
echo "=========================================="

# 检查本地文件
echo "[1/4] 检查项目文件..."
if [ ! -f "docker-compose.yml" ] || [ ! -f "Dockerfile" ]; then
    echo "❌ 缺少必要文件"
    exit 1
fi
echo "✅ 项目文件检查通过"

# 创建远程目录
echo "[2/4] 创建远程目录..."
sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_HOST "mkdir -p $PROJECT_DIR"
echo "✅ 远程目录已创建"

# 同步文件
echo "[3/4] 同步文件到VPS..."
sshpass -p "$VPS_PASS" rsync -avz --exclude 'node_modules' --exclude '.git' \
    ./ $VPS_USER@$VPS_HOST:$PROJECT_DIR/
echo "✅ 文件同步完成"

# 远程执行部署
echo "[4/4] 在VPS上部署..."
sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_HOST << 'EOF'
    cd /opt/ecomflow
    
    # 检查并创建.env
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "⚠️ 请编辑 .env 填入API密钥"
    fi
    
    # 构建并启动
    docker-compose build
    docker-compose up -d
    
    echo "✅ VPS部署完成"
    docker-compose ps
EOF

echo ""
echo "=========================================="
echo "   🎉 VPS部署完成！"
echo "=========================================="
echo ""
echo "VPS地址: http://139.180.210.157:3000"
echo "SSH: root@139.180.210.157"
echo ""
