import mongoose from 'mongoose';
/**
 * Schema do utilizador na base de dados MongoDB.
 * Cada utilizador tem:
 *  - nome: nome completo
 *  - email: único, usado para login
 *  - password: guardada como hash (nunca em texto simples)
 *  - role: permissões — 'utilizador' (padrão) ou 'administrador'
 *  - timestamps: datas de criação e atualização automáticas
 */
const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true               // Remove espaços no início/fim
  },
  email: {
    type: String,
    required: true,
    unique: true,            // Não permite emails repetidos
    lowercase: true,         // Guarda sempre em minúsculas
    trim: true
  },
  password: {
    type: String,
    required: true           // Guardada como hash bcrypt, nunca em texto simples
  },
  role: {
    type: String,
    enum: ['utilizador', 'administrador'],  // Apenas estes dois valores são aceites
    default: 'utilizador'                   // Por omissão, todos são utilizadores comuns
  }
}, { timestamps: true }); // Adiciona automaticamente createdAt e updatedAt

export default mongoose.model('User', userSchema);