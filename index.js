/**
 * EcomFlow Pro MVP
 * AI电商自动化 - 最小可运行版本
 */

require("dotenv").config();

const { runDaily } = require("./src/jobs/dailyJob");

/**
 * EcomFlow MVP 启动
 */
async function start() {
  console.log(`
╔═══════════════════════════════════════╗
║     EcomFlow Pro MVP - Starting...    ║
╚═══════════════════════════════════════╝
  `);

  try {
    await runDaily();
    console.log("\n🎉 All tasks completed!");
    process.exit(0);
  } catch (error) {
    console.error("\n💥 Error:", error);
    process.exit(1);
  }
}

// 运行
start();
