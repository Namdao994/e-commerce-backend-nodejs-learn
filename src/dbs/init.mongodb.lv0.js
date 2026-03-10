'use strict';

const {default: mongoose} = require('mongoose');

const connectString = `mongodb+srv://namdao994_db_user:AXKWp5JICF6S50fW@cluster0.xq6wy72.mongodb.net/?appName=Cluster0`;
mongoose
  .connect(connectString)
  .then((_) => console.log(`Connected Mongodb Success`))
  .catch((err) => console.log(`Error Connect`));

if (1 === 0) {
  mongoose.set('debug', true);
  mongoose.set('debug', {color: true});
}

module.exports = mongoose;
