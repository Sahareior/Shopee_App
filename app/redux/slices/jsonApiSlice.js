// src/features/api/jsonApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const jsonApi = createApi({
  reducerPath: 'jsonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://192.168.1.200:8000' }),
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => 'posts',
    }),

// In your Redux slice (jsonApiSlice.js or similar)
getProductsByFilter: builder.query({
  query: (params = {}) => {
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
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params;

    // Build query string
    const queryParams = new URLSearchParams();
    
    if (category) queryParams.append('category', category);
    if (brand) queryParams.append('brand', brand);
    if (minPrice) queryParams.append('minPrice', minPrice);
    if (maxPrice) queryParams.append('maxPrice', maxPrice);
    if (rating) queryParams.append('rating', rating);
    if (color) queryParams.append('color', color);
    if (size) queryParams.append('size', size);
    if (search) queryParams.append('search', search);
    
    // Handle boolean and array parameters
    if (inStock !== undefined) queryParams.append('inStock', inStock);
    if (labels) {
      if (Array.isArray(labels)) {
        labels.forEach(label => queryParams.append('labels', label));
      } else {
        queryParams.append('labels', labels);
      }
    }
    
    // Pagination and sorting
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    queryParams.append('sortBy', sortBy);
    queryParams.append('sortOrder', sortOrder);

    const queryString = queryParams.toString();
    return `/products/filter${queryString ? `?${queryString}` : ''}`;
  },
  providesTags: (result, error, params) =>
    result
      ? [
          ...result.map(({ _id }) => ({ type: 'Products', id: _id })),
          { type: 'Products', id: 'FILTERED_LIST' },
        ]
      : [{ type: 'Products', id: 'FILTERED_LIST' }],
}),

    getPostById: builder.query({
      query: (id) => `posts/${id}`,
    }),
    getCategories: builder.query({
      query: () => '/categories'
    }),
    getProductsByTypes: builder.query({
      query:(type) => `/products/${type}`
    }),

    signUp: builder.mutation({
      query:(data) => ({
        url: '/user/sign-up',
        method:"POST",
        body:data
      })
    }),

    signIn: builder.mutation({
      query:(data) => ({
        url:'/user/sign-in',
        method:'POST',
        body:data
      })
    })

  }),
});

export const { useGetAllProductsQuery, useGetPostByIdQuery,useGetCategoriesQuery,
  useGetProductsByTypesQuery,useSignUpMutation,useSignInMutation,useGetProductsByFiltterQuery,
  useLazyGetProductsByFilterQuery
 } = jsonApi;
