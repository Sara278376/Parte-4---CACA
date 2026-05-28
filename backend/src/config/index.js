import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/caca_db',
  jwtSecret: process.env.JWT_SECRET || 'gfg_jwt_secret_key'
};

export default config;