require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const app = express();

// console.log(`Process::`, process.env);

const {default: helmet} = require('helmet');
const compression = require('compression');
//init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
// app.use(morgan('combined'));
// app.use(morgan('common'));
// app.use(morgan('short'));
// app.use(morgan('tiny'));
//init db
require('./dbs/init.mongodb');
const {checkOverload} = require('./helpers/check.connect');
// checkOverload();
//init route
app.get('/', (req, res, next) => {
  const strCompress = 'Hello fantips';
  return res.status(200).json({
    message: 'welcome fantipsjs',
    metadata: strCompress.repeat(10000),
  });
});

//handling error

module.exports = app;
