/**
 * EcomFlow MVP - Shopify Service
 * Shopify API集成 - 支持图片上传
 */

const axios = require("axios");

/**
 * 发布产品到Shopify
 */
async function publishProduct(product) {
  const url = `https://${process.env.SHOPIFY_STORE}/admin/api/2024-10/products.json`;

  const payload = {
    product: {
      title: product.title,
      body_html: product.description,
      vendor: "EcomFlow",
      status: "active",
      tags: product.tags || [],
      variants: [
        {
          price: product.price,
          sku: `SKU-${Date.now()}`,
          inventory_management: "shopify",
          inventory_quantity: 100
        }
      ]
    }
  };

  try {
    const res = await axios.post(url, payload, {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_TOKEN,
        "Content-Type": "application/json"
      }
    });

    const shopifyProduct = res.data.product;
    console.log(`✅ Product published: ${shopifyProduct.title}`);
    
    // 如果有图片，上传图片
    if (product.imageUrl) {
      await uploadProductImage(shopifyProduct.id, product.imageUrl);
    }
    
    return shopifyProduct;
  } catch (error) {
    console.error("❌ Shopify Error:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * 上传产品图片 - 直接使用URL
 */
async function uploadProductImage(productId, imageUrl) {
  try {
    const url = `https://${process.env.SHOPIFY_STORE}/admin/api/2024-10/products/${productId}/images.json`;
    
    await axios.post(url, {
      image: {
        src: imageUrl
      }
    }, {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_TOKEN,
        "Content-Type": "application/json"
      }
    });
    
    console.log(`   🖼️ Image uploaded successfully`);
  } catch (error) {
    console.log(`   ⚠️ Image upload failed: ${error.message}`);
  }
}

/**
 * 批量上传产品图片
 */
async function uploadMultipleImages(productId, imageUrls) {
  for (const url of imageUrls) {
    await uploadProductImage(productId, url);
  }
}

module.exports = { publishProduct, uploadProductImage, uploadMultipleImages };
