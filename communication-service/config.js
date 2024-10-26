const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  SSL_KEY: process.env.COMM_SSL_KEY,
  SSL_CERT: process.env.COMM_SSL_CERT
};