const mongoose = require("mongoose");

// Table schema
const tableSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  minCovers: { type: Number, required: true },
  maxCovers: { type: Number, required: true },
  online: { type: Boolean, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  rotation: { type: Number, required: true }
});

// Room schema
const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tables: [tableSchema] // Array of table objects
});

module.exports = mongoose.model('Room', roomSchema);
