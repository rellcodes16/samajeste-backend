const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './.env' });

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

if (!global._mongooseConnection) {
  global._mongooseConnection = mongoose.connect(DB)
    .then(() => console.log('DB connected'))
    .catch(err => console.error('DB connection error:', err));
}

module.exports = app;
