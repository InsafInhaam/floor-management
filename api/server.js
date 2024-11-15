const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./utils/db");
const app = express();
const Room = require("./models/Room"); // Import the Room model

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// -------- Routes ---------- //

// Get all rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find(); // Assuming 'Room' is your MongoDB model
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new room
app.post('/api/rooms', async (req, res) => {
  try {
    console.log(req.body);
    const newRoom = new Room({
      name: req.body.name,
      tables: req.body.tables, // Assuming you're passing tables as an array of objects
    });

    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Set active room
app.put("/api/rooms/:id", async (req, res) => {
  const { id } = req.params;
  const room = await Room.findById(id);
  if (room) {
    room.set(req.body);
    await room.save();
    res.json(room);
  } else {
    res.status(404).send("Room not found");
  }
});

// Add a table to a room
app.post("/api/add-table", async (req, res) => {
  const { roomId, tableData } = req.body;

  try {
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const { id, type, name, minCovers, maxCovers, online, x, y, width, height, rotation } = tableData;
    if (!id || !type || !name || !minCovers || !maxCovers || x === undefined || y === undefined || width === undefined || height === undefined || rotation === undefined) {
      return res.status(400).json({ message: "Invalid table data" });
    }

    room.tables.push(tableData);

    await room.save();

    res.status(200).json({ message: "Table added successfully", room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update a table in a room
app.put("/api/rooms/:roomId/tables/:tableId", async (req, res) => {
  const { roomId, tableId } = req.params;
  const updates = req.body;

  if (!updates.name) {
    updates.name = `Table-${tableId}`;
  }

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).send("Room not found");
    }

    const table = room.tables.find(t => t.id === tableId);
    if (!table) {
      return res.status(404).send("Table not found");
    }

    Object.assign(table, updates);
    await room.save();
    res.json(table);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Delete a table from a room
app.delete("/api/rooms/:roomId/tables/:tableId", async (req, res) => {
  const { roomId, tableId } = req.params;

  try {
    const room = await Room.findById(roomId);
    if (room) {
      room.tables = room.tables.filter(t => t.id !== tableId);

      await room.save();
      res.json({ message: "Table deleted" });
    } else {
      res.status(404).send("Room not found");
    }
  } catch (error) {
    console.error("Error deleting table:", error);
    res.status(500).send("Server error");
  }
});

// Update table position (x, y)
// app.put("/api/rooms/:roomId/tables/:tableId/position", async (req, res) => {
//   const { roomId, tableId } = req.params;
//   const { x, y } = req.body;

//   const room = await Room.findById(roomId);
//   if (room) {
//     const table = room.tables.find(t => t.id === tableId);
//     if (table) {
//       table.x = x;
//       table.y = y;
//       await room.save();
//       res.json(table);
//     } else {
//       res.status(404).send("Table not found");
//     }
//   } else {
//     res.status(404).send("Room not found");
//   }
// });


// Update table position (x, y)
app.put("/api/rooms/:roomId/tables/:tableId/position", async (req, res) => {
  const { roomId, tableId } = req.params;
  const { x, y } = req.body;

  // Validate if roomId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return res.status(400).send("Invalid roomId format");
  }

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).send("Room not found");
    }

    const table = room.tables.find((t) => t.id === tableId);
    if (!table) {
      return res.status(404).send("Table not found");
    }

    // Update the table's position
    table.x = x;
    table.y = y;

    await room.save();

    res.json(table);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Update table size (width, height)
app.put("/api/rooms/:roomId/tables/:tableId/size", async (req, res) => {
  const { roomId, tableId } = req.params;
  const { width, height } = req.body;

  const room = await Room.findById(roomId);
  if (room) {
    const table = room.tables.find(t => t.id === tableId);
    if (table) {
      table.width = width;
      table.height = height;
      await room.save();
      res.json(table);  // Respond with the updated table object
    } else {
      res.status(404).send("Table not found");
    }
  } else {
    res.status(404).send("Room not found");
  }
});

// Update table rotation
app.put("/api/rooms/:roomId/tables/:tableId/rotation", async (req, res) => {
  const { roomId, tableId } = req.params;
  const { rotation } = req.body;

  const room = await Room.findById(roomId);
  if (room) {
    const table = room.tables.find(t => t.id === tableId);
    if (table) {
      table.rotation = rotation;
      await room.save();
      res.json(table);  // Respond with the updated table object
    } else {
      res.status(404).send("Table not found");
    }
  } else {
    res.status(404).send("Room not found");
  }
});

// Update table type
app.put("/api/rooms/:roomId/tables/:tableId/type", async (req, res) => {
  const { roomId, tableId } = req.params;
  const { type } = req.body;

  const room = await Room.findById(roomId);
  if (room) {
    const table = room.tables.find(t => t.id === tableId);
    if (table) {
      table.type = type;
      await room.save();
      res.json(table);  // Respond with the updated table object
    } else {
      res.status(404).send("Table not found");
    }
  } else {
    res.status(404).send("Room not found");
  }
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});