const express = require('express');
const {authentication} = require('../../auth/authUtils');
const {asyncHandler} = require('../../helpers/asyncHandler');
const ProductController = require('../../controllers/product.controller');
const router = express.Router();

router.post('/search/:keySearch', asyncHandler(ProductController.getListSearchProduct));
router.get('/', asyncHandler(ProductController.findAllProducts));
router.get('/:id', asyncHandler(ProductController.findProduct));

router.use(authentication);

router.post('/', asyncHandler(ProductController.createProduct));
router.post('/publish/:id', asyncHandler(ProductController.publishProductByShop));

//Query
router.get('/draft/all', asyncHandler(ProductController.getAllDraftForShop));
router.get('/published/all', asyncHandler(ProductController.getAllPublishForShop));

module.exports = router;
