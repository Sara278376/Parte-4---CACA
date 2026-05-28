import express from 'express';
import cors from 'cors';
import config from './src/config/index.js';
import { connectToMongoDB } from './src/database/mongo/index.js';
import eventoRoutes from './src/routes/routes.js';
import jwt from 'jsonwebtoken';

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

//!! MANUAL Token testing with JWT, remove when user login is configured
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'test@caca.pt' && password === 'caca2026') {
    const userPayload = {
      id: 999,
      email: email,
      role: 'admin'
    };

    const token = jwt.sign(userPayload, process.env.JWT_SECRET_KEY || 'gfg_jwt_secret_key', {
      expiresIn: '1h'
    });
    return res.json({ success: true, token: token });
  }
  return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
});




// listen config para port (5000)
app.listen(config.port, () => {
  console.log(`Servidor do CACA a correr em http://localhost:${config.port}`);
});