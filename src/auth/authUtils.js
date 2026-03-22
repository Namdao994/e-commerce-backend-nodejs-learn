'use strict';

const JWT = require('jsonwebtoken');
const {asyncHandler} = require('../helpers/asyncHandler');
const {AuthFailureError, NotFoundError} = require('../core/error.response');
const KeyTokenService = require('../services/keyToken.service');

const HEADERS = {
  API_KEY: 'x-api-key',
  X_CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days',
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days',
    });
    //

    return {accessToken, refreshToken};
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  /**
   * 1 - Check userId missing?
   * 2 - get accessToken
   * 3 - verifyToken
   * 4 - check User in db
   * 5 - check keystore with this userId
   * 6 - ok all - return next()
   */
  const userId = req.headers[HEADERS.X_CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError('Invalid Request');
  }

  //2
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError('Not found keystore');
  }

  // 3
  const accessToken = req.headers[HEADERS.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError('Invalid Request');
  }
  const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
  console.log('decodeUser', decodeUser);
  if (userId !== decodeUser.userId) {
    throw new AuthFailureError('Invalid userId');
  }
  req.keyStore = keyStore;
  return next();
});

const verifyJWT = (token, keySecret) => {
  return JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
