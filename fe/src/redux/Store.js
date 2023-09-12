import { configureStore } from "@reduxjs/toolkit";
import HomeReducer from "../component/Home/HomeSlice";

const RootReducer = {
  home: HomeReducer,
};

const store = configureStore({
  reducer: RootReducer,
});

export default store;
