// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { jsonApi } from '../redux/slices/jsonApiSlice';

export const store = configureStore({
  reducer: {
    [jsonApi.reducerPath]: jsonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(jsonApi.middleware),
});
