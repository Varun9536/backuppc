import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  userid: "",
  role: "",
  isLoggedIn : false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoginData(state, action) {
      const { email, userid, role } = action.payload;
      state.email = email;
      state.userid = userid;
      state.role = role;
      state.isLoggedIn = true;
      
    },
    logout(state) {
      state.email = "";
      state.userid = "";
      state.role = "";
      state.isLoggedIn = false;
      localStorage.removeItem("userState");
    },
  },
});

export const { setLoginData, logout } = userSlice.actions;
export default userSlice.reducer;
