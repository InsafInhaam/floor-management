const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
  id: String,
  type: String,
  name: String,
  minCovers: Number,
  maxCovers: Number,
  online: Boolean,
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  rotation: { type: Number, default: 0 },
});

const RoomSchema = new mongoose.Schema({
  name: String,
  tables: [TableSchema],
});

module.exports = mongoose.model("Room", RoomSchema);
