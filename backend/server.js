const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Importa as rotas de autenticação (registo, login, perfil)
const authRoutes = require('./routes/auth');

const app = express();

// Permite pedidos de outras origens (ex: React na porta 3000)
app.use(cors());

// Permite receber JSON no corpo dos pedidos
app.use(express.json());

// Ligação ao MongoDB Atlas usando a variável de ambiente MONGODB_URI
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB ligado com sucesso.'))
  .catch(err => console.error('Erro ao ligar ao MongoDB:', err));

// Todas as rotas de autenticação ficam disponíveis em /api/auth
// Exemplos: POST /api/auth/register, POST /api/auth/login
app.use('/api/auth', authRoutes);

// Rota base para verificar se o servidor está a funcionar
app.get('/', (req, res) => {
  res.send('API a funcionar!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});