@echo off
REM EcomFlow Pro 一键部署脚本 (Windows)
REM 使用方法：双击运行 或 cmd /c deploy.bat

echo ==========================================
echo    EcomFlow Pro 一键部署脚本 (Windows)
echo ==========================================

REM 检查Docker
echo [1/5] 检查Docker环境...
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Docker未安装，请先安装Docker Desktop
    pause
    exit /b 1
)
echo ✅ Docker已安装

REM 检查Docker Compose
echo [2/5] 检查Docker Compose...
docker compose version >nul 2>nul
if %errorlevel% neq 0 (
    docker-compose --version >nul 2>nul
    if %errorlevel% neq 0 (
        echo ❌ Docker Compose未安装
        pause
        exit /b 1
    )
    set COMPOSE=docker-compose
) else (
    set COMPOSE=docker compose
)
echo ✅ Docker Compose已安装

REM 检查环境配置
echo [3/5] 检查环境配置...
if not exist .env (
    if exist .env.example (
        copy .env.example .env
        echo ✅ 已创建 .env 配置文件，请编辑填入API密钥
    ) else (
        echo ⚠️ 请手动创建 .env 文件
    )
) else (
    echo ✅ .env 配置文件已存在
)

REM 构建并启动
echo [4/5] 构建并启动服务...
%COMPOSE% build
%COMPOSE% up -d
if %errorlevel% neq 0 (
    echo ❌ 启动失败
    pause
    exit /b 1
)
echo ✅ 服务已启动

REM 显示状态
echo [5/5] 服务状态...
%COMPOSE% ps

echo.
echo ==========================================
echo    🎉 部署完成！
echo ==========================================
echo.
echo 访问地址：http://localhost:3000
echo.
echo 常用命令：
echo   - 查看日志: docker-compose logs -f
echo   - 停止服务: docker-compose down
echo   - 重启服务: docker-compose restart
echo.

pause
