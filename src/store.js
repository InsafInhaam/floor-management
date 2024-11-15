import { configureStore } from "@reduxjs/toolkit";
import floorReducer from "./features/floorSlice";

export const store = configureStore({
  reducer: {
    floor: floorReducer,
  },
});
