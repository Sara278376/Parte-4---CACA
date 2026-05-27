import config from '../../config/index.js';
import mongoose from 'mongoose';

async function connectToMongoDB() {
  console.log('A ligar à base de dados MongoDB do CACA...');
  
  mongoose.connection.on('connected', () => {
    console.log('Conexão ao MongoDB estabelecida com sucesso.');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('Erro crítico na ligação ao MongoDB:', err);
  });
  
  return mongoose.connect(config.mongodbUri);
}

function disconnectFromMongoDB() {
  console.log('A desligar do MongoDB...');
  mongoose.disconnect();
}

export { connectToMongoDB, disconnectFromMongoDB };