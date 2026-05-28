import express from 'express';
import cors from 'cors';
import config from './src/config/index.js';
import { connectToMongoDB } from './src/database/mongo/index.js';
import eventoRoutes from './src/routes/routes.js';

// express
const app = express();
app.use(cors());
app.use(express.json());

// Ligar a base dados
await connectToMongoDB();

// Rotas da API
app.use('/api/eventos', eventoRoutes);

// Teste api
app.get('/', (req, res) => {
  res.send('API a funcionar com ES Modules e MongoDB!');
});

// listen config para port (5000)
app.listen(config.port, () => {
  console.log(`Servidor do CACA a correr em http://localhost:${config.port}`);
});