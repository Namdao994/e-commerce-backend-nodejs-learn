'use strict';
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const KeyTokenService = require('./keyToken.service');
const {createTokenPair, verifyJWT} = require('../auth/authUtils');
const {getInfoData} = require('../utils');
const {BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError} = require('../core/error.response');
const {findByEmail} = require('./shop.service');
const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};
class AccessService {
  /**
   *  check this token used?
   */
  static handlerRefreshToken = async (refreshToken) => {
    // check xem token nay da duoc su dung chua
    const foundedToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    // neu co
    if (foundedToken) {
      //decode xem may la thg nao
      const {userId, email} = verifyJWT(refreshToken, foundedToken.privateKey);
      console.log('[1]  ', {userId, email});
      // xoa tat ca token trong keyStore
      await KeyTokenService.deleteKeyById(foundedToken._id);
      throw new ForbiddenError('Something went wrong !! Please login again');
    }

    // neu nhu chua co
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new AuthFailureError('Shop not registered');
    }

    // verify token
    const {userId, email} = verifyJWT(refreshToken, holderToken.privateKey);
    console.log('[2]   ', {userId, email});
    // check userId
    const foundedShop = await findByEmail({email});

    if (!foundedShop) {
      throw new AuthFailureError('Shop not registered');
    }

    // Create 1 cap moi
    const tokens = await createTokenPair({userId, email}, holderToken.publicKey, holderToken.privateKey);

    //update token

    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user: {userId, email},
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeTokenById(keyStore._id);
    console.log({delKey});
    return delKey;
  };

  /**
   * 1 - check email in dbs
   * 2 - match password
   * 3 - Create AT vs RT and save
   * 4 - generate tokens
   * 5 - get data return login
   */
  static login = async ({email, password, refreshToken = null}) => {
    //1
    const foundedShop = await findByEmail({email});
    if (!foundedShop) {
      throw new BadRequestError('Shop not registered');
    }
    //2
    const match = bcrypt.compare(password, foundedShop.password);
    if (!match) {
      throw new AuthFailureError('Authentication Error');
    }
    //3
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');
    //4
    const {_id: userId} = foundedShop;
    const tokens = await createTokenPair({userId, email}, publicKey, privateKey);
    await KeyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      publicKey,
      privateKey,
    });
    return {
      shop: getInfoData({fields: ['_id', 'name', 'email'], object: foundedShop}),
      tokens,
    };
  };

  static signUp = async ({name, email, password}) => {
    //step 1: check email exists?
    const holderShop = await shopModel.findOne({email}).lean();

    if (holderShop) {
      throw new BadRequestError('Error: Shop already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // created privateKey, publicKey
      // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      //   privateKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      // });
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');
      console.log({privateKey, publicKey}); // save collection Keystore

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        return {
          code: 'xxxx',
          message: 'keyStore error',
        };
      }
      //created token pair
      const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey);
      console.log(`Created Token success::`, tokens);
      return {
        code: 201,
        metadata: {
          shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
