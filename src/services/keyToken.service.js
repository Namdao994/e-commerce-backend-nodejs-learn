'use strict';

const keyTokenModel = require('../models/keytoken.model');
const {Types} = require('mongoose');
class KeyTokenService {
  static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
    try {
      //lv1
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });
      // return tokens ? tokens.publicKey : null;

      //lv xxx

      const filter = {user: userId},
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = {upsert: true, returnDocument: 'after'};
      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({user: new Types.ObjectId(userId)}).lean();
  };

  static removeTokenById = async ({id}) => {
    const result = await keyTokenModel.deleteOne({
      _id: new Types.ObjectId(id),
    });
    return result;
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({refreshTokensUsed: refreshToken}).lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({refreshToken});
  };

  static deleteKeyById = async (id) => {
    return await keyTokenModel.findByIdAndDelete(id);
  };
}

module.exports = KeyTokenService;
