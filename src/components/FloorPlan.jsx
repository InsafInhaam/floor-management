import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Rnd } from "react-rnd";
import {
  updateTablePosition,
  updateTableSize,
  selectTable,
  addTable,
  deleteTable,
  updateTableRotation,
  updateTableType,
} from "../features/floorSlice";
import circleTableSvg from "../assets/circle-table.svg";
import squareTableSvg from "../assets/square-table.svg";

const FloorPlan = () => {
  const tables = useSelector(
    (state) => state.floor.rooms[state.floor.activeRoom]?.tables
  );
  const dispatch = useDispatch();
  const [isRotating, setIsRotating] = useState(false);

  // drag and drop one
  const handleDragStop = (id, d) => {
    dispatch(updateTablePosition({ id, x: d.x, y: d.y }));
  };

  // resize table
  const handleResizeStop = (id, ref) => {
    dispatch(
      updateTableSize({
        id,
        width: parseInt(ref.style.width),
        height: parseInt(ref.style.height),
      })
    );
  };

  // rotate table start
  const handleRotateStart = (e, tableId) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsRotating(tableId);
  };

  const handleRotateMove = (e) => {
    if (isRotating) {
      const table = tables.find((t) => t.id === isRotating);
      const centerX = table.x + table.width / 2;
      const centerY = table.y + table.height / 2;
      const angle =
        Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
      dispatch(updateTableRotation({ id: table.id, rotation: angle }));
    }
  };

  useEffect(() => {
    if (isRotating) {
      document.addEventListener("mousemove", handleRotateMove);
      document.addEventListener("mouseup", handleRotateEnd);
    } else {
      document.removeEventListener("mousemove", handleRotateMove);
      document.removeEventListener("mouseup", handleRotateEnd);
    }
    return () => {
      document.removeEventListener("mousemove", handleRotateMove);
      document.removeEventListener("mouseup", handleRotateEnd);
    };
  }, [isRotating]);

  const handleRotateEnd = () => {
    setIsRotating(false);
  };
  // rotate table end

  // duplicate the table 
  const handleDuplicate = (table) => {
    const newTable = {
      ...table,
      id: `table-${Date.now()}`,
      x: table.x + 20, // Offset duplicated table slightly
      y: table.y + 20,
    };
    dispatch(addTable(newTable));
  };

  // delete table 
  const handleDelete = (id) => {
    dispatch(deleteTable(id));
  };

  // change table circle or square
  const handleToggleTableType = (table) => {
    const newType = table.type === "circle" ? "square" : "circle";
    const newSize = newType === "circle" ? 100 : 80;

    // Update the type in Redux state
    dispatch(updateTableType({ id: table.id, type: newType }));
    dispatch(
      updateTableSize({ id: table.id, width: newSize, height: newSize })
    );
    dispatch(updateTableRotation({ id: table.id, rotation: 0 })); // Reset rotation
    dispatch(selectTable(table.id)); // Keep it selected
  };

  return (
    <div
      className="relative w-full h-screen mx-4 mb-4 bg-white shadow-lg"
      style={{
        backgroundImage: "radial-gradient(circle, #ccc 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
      onMouseMove={(e) =>
        isRotating &&
        handleRotateMove(
          e,
          tables.find((t) => t.id === isRotating)
        )
      }
      onMouseUp={handleRotateEnd}
    >
      {tables?.map((table) => (
        <Rnd
          key={table.id}
          size={{ width: table.width, height: table.height }}
          position={{ x: table.x, y: table.y }}
          onDragStop={(e, d) => handleDragStop(table.id, d)}
          onResizeStop={(e, direction, ref, delta, position) =>
            handleResizeStop(table.id, ref)
          }
          bounds="parent"
          onClick={() => dispatch(selectTable(table.id))}
          className="absolute table cursor-move"
        >
          <div className="relative p-2 text-sm font-bold text-red-700 border border-red-200 border-dashed rounded-lg table-content"  style={{
            transform: `rotate(${table.rotation || 0}deg)`,
          }}>
            {table.type === "circle" ? (
              <img
                src={circleTableSvg}
                alt="Circle Table"
                style={{ width: "100%", height: "100%" }}
                draggable="false"
              />
            ) : (
              <img
                src={squareTableSvg}
                alt="Square Table"
                style={{ width: "100%", height: "100%" }}
                draggable="false"
              />
            )}

            {/* Rotation Handle */}
            <div
              onMouseDown={(e) => handleRotateStart(e, table.id)}
              className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-3 h-3"
              >
                <path d="M463.5 224l8.5 0c13.3 0 24-10.7 24-24l0-128c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8l119.5 0z" />
              </svg>
            </div>

            {/* Action Icons */}
            <div className="absolute top-[-55px] left-1/2 transform -translate-x-1/2 flex bg-white shadow-md rounded">
              <button
                onClick={() => handleToggleTableType(table)}
                className="flex items-center justify-center rounded hover:bg-gray-100"
              >
                {table.type === "circle" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    width="40"
                    height="40"
                    className="p-3"
                  >
                    <path d="M384 80c8.8 0 16 7.2 16 16l0 320c0 8.8-7.2 16-16 16L64 432c-8.8 0-16-7.2-16-16L48 96c0-8.8 7.2-16 16-16l320 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32z" />
                  </svg>
                ) : (
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 45 39"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      width="43.4046"
                      height="37.9237"
                      transform="translate(44.1562 38.125) rotate(-180)"
                    />
                    <circle
                      cx="22.4541"
                      cy="19.1631"
                      r="7.25"
                      stroke="#292D32"
                      strokeWidth="1.5"
                    />
                  </svg>
                )}
              </button>

              <button
                onClick={() => handleDuplicate(table)}
                className="rounded hover:bg-gray-100"
              >
                <svg
                  width="40"
                  height="39"
                  viewBox="0 0 45 39"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="43.4046"
                    height="37.9237"
                    transform="translate(44.2461 38.125) rotate(-180)"
                  />
                  <path
                    d="M25.2103 19.7632V22.5632C25.2103 24.8966 24.277 25.8299 21.9436 25.8299H19.1436C16.8103 25.8299 15.877 24.8966 15.877 22.5632V19.7632C15.877 17.4299 16.8103 16.4966 19.1436 16.4966H21.9436C24.277 16.4966 25.2103 17.4299 25.2103 19.7632Z"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M29.2103 15.7632V18.5632C29.2103 20.8966 28.277 21.8299 25.9436 21.8299H25.2103V19.7632C25.2103 17.4299 24.277 16.4966 21.9436 16.4966H19.877V15.7632C19.877 13.4299 20.8103 12.4966 23.1436 12.4966H25.9436C28.277 12.4966 29.2103 13.4299 29.2103 15.7632Z"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                onClick={() => handleDelete(table.id)}
                className="rounded hover:bg-gray-100"
              >
                {/* <img src={deleteIcon} alt="Delete" className="w-4 h-4" /> */}
                <svg
                  width="40"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.6338 4.14974C12.4138 3.92974 10.1805 3.81641 7.95379 3.81641C6.63379 3.81641 5.31379 3.88307 3.99379 4.01641L2.63379 4.14974"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.30078 3.47658L6.44745 2.60325C6.55411 1.96992 6.63411 1.49658 7.76078 1.49658H9.50745C10.6341 1.49658 10.7208 1.99658 10.8208 2.60992L10.9674 3.47658"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.2007 6.25635L12.7674 12.9697C12.6941 14.0163 12.6341 14.8297 10.774 14.8297H6.49405C4.63405 14.8297 4.57405 14.0163 4.50072 12.9697L4.06738 6.25635"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.52051 11.1631H9.74051"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.9668 8.49658H10.3001"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </Rnd>
      ))}
    </div>
  );
};

export default FloorPlan;
