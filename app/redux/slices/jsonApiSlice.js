// src/features/api/jsonApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const jsonApi = createApi({
  reducerPath: 'jsonApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://pour-premiere-reliable-wife.trycloudflare.com' 
  }),
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => '/products',
    }),

    getProductById: builder.query({
  query: (id) => `/products/all/${id}`,
  // Or if you have a specific endpoint for single product
  // query: (id) => `/product/${id}`,
}),

    getProductsByFilter: builder.query({
      query: (filters = {}) => {
        // Build query parameters
        const params = new URLSearchParams();
        
        // Helper to handle array values
        const addParam = (key, value) => {
          if (value === undefined || value === null) return;
          
          if (Array.isArray(value)) {
            // For arrays, append each value separately
            value.forEach(item => {
              if (item !== undefined && item !== null && item !== '') {
                params.append(key, item);
              }
            });
          } else if (value !== '' && value !== false) {
            // For single values (including boolean true)
            params.append(key, value);
          }
        };
        
        // Map filter object to query parameters
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
          // Any other filter fields...
        } = filters;
        
        console.log('Filters received:', filters);  
        // Add each filter parameter
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
        
        // Construct the query string
        const queryString = params.toString();
        return `/products/filter${queryString ? `?${queryString}` : ''}`;
      },
    }),

    getPostById: builder.query({
      query: (id) => `posts/${id}`,
    }),
    
    getCategories: builder.query({
      query: () => '/categories'
    }),

    getRecentViewed: builder.query({
      query: (id) => `/recent-view/${id}`
    }),
    
    getProductsByTypes: builder.query({
      query: (type) => `/products/${type}`
    }),

    signUp: builder.mutation({
      query: (data) => ({
        url: '/user/sign-up',
        method: 'POST',
        body: data
      })
    }),

    getCarts: builder.query({
      query: (id) => `/cart/${id}`,
    }),

    getWishLists: builder.query({
      query: (id) => `/wishlist/${id}`,
    }),

    signIn: builder.mutation({
      query: (data) => ({
        url: '/user/sign-in',
        method: 'POST',
        body: data
      })
    })

  }),
});

export const { 
  useGetAllProductsQuery, 
  useGetPostByIdQuery,
  useGetCartsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetProductsByTypesQuery,
  useSignUpMutation,
  useSignInMutation,
  useGetProductsByFilterQuery,
  useLazyGetProductsByFilterQuery,
  useGetWishListsQuery,
  useGetRecentViewedQuery
  
} = jsonApi;