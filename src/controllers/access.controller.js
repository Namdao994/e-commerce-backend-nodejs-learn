'use strict';

const {Created, OK} = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
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
