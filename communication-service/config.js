const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  PORT: process.env.COLLAB_PORT || 8443,
  SSL_KEY: process.env.COMM_SSL_KEY,
  SSL_CERT: process.env.COMM_SSL_CERT,
  USER_JWT_SECRET: process.env.USER_JWT_SECRET
};