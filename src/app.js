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
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//init db
require('./dbs/init.mongodb');
const {checkOverload} = require('./helpers/check.connect');
// checkOverload();
//init route
app.use('/', require('./routes'));

//handling error

module.exports = app;
