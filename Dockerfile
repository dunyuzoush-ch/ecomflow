FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 安装依赖
RUN apk add --no-cache curl

# 复制项目文件
COPY package*.json ./
COPY services/ ./services/
COPY agents/ ./agents/
COPY skills/ ./skills/
COPY workflows/ ./workflows/
COPY database/ ./database/
COPY docs/ ./docs/

# 安装Node.js依赖
RUN npm install --production

# 创建必要的目录
RUN mkdir -p /app/data /app/logs

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# 启动命令
CMD ["node", "index.js"]
