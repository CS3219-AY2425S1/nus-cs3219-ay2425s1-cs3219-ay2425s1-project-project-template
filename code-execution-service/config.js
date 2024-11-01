const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  PORT: process.env.CODEX_PORT || 8050,
  USER_JWT_SECRET: process.env.USER_JWT_SECRET
}