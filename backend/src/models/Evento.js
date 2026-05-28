import mongoose from 'mongoose';

const EventoSchema = new mongoose.Schema({
  idLocal: { 
    type: Number, 
    required: true 
  },
  titulo: { 
    type: String, 
    required: true 
  },
  descricao: { 
    type: String, 
    required: true 
  },
  data: { 
    type: String, 
    required: true 
  },
  hora: { 
    type: String, 
    required: true 
  },
  local: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

const Evento = mongoose.model('Evento', EventoSchema);
export default Evento;