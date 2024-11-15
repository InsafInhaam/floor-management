import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addTableToRoom, createRoom, getRooms } from "./api";

export const fetchRooms = createAsyncThunk("rooms/fetchRooms", async () => {
  const response = await fetch("http://localhost:8080/api/rooms");
  const data = await response.json();
  console.log(data);
  return data;
});

const initialState = {
  rooms: {},
  activeRoom: null,
  selectedTable: null,
};

const floorSlice = createSlice({
  name: "floor",
  initialState,
  reducers: {
    addRoom: (state, action) => {
      const roomName = action.payload?.trim();
      if (roomName) {
        state.rooms[roomName] = { tables: [] };
        state.activeRoom = roomName;

        // create room name
        createRoom(roomName);
      }
    },
    setActiveRoom: (state, action) => {
      if (state.rooms[action.payload]) {
        state.activeRoom = action.payload;
      }
    },
    addTable: (state, action) => {
      const activeRoom = state.rooms[state.activeRoom];
      if (activeRoom) {
        const table = {
          ...action.payload,
          rotation: action.payload.rotation || 0, // Default to 0 if rotation is missing
        };

        activeRoom.tables.push(action.payload);

        const roomId = activeRoom._id;
        console.log("Table data with rotation");
        console.log(table);

        // Send the table data with the rotation value to the backend
        addTableToRoom(roomId, table);
      }
    },
    selectTable: (state, action) => {
      const activeRoom = state.rooms[state.activeRoom];
      if (activeRoom) {
        state.selectedTable =
          state.rooms[state.activeRoom].tables.find(
            (t) => t.id === action.payload
          ) || null;
      }
    },
    updateTable: (state, action) => {
      const { id, changes } = action.payload;
      const activeRoom = state.rooms[state.activeRoom];
      const table = activeRoom?.tables.find((t) => t.id === id);
      if (table) {
        Object.assign(table, changes);
      }
    },
    deleteTable: (state, action) => {
      const activeRoom = state.rooms[state.activeRoom];
      if (activeRoom) {
        activeRoom.tables = activeRoom.tables.filter(
          (t) => t.id !== action.payload
        );
      }
    },
    updateTablePosition: (state, action) => {
      const { id, x, y } = action.payload;
      const activeRoom = state.rooms[state.activeRoom];

      const table = activeRoom?.tables.find((t) => t.id === id);
      if (table) {
        table.x = x;
        table.y = y;
      }
    },
    updateTableSize: (state, action) => {
      const { id, width, height } = action.payload;
      const activeRoom = state.rooms[state.activeRoom];

      const table = activeRoom?.tables.find((t) => t.id === id);
      if (table) {
        table.width = width;
        table.height = height;
      }
    },
    updateTableRotation: (state, action) => {
      const { id, rotation } = action.payload;
      const activeRoom = state.rooms[state.activeRoom];
      const table = activeRoom?.tables.find((t) => t.id === id);
      if (table) {
        table.rotation = rotation;
      }
    },
    updateTableType: (state, action) => {
      const { id, type } = action.payload;
      const activeRoom = state.rooms[state.activeRoom];
      const table = activeRoom?.tables.find((t) => t.id === id);

      if (table) {
        table.type = type;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRooms.fulfilled, (state, action) => {
      const roomsArray = action.payload; // Assuming API returns an array
      const roomsObject = {};

      roomsArray.forEach((room) => {
        roomsObject[room.name] = room;
      });

      state.rooms = { ...state.rooms, ...roomsObject };
    });
  },
});

export const {
  addRoom,
  setActiveRoom,
  addTable,
  selectTable,
  updateTable,
  updateTablePosition,
  updateTableSize,
  updateTableRotation,
  deleteTable,
  updateTableType,
} = floorSlice.actions;

export default floorSlice.reducer;
