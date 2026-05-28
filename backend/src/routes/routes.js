import express from 'express';
import Evento from '../models/Evento.js';

const router = express.Router();

//!! Verificação de token adicionado manualmente
function verificarToken(req, res, next) {
  const authHeader = req.headers['gfg_token_header_key'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'gfg_jwt_secret_key');
    req.usuario = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
}





// Listar todos os eventos
router.get('/', async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Guardar evento
router.post('/', verificarToken, async (req, res) => {
  try {
    const novoEvento = new Evento(req.body);
    await novoEvento.save();
    res.status(201).json(novoEvento);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remover evento
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    await Evento.findOneAndDelete({ idLocal: req.params.id });
    res.json({ message: "Removido com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar evento
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const atualizado = await Evento.findOneAndUpdate(
      { idLocal: req.params.id },
      req.body,
      { new: true }
    );
    res.json(atualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;