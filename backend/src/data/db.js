// ══════════════════════════════════════════════
// data/db.js — Conexão com o MongoDB via Mongoose
// ══════════════════════════════════════════════
import mongoose from 'mongoose'
import 'dotenv/config'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/petcare'

export async function conectarDB() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('✅ MongoDB conectado!')
  } catch (err) {
    console.error('❌ Erro ao conectar no MongoDB:', err.message)
    process.exit(1)  // Encerra o servidor se não conseguir conectar
  }
}
