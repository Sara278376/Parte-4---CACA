import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/caca_db', //!! Falta definir chave
  jwtSecret: process.env.JWT_SECRET || 'chave_reserva_seguranca_caca' //!! Falta definir chave
};

export default config;