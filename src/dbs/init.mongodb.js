'use strict';

const {default: mongoose} = require('mongoose');
const {countConnect} = require('../helpers/check.connect');

const connectString = `mongodb+srv://namdao994_db_user:AXKWp5JICF6S50fW@cluster0.xq6wy72.mongodb.net/?appName=Cluster0`;

class Database {
  constructor() {
    this.connect();
  }
  //connect
  connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', {color: true});
    }
    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => {
        console.log(`Connected Mongodb Success PRO`);
        countConnect();
      })
      .catch((err) => {
        console.log(`Error Connect`);
        console.log(err);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
