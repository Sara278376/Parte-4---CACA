// ============================================================
// Endpoints disponíveis:
//   POST /api/auth/register — registo de novo utilizador
//   POST /api/auth/login    — login e obtenção de token JWT
//   GET  /api/auth/perfil   — ver perfil (requer token)
//   PUT  /api/auth/perfil   — editar perfil (requer token)
// ============================================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');   // Para fazer hash das passwords
const jwt = require('jsonwebtoken'); // Para gerar e verificar tokens JWT
const User = require('../models/User');

/**
 * Middleware de autenticação via JWT.
 * Usado nas rotas que precisam de utilizador autenticado (perfil).
 * Lê o token do cabeçalho Authorization: Bearer <token>
 * Se válido, adiciona os dados do utilizador ao objeto req.
 */
function autenticar(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrai o token após "Bearer "

  if (!token) return res.status(401).json({ erro: 'Token em falta.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, utilizador) => {
    if (err) return res.status(403).json({ erro: 'Token inválido.' });
    req.utilizador = utilizador; // Dados do utilizador ficam disponíveis na rota
    next();
  });
}

/**
 * POST /api/auth/register
 * Regista um novo utilizador.
 * - Valida campos obrigatórios
 * - Verifica se o email já existe
 * - Faz hash da password com bcrypt (salt 10)
 * - Guarda o utilizador na base de dados
 */
router.post('/register', async (req, res) => {
  try {
    const { nome, email, password, role } = req.body;

    // Validação dos campos obrigatórios
    if (!nome || !email || !password)
      return res.status(400).json({ erro: 'Nome, email e password são obrigatórios.' });

    // Verifica se já existe um utilizador com este email
    const existe = await User.findOne({ email });
    if (existe)
      return res.status(409).json({ erro: 'Email já registado.' });

    // Hash da password — nunca se guarda a password em texto simples
    const hash = await bcrypt.hash(password, 10);

    // Cria o novo utilizador (role só pode ser 'administrador' se explicitamente enviado)
    const novoUser = new User({
      nome,
      email,
      password: hash,
      role: role === 'administrador' ? 'administrador' : 'utilizador'
    });

    await novoUser.save();
    res.status(201).json({ mensagem: 'Utilizador registado com sucesso.' });

  } catch (err) {
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

/**
 * POST /api/auth/login
 * Autentica um utilizador existente.
 * - Verifica se o email existe
 * - Compara a password enviada com o hash guardado
 * - Devolve um token JWT válido por 2 horas
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ erro: 'Email e password são obrigatórios.' });

    // Procura o utilizador pelo email
    const utilizador = await User.findOne({ email });
    if (!utilizador)
      return res.status(401).json({ erro: 'Credenciais inválidas.' });

    // Compara a password enviada com o hash guardado na base de dados
    const passwordCorreta = await bcrypt.compare(password, utilizador.password);
    if (!passwordCorreta)
      return res.status(401).json({ erro: 'Credenciais inválidas.' });

    // Gera o token JWT com os dados do utilizador (expira em 2 horas)
    const token = jwt.sign(
      { id: utilizador._id, email: utilizador.email, role: utilizador.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Devolve o token e os dados básicos do utilizador (sem password)
    res.json({
      token,
      utilizador: {
        id: utilizador._id,
        nome: utilizador.nome,
        email: utilizador.email,
        role: utilizador.role
      }
    });

  } catch (err) {
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

/**
 * GET /api/auth/perfil
 * Devolve os dados do utilizador autenticado.
 * Requer token JWT válido no cabeçalho Authorization.
 * A password é excluída da resposta com .select('-password')
 */
router.get('/perfil', autenticar, async (req, res) => {
  try {
    const utilizador = await User.findById(req.utilizador.id).select('-password');
    if (!utilizador)
      return res.status(404).json({ erro: 'Utilizador não encontrado.' });

    res.json(utilizador);
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

/**
 * PUT /api/auth/perfil
 * Permite ao utilizador autenticado editar o seu nome e/ou password.
 * Requer token JWT válido no cabeçalho Authorization.
 * Se a password for alterada, é feito novo hash antes de guardar.
 */
router.put('/perfil', autenticar, async (req, res) => {
  try {
    const { nome, password } = req.body;
    const atualizacao = {};

    if (nome) atualizacao.nome = nome;
    if (password) atualizacao.password = await bcrypt.hash(password, 10); // Novo hash se mudar password

    const utilizador = await User.findByIdAndUpdate(
      req.utilizador.id,
      atualizacao,
      { new: true }          // Devolve o documento já atualizado
    ).select('-password');

    res.json({ mensagem: 'Perfil atualizado.', utilizador });
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

module.exports = router;
module.exports.autenticar = autenticar; // Exporta também o middleware para uso noutras rotas