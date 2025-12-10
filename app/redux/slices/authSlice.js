// redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  items: [],
  total: null,
  quantity: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user || null;
      state.token = token || null;
      state.isAuthenticated = !!token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.items = [];
      state.total = null;
      state.quantity = null;
    },
    paymentData: (state, action) => {
      const { items = [], total = 0 } = action.payload;
      state.items = items;
      state.total = total;
      state.quantity = items.length;
    },
    // Optional: use when restoring from storage
    setAuthFromStorage: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = !!token;
    },
  },
});

export const { setCredentials, logout, paymentData, setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
