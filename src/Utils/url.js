export default {
  getProductList: (path, rowIndex, pageSize) => `/Mock/Products/${path}.json?rowIndex=${rowIndex}&pageSize=${pageSize}`,
  getProductDetail: (id) => `/Mock/Product_Detail/${id}.json`,
  getShopById: (id) => `/Mock/Shops/${id}.json`,
  getPopularKeywords:() => '/Mock/Keywords/popular.json',
  getRelatedKeywords:(text) => `/Mock/Keywords/related.json?keyword=${text}`,
  getRelatedShops:(keyword) => `/Mock/Shops/related.json?keyword=${keyword}`,
  getOrders:() => `/Mock/orders/orders.json`
}