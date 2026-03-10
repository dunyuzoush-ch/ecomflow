require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { generateProductContent } = require('./src/services/contentGenerator');

async function test() {
  console.log('🔄 测试内容生成...\n');
  
  const result = await generateProductContent('kitchen knife set');
  console.log('=== 生成结果 ===');
  console.log('标题:', result.title);
  console.log('价格:', result.price);
  console.log('描述:', result.description ? result.description.substring(0, 200) : 'N/A');
  console.log('图片:', result.imageUrl);
  console.log('\n=== 视频脚本 ===');
  if (result.videoScript) {
    console.log('Hook:', result.videoScript.hook);
    console.log('CTA:', result.videoScript.cta);
  }
}

test().catch(console.error);
