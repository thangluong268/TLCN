import { createSlice } from "@reduxjs/toolkit";

const Home = createSlice({
  name: "home",
  initialState: {
    data: {},
  },
  reducers: {
    login: (state, action) => {
      state.data = action.payload;
    },
  },
});

const { reducer, actions } = Home;
export const { login } = actions;
export default reducer;
