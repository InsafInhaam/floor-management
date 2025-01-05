import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTable, updateTable, selectTable } from "../features/floorSlice";
import circleTableSvg from "../assets/circle-table.svg";
import squareTableSvg from "../assets/square-table.svg";
import VectorSvg from "../assets/Vector.svg";
import HomeIcon from "../assets/home-icon.png";
import MaxIcon from "../assets/max-btn.svg";
import MinIcon from "../assets/min-btn.svg";
import TableIcon from "../assets/round-table.png";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { tables, selectedTable } = useSelector((state) => {
    const activeRoom = state.floor.activeRoom;
    return {
      tables: state.floor.rooms[activeRoom]?.tables || [],
      selectedTable: state.floor.selectedTable,
    };
  });

  const [tableDetails, setTableDetails] = useState({
    name: "",
    minCovers: 1,
    maxCovers: 1,
    online: false,
    x: 0,
    y: 0,
    rotation: 0,
  });

  const [advancedSettings, setAdvancedSettings] = useState(false);

  // console.log(selectedTable);

  useEffect(() => {
    if (selectedTable) {
      setTableDetails({
        name: selectedTable.name,
        minCovers: selectedTable.minCovers,
        maxCovers: selectedTable.maxCovers,
        online: selectedTable.online,
        x: selectedTable.x,
        y: selectedTable.y,
        rotation: selectedTable.rotation,
      });
    }
  }, [selectedTable]);

  useEffect(() => {
    if (selectedTable) {
      dispatch(
        updateTable({
          id: selectedTable.id,
          changes: tableDetails,
        })
      );

      // console.log("adavce test");
      // console.log(selectedTable);
      // console.log("end adavce test");
    }
  }, [tableDetails, selectedTable, dispatch]);



  // Handle adding a new table
  const handleAddTable = (shape) => {
    const newTable = {
      id: `table-${Date.now()}`,
      type: shape,
      name: `T-${Math.floor(Math.random() * 100)
        .toString()
        .padStart(2, "0")}`,
      minCovers: 1,
      maxCovers: 1,
      online: false,
      x: 50,
      y: 50,
      width: 100,
      height: 100,
    };
    dispatch(addTable(newTable));
    dispatch(selectTable(newTable.id));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTableDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAdvanceChanges = () => {
    const { x, y, rotation } = tableDetails;

    console.log(selectedTable)

    if (x && y && rotation) {
      // updateAdvanceSettings({x, y, rotation})
      dispatch(
        updateTable({
          id: selectedTable.id,
          changes: tableDetails,
        })
      );
    }

    // console.log({x, y, rotation})
  };

  // total dispay
  const totalTables = tables.length;
  const totalMainCovers = tables.reduce(
    (sum, table) => sum + (table.minCovers || 0),
    0
  );
  const totalMaxCoveers = tables.reduce(
    (sum, table) => sum + (table.maxCovers || 0),
    0
  );
  const totalOnlineCapacity = tables.filter((tables) => tables.online).length;

  return (
    <aside className="flex flex-row items-start justify-start overflow-y-auto w-80">
      {/* Sidebar Icon Section */}
      <div className="flex flex-col items-center justify-start h-full p-3 border-r-2 bg-custom-light-gray">
        <img
          src={HomeIcon}
          alt="Home Icon"
          className="pt-1 pb-4"
          style={{ width: "40px", height: "auto" }}
          draggable="false"
        />
        <img
          src={VectorSvg}
          alt="Vector Icon"
          className="p-2"
          style={{ width: "40px", height: "auto" }}
          draggable="false"
        />
      </div>

      {/* Table Options Section */}
      <div className="h-full py-4 bg-white border-r-2">
        <div className="flex items-center space-x-6 border-b">
          <button
            className={`text-sm font-medium pb-5 border-b-2 transition-colors border-red-500 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 px-4`}
          >
            Tables
          </button>
        </div>
        <div className="border-b">
          <div className="p-4 my-4">
            <h2 className="mb-2 text-lg font-semibold text-center">
              Table Options
            </h2>
            <p className="text-sm text-center text-gray-500">
              Drag and drop your tables
            </p>
            <div className="flex mt-4 space-x-6">
              {/* Circle Table */}
              <div
                className="flex items-center justify-center w-24 h-24 border-2 border-gray-300 border-dashed rounded cursor-pointer hover:border-red-400"
                onClick={() => handleAddTable("circle")}
              >
                <img
                  src={circleTableSvg}
                  alt="Circle Table"
                  style={{ width: "80%", height: "80%" }}
                  draggable="false"
                />
              </div>
              {/* Square Table */}
              <div
                className="flex items-center justify-center w-24 h-24 border-2 border-gray-300 border-dashed cursor-pointer hover:border-red-400"
                onClick={() => handleAddTable("square")}
              >
                <img
                  src={squareTableSvg}
                  alt="Square Table"
                  style={{ width: "80%", height: "80%" }}
                  draggable="false"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="">
          {/* Table Details Section */}
          {selectedTable && (
            <div className="bg-white rounded">
              <div className="border-b">
                <div className="p-4 my-2 space-y-4">
                  <h3 className="mb-4 text-lg font-semibold">Table Details</h3>
                  {/* Table Name */}
                  <div>
                    <label className="block text-sm text-gray-700">
                      Table Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={tableDetails.name}
                      onChange={handleInputChange}
                      className="w-full p-2 mt-1 border rounded-md"
                      placeholder="Enter table name"
                    />
                  </div>

                  {/* Min Covers */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Min Covers</span>
                    <div className="flex items-center space-x-2">
                      <button
                        className="flex items-center justify-center w-6 h-6 rounded-full"
                        onClick={() =>
                          setTableDetails((prev) => ({
                            ...prev,
                            minCovers: Math.max(1, prev.minCovers - 1),
                          }))
                        }
                      >
                        <img
                          src={MinIcon}
                          alt="MinIcon"
                          style={{ width: "100%", height: "100%" }}
                          draggable="false"
                        />
                      </button>
                      <span className="text-gray-700">
                        {tableDetails.minCovers}
                      </span>
                      <button
                        className="flex items-center justify-center w-6 h-6 rounded-full"
                        onClick={() =>
                          setTableDetails((prev) => ({
                            ...prev,
                            minCovers: prev.minCovers + 1,
                          }))
                        }
                      >
                        <img
                          src={MaxIcon}
                          alt="MaxIcon"
                          style={{ width: "100%", height: "100%" }}
                          draggable="false"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Max Covers */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Max Covers</span>
                    <div className="flex items-center space-x-2">
                      <button
                        className="flex items-center justify-center w-6 h-6 rounded-full"
                        onClick={() =>
                          setTableDetails((prev) => ({
                            ...prev,
                            maxCovers: Math.max(1, prev.maxCovers - 1),
                          }))
                        }
                      >
                        <img
                          src={MinIcon}
                          alt="MinIcon"
                          style={{ width: "100%", height: "100%" }}
                          draggable="false"
                        />
                      </button>
                      <span className="text-gray-700">
                        {tableDetails.maxCovers}
                      </span>
                      <button
                        className="flex items-center justify-center w-6 h-6 rounded-full"
                        onClick={() => {
                          setTableDetails((prev) => ({
                            ...prev,
                            maxCovers: prev.maxCovers + 1,
                          }));
                        }}
                      >
                        <img
                          src={MaxIcon}
                          alt="MaxIcon"
                          style={{ width: "100%", height: "100%" }}
                          draggable="false"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Online Status */}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-700">Online Status</span>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={tableDetails.online}
                        onChange={(e) =>
                          setTableDetails((prev) => ({
                            ...prev,
                            online: e.target.checked,
                          }))
                        }
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#bb2e26]" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {/* Advanced Settings */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={advancedSettings}
                    onChange={() => setAdvancedSettings((prev) => !prev)}
                  />
                  <span className="text-gray-700">Advanced Settings</span>
                </div>
              </div>

              {advancedSettings && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700">
                      X-axix
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 mt-1 border rounded-md"
                      placeholder="Enter value for field 1"
                      value={tableDetails.x}
                      onChange={(e) =>
                        setTableDetails((prev) => ({
                          ...prev,
                          x: e.target.x,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Y-axix
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 mt-1 border rounded-md"
                      placeholder="Enter value for field 1"
                      value={tableDetails.y}
                      onChange={(e) =>
                        setTableDetails((prev) => ({
                          ...prev,
                          y: e.target.y,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Rotation
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 mt-1 border rounded-md"
                      placeholder="Enter value for field 1"
                      value={tableDetails.rotation}
                      onChange={(e) =>
                        setTableDetails((prev) => ({
                          ...prev,
                          rotation: e.target.rotation,
                        }))
                      }
                    />
                  </div>

                  <button
                    className="flex items-center bg-gradient-to-r from-red-600 to-black text-white px-3 py-1.5 rounded-md text-sm font-semibold shadow-sm hover:opacity-90"
                    onClick={handleAdvanceChanges}
                  >
                    Update Table
                  </button>
                </div>
              )}

              {/* update table */}
              {/* <button
                className="flex items-center bg-gradient-to-r from-red-600 to-black text-white px-3 py-1.5 rounded-md text-sm font-semibold shadow-sm hover:opacity-90"
                onClick={handleSaveChanges}
              >
                Update Table
              </button> */}
            </div>
          )}
        </div>
      </div>

      {/* Footer Summary Section */}
      <div className="bg-black text-white p-2 flex justify-around items-center absolute bottom-[40px] left-[40%] z-[9999]">
        <div className="flex items-center px-2 space-x-2">
          <img src={TableIcon} alt="Table Icon" className="w-5 h-5" />
          <span>{totalTables} Tables</span>
        </div>
        <div className="flex items-center px-2 space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            className="w-4 h-4"
            fill="none"
          >
            <path
              fill="#ffffff"
              d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM609.3 512l-137.8 0c5.4-9.4 8.6-20.3 8.6-32l0-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2l61.4 0C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z"
            />
          </svg>
          <span>{totalMainCovers} Main Covers</span>
        </div>
        <div className="flex items-center px-2 space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            className="w-4 h-4"
            fill="none"
          >
            <path
              fill="#ffffff"
              d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM609.3 512l-137.8 0c5.4-9.4 8.6-20.3 8.6-32l0-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2l61.4 0C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z"
            />
          </svg>
          <span>{totalMaxCoveers} Max Covers</span>
        </div>
        <div className="flex items-center px-2 space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="w-4 h-4"
            fill="none"
          >
            <path
              fill="#ffffff"
              d="M352 256c0 22.2-1.2 43.6-3.3 64l-185.3 0c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64l185.3 0c2.2 20.4 3.3 41.8 3.3 64zm28.8-64l123.1 0c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64l-123.1 0c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32l-116.7 0c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0l-176.6 0c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0L18.6 160C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192l123.1 0c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64L8.1 320C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6l176.6 0c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352l116.7 0zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6l116.7 0z"
            />
          </svg>
          <span>{totalOnlineCapacity} Online Capacity</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
