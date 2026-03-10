/**
 * EcomFlow MVP - AI Service
 * OpenAI生成产品
 */

const axios = require("axios");

/**
 * AI生成产品数据
 */
async function generateProduct(keyword) {
  const prompt = `
Create a dropshipping product.

Keyword: ${keyword}

Return JSON:

{
  "title": "...",
  "description": "...",
  "price": "...",
  "tags": [...]
}
`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-5-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      }
    }
  );

  // 解析JSON响应
  const content = response.data.choices[0].message.content;
  return JSON.parse(content);
}

module.exports = { generateProduct };
