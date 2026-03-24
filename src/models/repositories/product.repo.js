'use strict';

const {Types} = require('mongoose');
const {product, clothing, electronic, furniture} = require('../product.model');
const {getSelectData, unGetSelectData} = require('../../utils');

const findAllDraftForShop = async ({query, limit, skip}) => {
  return await queryProduct({query, limit, skip});
};

const findAllPublishForShop = async ({query, limit, skip}) => {
  return await queryProduct({query, limit, skip});
};

const searchProductByUser = async ({keySearch}) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      {
        isPublished: true,
        $text: {$search: regexSearch},
      },
      {
        score: {$meta: 'textScore'},
      },
    )
    .sort({score: {$meta: 'textScore'}})
    .lean();
  return results;
};

const publishProductByShop = async ({product_shop, product_id}) => {
  const result = await product.updateOne(
    {
      product_shop: new Types.ObjectId(product_shop),
      _id: new Types.ObjectId(product_id),
    },
    {
      $set: {
        isDraft: false,
        isPublished: true,
      },
    },
  );

  return result.modifiedCount;
};
const unPublishProductByShop = async ({product_shop, product_id}) => {
  const result = await product.updateOne(
    {
      product_shop: new Types.ObjectId(product_shop),
      _id: new Types.ObjectId(product_id),
    },
    {
      $set: {
        isDraft: true,
        isPublished: false,
      },
    },
  );

  return result.modifiedCount;
};

const findAllProducts = async ({limit, sort, page, filter, select}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
  const products = await product.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select)).lean();
  return products;
};

const findProduct = async ({product_id, unSelect}) => {
  return await product.findById(product_id).select(unGetSelectData(unSelect));
};

const updateProductById = async ({product_id, bodyUpdate, model, isNew = true}) => {
  console.log('productId at repo', product_id);
  return await model.findByIdAndUpdate(product_id, bodyUpdate, {returnDocument: 'after'});
};

const queryProduct = async ({query, limit, skip}) => {
  return await product
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({
      updatedAt: -1,
    })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

module.exports = {
  findAllDraftForShop,
  publishProductByShop,
  unPublishProductByShop,
  findAllPublishForShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
};
