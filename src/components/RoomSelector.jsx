import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addRoom, fetchRooms, setActiveRoom } from "../features/floorSlice";
import { FiMoreVertical } from "react-icons/fi";

const RoomSelector = () => {
  const rooms = useSelector((state) => state.floor.rooms);
  const activeRoom = useSelector((state) => state.floor.activeRoom);
  const dispatch = useDispatch();

  console.log(activeRoom)

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  useEffect(() => {
    const roomKeys = Object.keys(rooms);
  
    if (roomKeys.length > 0 && !activeRoom) {
      const firstRoom = roomKeys[0];
      dispatch(setActiveRoom(firstRoom));
    }
  }, [rooms, activeRoom, dispatch]);  

  const handleAddRoom = () => {
    const newRoomName = prompt("Enter a name for the new room:");
    if(newRoomName && newRoomName.trim() !== ""){
      dispatch(addRoom(newRoomName.trim()));
    }else{
      alert("Room name cannot be empty!")
    }
  }

  console.log(rooms)

  return (
    <div className="flex items-center justify-between w-full px-4 border-b">
      <div className="flex items-center space-x-6">
      {Object.keys(rooms).map((room) => (
          <button
            key={room}
            onClick={() => dispatch(setActiveRoom(room))}
            className={`text-sm font-medium pb-5 border-b-2 transition-colors ${
              activeRoom === room
                ? "border-red-500 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {room}
          </button>
        ))}
      </div>

      <div className="flex items-center pb-2 space-x-2">
        <button
          onClick={handleAddRoom}
          className="flex items-center bg-gradient-to-r from-red-600 to-black text-white px-3 py-1.5 rounded-md text-sm font-semibold shadow-sm hover:opacity-90"
        >
          + Add Room
        </button>
        <button className="flex items-center border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm font-semibold shadow-sm hover:bg-gray-100">
          Save Room
        </button>
        <FiMoreVertical
          className="text-gray-500 cursor-pointer hover:text-gray-700"
          size={20}
        />
      </div>
    </div>
  );
};

export default RoomSelector;