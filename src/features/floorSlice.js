import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addTableToRoom,
  createRoom,
  deleteTableAPI,
  updateTableAPI,
  updateTablePositionAPI,
  updateTableRotationAPI,
  updateTableSizeAPI,
  updateTableTypeAPI,
} from "./api";

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
          rotation: action.payload.rotation || 0,
        };

        activeRoom.tables.push(action.payload);

        const roomId = activeRoom._id;
        console.log("Table data with rotation");
        console.log(table);

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

        updateTableAPI(activeRoom._id, id, changes);
      }
    },
    deleteTable: (state, action) => {
      const activeRoom = state.rooms[state.activeRoom];
      if (activeRoom) {
        activeRoom.tables = activeRoom.tables.filter(
          (t) => t.id !== action.payload
        );

        const roomId = activeRoom._id;

        deleteTableAPI(roomId, action.payload);
      }
    },
    updateTablePosition: (state, action) => {
      const { id, x, y } = action.payload;
      const activeRoom = state.rooms[state.activeRoom];

      const table = activeRoom?.tables.find((t) => t.id === id);
      console.log(activeRoom._id, id, x, y);
      if (table) {
        table.x = x;
        table.y = y;

        updateTablePositionAPI(activeRoom._id, id, { x, y });
      }
    },
    updateTableSize: (state, action) => {
      const { id, width, height } = action.payload;
      const activeRoom = state.rooms[state.activeRoom];

      const table = activeRoom?.tables.find((t) => t.id === id);
      if (table) {
        table.width = width;
        table.height = height;

        const roomId = activeRoom._id;

        updateTableSizeAPI(roomId, id, width, height);
      }
    },
    updateTableRotation: (state, action) => {
      const { id, rotation } = action.payload;
      const activeRoom = state.rooms[state.activeRoom];
      const table = activeRoom?.tables.find((t) => t.id === id);
      if (table) {
        table.rotation = rotation;

        const roomId = activeRoom._id;

        updateTableRotationAPI(roomId, id, rotation);
      }
    },
    updateTableType: (state, action) => {
      const { id, type } = action.payload;
      const activeRoom = state.rooms[state.activeRoom];
      const table = activeRoom?.tables.find((t) => t.id === id);

      if (table) {
        table.type = type;

        const roomId = activeRoom._id;
        updateTableTypeAPI(roomId, id, type);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRooms.fulfilled, (state, action) => {
      const roomsArray = action.payload;
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
