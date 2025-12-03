// src/app/store.js

import { configureStore } from '@reduxjs/toolkit';
import { jsonApi } from '../redux/slices/jsonApiSlice';
import authReducer from '../redux/slices/authSlice';

export const store = configureStore({
  reducer: {
    // RTK Query API
    [jsonApi.reducerPath]: jsonApi.reducer,

    // Auth state (logged in user)
    auth: authReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(jsonApi.middleware),
});
