const { generateProductContent } = require('./src/services/productDatabase');

const result = generateProductContent('kitchen knife set');

console.log('=== 产品数据 ===');
console.log('标题:', result.title);
console.log('副标题:', result.subtitle);
console.log('价格:', result.price);
console.log('图片:', result.imageUrl);
console.log('\n=== 描述(前300字) ===');
console.log(result.description.substring(0, 300));
console.log('\n=== 视频脚本 ===');
console.log('Hook:', result.video_script.hook);
console.log('Problem:', result.video_script.problem);
console.log('CTA:', result.video_script.cta);
