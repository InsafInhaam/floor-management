// api.js
import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const getRooms = async () => {
  try {
    const response = await axios.get(`${API_URL}/rooms`);
    console.log("Rooms from API:", response.data); // Log the data to check
    return response.data; // Return the response data (rooms)
  } catch (error) {
    console.error("Error fetching rooms:", error); // Handle any error
    throw error;
  }
};

export const createRoom = async (name) => {
  const response = await axios.post(`${API_URL}/rooms`, { name });
  return response.data;
};

export const setActiveRoomAPI = async (roomId) => {
  const response = await axios.put(`${API_URL}/rooms/${roomId}`, {
    active: true,
  });
  return response.data;
};

export const addTableToRoom = async (roomId, tableData) => {
  try {
    const response = await axios.post(`${API_URL}/add-table`, {
      roomId,
      tableData,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error adding table:", error.response.data);
    } else if (error.request) {
      console.error("Error adding table: No response from server", error.request);
    } else {
      console.error("Error adding table:", error.message);
    }
  }
};

export const updateTableAPI = async (roomId, tableId, updates) => {
  const response = await axios.put(
    `${API_URL}/rooms/${roomId}/tables/${tableId}`,
    updates
  );
  return response.data;
};

export const deleteTableAPI = async (roomId, tableId) => {
  const response = await axios.delete(
    `${API_URL}/rooms/${roomId}/tables/${tableId}`
  );
  return response.data;
};

export const updateTablePositionAPI = async (roomId, tableId, { x, y }) => {
  const response = await axios.put(
    `${API_URL}/rooms/${roomId}/tables/${tableId}/position`,
    { x, y }
  );
  return response.data;
};

export const updateTableSizeAPI = async (
  roomId,
  tableId,
  { width, height }
) => {
  const response = await axios.put(
    `${API_URL}/rooms/${roomId}/tables/${tableId}/size`,
    { width, height }
  );
  return response.data;
};

export const updateTableRotationAPI = async (roomId, tableId, { rotation }) => {
  const response = await axios.put(
    `${API_URL}/rooms/${roomId}/tables/${tableId}/rotation`,
    { rotation }
  );
  return response.data;
};

export const updateTableTypeAPI = async (roomId, tableId, { type }) => {
  const response = await axios.put(
    `${API_URL}/rooms/${roomId}/tables/${tableId}/type`,
    { type }
  );
  return response.data;
};
