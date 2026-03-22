'use strict';

const {Created, OK, SuccessResponse} = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
  handlerRefreshToken = async (req, res) => {
    new SuccessResponse({
      message: 'Get token success',
      metadata: await AccessService.handlerRefreshToken(req.body.refreshToken),
    }).send(res);
  };
  logout = async (req, res) => {
    new SuccessResponse({
      message: 'Logout success',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
  login = async (req, res) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res) => {
    // console.log(`[P]::signUp::`, req.body);
    new Created({
      message: 'Registered OK',
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new AccessController();
