'use strict';

const keyTokenModel = require('../models/keytoken.model');

class KeyTokenService {
  static createKeyToken = async ({userId, publicKey, privateKey}) => {
    try {
      // toString là bởi vì publicKey là Buffer, lưu vào trong db sẽ bị lỗi vì không đúng kiểu dữ liệu
      const tokens = await keyTokenModel.create({
        user: userId,
        publicKey,
        privateKey,
      });
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
