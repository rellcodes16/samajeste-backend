// // localServer.js
// const app = require('./app');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');

// dotenv.config();

// const DB = process.env.DATABASE;
// mongoose.connect(DB)
//   .then(() => console.log('DB connected'))
//   .catch((err) => console.error('DB connection error:', err));

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });


const mongoose = require('mongoose');

let isConnected;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  const db = await mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  isConnected = db.connections[0].readyState;
  console.log('New database connection established');
};

module.exports = connectDB;
