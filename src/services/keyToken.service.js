'use strict';

const keyTokenModel = require('../models/keytoken.model');

class KeyTokenService {
  static createKeyToken = async ({userId, publicKey}) => {
    try {
      // toString là bởi vì publicKey là Buffer, lưu vào trong db sẽ bị lỗi vì không đúng kiểu dữ liệu
      const publicKeyString = publicKey.toString();
      const tokens = await keyTokenModel.create({
        user: userId,
        publicKey: publicKeyString,
      });
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
