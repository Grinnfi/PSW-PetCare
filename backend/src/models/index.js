// ══════════════════════════════════════════════
// models/index.js — Schemas e Models do Mongoose
// ══════════════════════════════════════════════
import mongoose from 'mongoose'

const { Schema, model } = mongoose

// ── User ──────────────────────────────────────
const userSchema = new Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['admin', 'user'], default: 'user' },
}, { timestamps: true })

// ── Pet ───────────────────────────────────────
const petSchema = new Schema({
  name:     { type: String, required: true },
  especie:  { type: String, required: true },
  raca:     { type: String, default: '' },
  sexo:     { type: String, default: '' },
  idade:    { type: String, default: '' },
  donoId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  donoNome: { type: String, default: '' },
  obs:      { type: String, default: '' },
}, { timestamps: true })

// ── Agendamento ───────────────────────────────
const agendamentoSchema = new Schema({
  petId:      { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
  petNome:    { type: String, default: '' },
  petEspecie: { type: String, default: '' },
  donoId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  donoNome:   { type: String, default: '' },
  servico:    { type: String, required: true },
  data:       { type: String, required: true },
  hora:       { type: String, required: true },
  status:     { type: String, enum: ['pendente', 'concluido', 'cancelado'], default: 'pendente' },
}, { timestamps: true })

// ── Compra ────────────────────────────────────
const compraSchema = new Schema({
  donoId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  donoNome: { type: String, default: '' },
  itens: [{
    nome:  String,
    qtd:   Number,
    preco: Number,
  }],
  total:  { type: Number, required: true },
  data:   { type: String, default: () => new Date().toISOString().split('T')[0] },
  status: { type: String, enum: ['pendente', 'entregue', 'cancelado'], default: 'pendente' },
}, { timestamps: true })

// ── Product ───────────────────────────────────
const productSchema = new Schema({
  name:  { type: String, required: true },
  unit:  { type: String, default: 'unidade' },
  cat:   { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  desc:  { type: String, default: '' },
  emoji: { type: String, default: '' },
}, { timestamps: true })

// ── Exporta os models ──────────────────────────
export const User        = model('User',        userSchema)
export const Pet         = model('Pet',         petSchema)
export const Agendamento = model('Agendamento', agendamentoSchema)
export const Compra      = model('Compra',      compraSchema)
export const Product     = model('Product',     productSchema)
