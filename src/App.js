import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import FloorPlan from "./components/FloorPlan";
import RoomSelector from "./components/RoomSelector";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const App = () => (
  <Provider store={store}>
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
      <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <div className="pt-4">
              <RoomSelector />
              <div className="flex space-x-4">
                <FloorPlan />
              </div>
            </div>
          </main>
        </div>
      </div>
    </DndProvider>
  </Provider>
);

export default App;
