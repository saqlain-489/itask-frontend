import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await fetch(`${process.env.APP_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      console.log(data)
      console.log(data.user.refreshToken)
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("accesstoken", data.accesstoken);
      localStorage.setItem("refreshtoken", data.user.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user))


      const res2 = await fetch(`${process.env.APP_API_URL}/api/users/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${data.accesstoken}`,
          "Content-Type": "application/json",
        },
      });
      const userData = await res2.json();
      return userData;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
const userdata = JSON.parse(localStorage.getItem('user'))
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userdata,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.todos = null;
      localStorage.removeItem("accesstoken");
      localStorage.removeItem("refreshtoken");
      localStorage.removeItem("user");

    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
