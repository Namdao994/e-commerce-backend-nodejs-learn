'use strict';

// level 0
// const config = {
//   app: {
//     port: 3000,
//   },
//   db: {
//     host: 'mongodb+srv',
//     port: 'AXKWp5JICF6S50fW@cluster0.xq6wy72.mongodb.net/?appName=Cluster0',
//     name: 'namdao994_db_user',
//   },
// };

//level 1

const dev = {
  app: {
    port: process.env.DEV_APP_PORT,
  },
  db: {
    host: process.env.DEV_APP_PORT,
    port: process.env.DEV_DB_PORT,
    name: process.env.DEV_DB_NAME,
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3000,
  },
  db: {
    host: process.env.PRO_DB_HORT,
    port: process.env.PRO_DB_PORT,
    name: process.env.PRO_DB_NAME,
  },
};

const config = {dev, pro};
const env = process.env.NODE_ENV || 'dev';

module.exports = config[env];
