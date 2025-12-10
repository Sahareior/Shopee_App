// src/features/api/jsonApiSlice.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Create a custom base query with proper async token handling
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://waters-processing-keen-roberts.trycloudflare.com',
  prepareHeaders: async (headers, { getState }) => {
    let token = null;
    
    try {
      // Method 1: Try to get token from AsyncStorage first (for React Native)
      token = await AsyncStorage.getItem('authToken');
      console.log('🔑 Token from AsyncStorage:', token ? 'Found' : 'Not found');
      
      // Method 2: Fallback to Redux state if available
      if (!token) {
        const state = getState();
        token = state?.auth?.token;
        console.log('🔑 Token from Redux state:', token ? 'Found' : 'Not found');
      }
      
      // Method 3: Fallback to localStorage for web (if needed)
      if (!token && typeof window !== 'undefined') {
        try {
          token = window.localStorage.getItem('authToken');
          console.log('🔑 Token from localStorage:', token ? 'Found' : 'Not found');
        } catch (error) {
          console.error('Error reading token from localStorage:', error);
        }
      }
      
      // Clean and validate token
      if (token) {
        // Remove any quotes or extra whitespace
        token = token.trim().replace(/^["']|["']$/g, '');
        
        // Set authorization header
        const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        headers.set('Authorization', authToken);
        console.log('✅ Authorization header set');
      } else {
        console.log('⚠️ No token found for authorization');
      }
    } catch (error) {
      console.error('❌ Error retrieving token:', error);
    }
    
    // Always set Content-Type for consistency
    headers.set('Content-Type', 'application/json');
    
    return headers;
  },
});

// Custom base query with error handling
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // Handle 401 Unauthorized responses
  if (result.error && result.error.status === 401) {
    console.log('🔐 Unauthorized - token may be invalid or expired');
    
    // Optional: Try to refresh token here
    // const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
    // if (refreshResult.data) {
    //   // Retry the original query with new token
    //   result = await baseQuery(args, api, extraOptions);
    // } else {
    //   // Clear invalid token
      await AsyncStorage.removeItem('authToken');
      
    //   api.dispatch({ type: 'auth/logout' });
    // }
  }
  
  // Handle network errors
  if (result.error && result.error.status === 'FETCH_ERROR') {
    console.error('🌐 Network error - check backend URL and connection');
    console.log('Current baseUrl:', 'https://waters-processing-keen-roberts.trycloudflare.com');
  }
  
  return result;
};

export const jsonApi = createApi({
  reducerPath: 'jsonApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Products', 'Cart', 'Wishlist', 'Story', 'Categories'],
  endpoints: (builder) => ({
    // Auth endpoints
    signIn: builder.mutation({
      query: (credentials) => ({
        url: '/user/sign-in',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Cart', 'Wishlist'],
    }),
    
    signUp: builder.mutation({
      query: (userData) => ({
        url: '/user/sign-up',
        method: 'POST',
        body: userData,
      }),
    }),
// /login/:userId
    updateloginStatus:builder.query({
      query: (id) => ({
        url: `/user/login/${id}`,
        method: 'GET',
      }),
    }),
    
    // Product endpoints
    getAllProducts: builder.query({
      query: () => '/products',
      providesTags: ['Products'],
    }),
    
    getProductById: builder.query({
      query: (id) => `/products/all/${id}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),
    
    getProductsByFilter: builder.query({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        
        const addParam = (key, value) => {
          if (value === undefined || value === null || value === '') return;
          
          if (Array.isArray(value)) {
            value.forEach(item => {
              if (item !== undefined && item !== null && item !== '') {
                params.append(key, item);
              }
            });
          } else if (value !== false) {
            params.append(key, value);
          }
        };
        
        const {
          category,
          brand,
          minPrice,
          maxPrice,
          labels,
          rating,
          color,
          size,
          inStock,
          search,
          variations,
          variationSku,
          page,
          limit,
          sortBy,
        } = filters;
        
        console.log('🔍 Applying filters:', filters);
        
        addParam('category', category);
        addParam('brand', brand);
        addParam('minPrice', minPrice);
        addParam('maxPrice', maxPrice);
        addParam('labels', labels);
        addParam('rating', rating);
        addParam('color', color);
        addParam('size', size);
        addParam('inStock', inStock);
        addParam('search', search);
        addParam('variations', variations);
        addParam('variationSku', variationSku);
        addParam('page', page);
        addParam('limit', limit);
        addParam('sortBy', sortBy);
        
        const queryString = params.toString();
        return `/products/filter${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Products'],
    }),
    
    getProductsByTypes: builder.query({
      query: (type) => `/products/${type}`,
      providesTags: ['Products'],
    }),
    
    // Category endpoints
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),
    
    // Cart endpoints
    getCarts: builder.query({
      query: (id) => `/cart`,
      providesTags: ['Cart'],
    }),
    
    addCart: builder.mutation({
      query: (data) => ({
        url: '/cart',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),
    
    updateCart: builder.mutation({
      query: ({ itemId, ...data }) => ({
        url: `/cart/${itemId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),
    
    deleteCart: builder.mutation({
      query: (id) => ({
        url: `/cart/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    
    // Wishlist endpoints
    getWishLists: builder.query({
      query: (id) => `/wishlist`,
      providesTags: ['Wishlist'],
    }),
    
    addWishlist: builder.mutation({
      query: (data) => ({
        url: '/wishlist',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Wishlist'],
    }),
    
    deleteWishlist: builder.mutation({
      query: (id) => ({
        url: `/wishlist`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
    }),
    
    // Story endpoints
    createStory: builder.mutation({
      query: (data) => ({
        url: '/story',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Story'],
    }),
    
    getStory: builder.query({
      query: () => `/story`,
      providesTags: ['Story'],
    }),
    
    getMediaById: builder.query({
      query: (id) => `/story/media/${id}`,
      providesTags: ['Story'],
    }),
    
    // Recent viewed
    getRecentViewed: builder.query({
      query: (id) => `/recent-view/${id}`,
    }),
    
    // Post endpoint (if needed)
    getPostById: builder.query({
      query: (id) => `posts/${id}`,
    }),
  }),
});

// Debug utility function
export const debugAuth = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    console.log('🔍 Debug Auth Token:');
    console.log('- Token exists:', !!token);
    console.log('- Token length:', token?.length);
    console.log('- Token starts with eyJ:', token?.startsWith('eyJ'));
    console.log('- First 50 chars:', token?.substring(0, 50));
    
    const keys = await AsyncStorage.getAllKeys();
    console.log('- All AsyncStorage keys:', keys);
    
    // Get all items for debugging
    const items = await AsyncStorage.multiGet(keys);
    items.forEach(([key, value]) => {
      console.log(`  ${key}:`, value?.substring(0, 30) + '...');
    });
    
    return token;
  } catch (error) {
    console.error('Debug auth error:', error);
    return null;
  }
};

// Function to clear auth token
export const clearAuthToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    console.log('✅ Auth token cleared');
  } catch (error) {
    console.error('Error clearing auth token:', error);
  }
};

export const { 
  useGetAllProductsQuery, 
  useGetProductByIdQuery,
  useGetProductsByFilterQuery,
  useLazyGetProductsByFilterQuery,
  useGetProductsByTypesQuery,
  useGetCategoriesQuery,
  useGetCartsQuery,
  useAddCartMutation,
  useUpdateCartMutation,
  useDeleteCartMutation,
  useGetWishListsQuery,
  useAddWishlistMutation,
  useDeleteWishlistMutation,
  useSignUpMutation,
  useSignInMutation,
  useCreateStoryMutation,
  useGetStoryQuery,
  useGetMediaByIdQuery,
  useLazyGetMediaByIdQuery,
  useGetRecentViewedQuery,
  useUpdateloginStatusQuery,  
  useLazyUpdateloginStatusQuery,
  useGetPostByIdQuery,
} = jsonApi;