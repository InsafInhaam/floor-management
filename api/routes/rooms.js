const express = require("express");
const Room = require("../models/Room");
const router = express.Router();

router.get("/", async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

router.get("/:roomName", async (req, res) => {
  const room = await Room.findOne({ name: req.params.roomName });
  res.json(room);
});

router.post("/", async (req, res) => {
  const newRoom = new Room(req.body);
  await newRoom.save();
  res.json(newRoom);
});

router.post(":/roomName/tables", async (req, res) => {
  const room = await Room.findOne({ name: req.params.roomName });
  room.tables.push(req.body);
  await room.save();
  res.json(room);
});

router.put("/:roomName/tables/:tableId", async (req, res) => {
  const { roomName, tableId } = req.params;
  const room = await Room.findOne({ name: roomName });
  const table = room.tables.id(tableId);
  Object.assign(table, req.body);
  await room.save();
  res.json(room);
});

module.exports = router;