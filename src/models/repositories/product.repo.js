'use strict';

const {Types} = require('mongoose');
const {product, clothing, electronic, furniture} = require('../product.model');

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
};
