const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const urlSchema = new mongoose.Schema({
  urlCode: { type: String, required: true, unique: true, default: () => nanoid(7) },
  longUrl: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

module.exports = mongoose.model('Url', urlSchema);