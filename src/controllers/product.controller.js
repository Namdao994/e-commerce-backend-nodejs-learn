const {SuccessResponse} = require('../core/success.response');
const ProductService = require('../services/product.service');

class ProductController {
  static createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Product success',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  static publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Product success',
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  //Query

  /**
   * @description Get all Draft for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */

  static getAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list draft success',
      metadata: await ProductService.findAllDraftForShop({product_shop: req.user.userId}),
    }).send(res);
  };
  //End Query

  static getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list draft success',
      metadata: await ProductService.findAllPublishForShop({product_shop: req.user.userId}),
    }).send(res);
  };

  static getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Search success',
      metadata: await ProductService.searchProducts({
        keySearch: req.params.keySearch,
      }),
    }).send(res);
  };
}

module.exports = ProductController;
