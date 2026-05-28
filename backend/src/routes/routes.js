import express from 'express';
import jwt from 'jsonwebtoken';
import Evento from '../models/Evento.js'; // Ajusta o caminho conforme a tua estrutura real

const router = express.Router();

/**
 * Validação do token enviado
 */
function verificarToken(req, res, next) {
  const authHeader = req.headers[process.env.TOKEN_HEADER_KEY];
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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