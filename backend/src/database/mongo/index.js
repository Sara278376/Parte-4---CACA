import config from '../../config/index.js';
import mongoose from 'mongoose';

async function connectToMongoDB() {
  console.log('Connecting to MongoDB...');
  
  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
  });
  
  return mongoose.connect(config.mongodbUri);
}

function disconnectFromMongoDB() {
  console.log('Disconnecting from MongoDB...');
  mongoose.disconnect();
}

export { connectToMongoDB, disconnectFromMongoDB };