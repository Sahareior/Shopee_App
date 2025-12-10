import { useAddCartMutation, useAddWishlistMutation, useDeleteCartMutation, useDeleteWishlistMutation, useGetCartsQuery, useGetWishListsQuery, useUpdateCartMutation } from "../redux/slices/jsonApiSlice";
import { useToast } from "react-native-toast-notifications";

// Custom hook for cart refetching
export const useCartRefetch = () => {
  const { refetch: cartRefetch } = useGetCartsQuery();
  return cartRefetch;
};

// Custom hook for wishlist refetching
export const useWishlistRefetch = () => {
  const { refetch: wishlistRefetch } = useGetWishListsQuery();
  return wishlistRefetch;
};

export const useAddToCartTool = () => {
  const [addCart, { isLoading, isSuccess, isError, error }] =
    useAddCartMutation();

  const toast = useToast();
  const cartRefetch = useCartRefetch();

  const addToCart = async ({ user, product, quantity }) => {
    try {
      const result = await addCart({ user, product, quantity }).unwrap();
      
      // Call the refetch function
      await cartRefetch();

      toast.show("Added to cart successfully!", {
        type: "success",
        placement: "top",
        duration: 2000,
          offset: 90, 
      });

      return result;
    } catch (err) {
      console.error("Failed to add to cart:", err);

      toast.show("Failed to add to cart", {
        type: "danger",
        placement: "top",
          offset: 40, 
      });

      throw err;
    }
  };

  return { addToCart, isLoading, isSuccess, isError, error };
};

export const useUpdateCartTool = () => {
  const [updateCart, { isLoading, isSuccess, isError, error }] =
    useUpdateCartMutation(); 
  const toast = useToast();
  const cartRefetch = useCartRefetch();

  const updateToCart = async ({ itemId, ...data }) => {
    console.log("Updating cart item:", itemId, data);
    try {
      const result = await updateCart({ itemId, ...data }).unwrap();
      
      // Call the refetch function
      await cartRefetch();
      
      toast.show("Quantity updated successfully!", {
        type: "success",
        placement: "top",
        duration: 2000,
          offset: 40, 
      });
      return result;
    } catch (err) {
      console.error("Failed to update cart:", err);

      toast.show("Failed to update cart", {
        type: "danger",
        placement: "top",
      });
      throw err;
    }
  };

  return { updateToCart, isLoading, isSuccess, isError, error };
};

export const useDeleteCartTool = () => {
  const [deleteCart, { isLoading, isSuccess, isError, error }] =
    useDeleteCartMutation(); 
  const toast = useToast();
  const cartRefetch = useCartRefetch();

  const deleteFromCart = async (id) => {
    try {
      const result = await deleteCart(id).unwrap();
      
      // Call the refetch function
      await cartRefetch();
      
      toast.show("Item deleted from cart successfully!", {
        type: "success",
        placement: "top",
        duration: 2000,
          offset: 40, 
      });
      return result;
    } catch (err) {
      console.error("Failed to delete item from cart:", err);
      toast.show("Failed to delete item from cart", {
        type: "danger",
        placement: "top",
      });
      throw err;
    }
  };

  return { deleteFromCart, isLoading, isSuccess, isError, error };
};

export const useAddToWishlistTool = () => {
  const [addWishlist, { isLoading, isSuccess, isError, error }] =
    useAddWishlistMutation();
  const toast = useToast();
  const wishlistRefetch = useWishlistRefetch(); // Call it here, get the function

  const addToWishlist = async ({ user, product }) => {
    try {
      const result = await addWishlist({ product }).unwrap();
      
      // Call the refetch function
      await wishlistRefetch();

      toast.show("Added to wishlist successfully!", {
        type: "success",
        placement: "top",
        duration: 2000,
          offset: 40, 
      });
      
      return result;
    } catch (err) {
      console.error("Failed to add to wishlist:", err);

      let errorMessage = "Failed to add to wishlist";
      
      // Check if it's a duplicate error
      if (err?.status === 409 || err?.data?.message?.includes("already")) {
        errorMessage = "Already in wishlist";
        toast.show(errorMessage, {
          type: "warning",
          placement: "top",
          duration: 2000,
            offset: 40, 
        });
        return null; // Return null instead of throwing for duplicate case
      } 
      else if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      toast.show(errorMessage, {
        type: "danger",
        placement: "top",
          offset: 40, 
      });
      throw err;
    }
  };

  return { addToWishlist, isLoading, isSuccess, isError, error };
};

export const useDeleteWishlistTool = () => {
  const [deleteWishlist, { isLoading, isSuccess, isError, error }] =
    useDeleteWishlistMutation(); 
  const toast = useToast();
  const wishlistRefetch = useWishlistRefetch(); // Call it here, get the function

  const deleteFromWishlist = async (id) => {
    try {
      const result = await deleteWishlist(id).unwrap();
      
      // Call the refetch function
      await wishlistRefetch();
      
      toast.show("Item deleted from wishlist successfully!", {
        type: "success",
        placement: "top",
        duration: 2000,
          offset: 40, 
      });
      
      return result;
    } catch (err) {
      console.error("Failed to delete item from wishlist:", err);
      
      let errorMessage = "Failed to delete item from wishlist";
      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      toast.show(errorMessage, {
        type: "danger",
        placement: "top",
          offset: 40, 
      });
      throw err;
    }
  };

  return { deleteFromWishlist, isLoading, isSuccess, isError, error };
};

// Advanced: Toggle wishlist item (add/remove based on current state)
export const useToggleWishlistTool = () => {
  const { addToWishlist } = useAddToWishlistTool();
  const { deleteFromWishlist } = useDeleteWishlistTool();
  const { data: wishlistData } = useGetWishListsQuery();
  const toast = useToast();

  const toggleWishlist = async ({ user, product }) => {
    try {
      if (!user || !product) {
        throw new Error("User and Product are required");
      }

      // Check if product is already in wishlist
      const isInWishlist = wishlistData?.data?.some(
        item => item.product?._id === product
      );

      if (isInWishlist) {
        // Find the wishlist item ID
        const wishlistItem = wishlistData?.data?.find(
          item => item.product?._id === product
        );
        
        if (wishlistItem?._id) {
          await deleteFromWishlist(wishlistItem._id);
          toast.show("Removed from wishlist", {
            type: "success",
            placement: "top",
            duration: 2000,
              offset: 40, 
          });
          return { action: 'removed', data: wishlistItem };
        }
      } else {
        const result = await addToWishlist({ user, product });
        if (result) {
          toast.show("Added to wishlist", {
            type: "success",
            placement: "top",
            duration: 2000,
              offset: 40, 
          });
          return { action: 'added', data: result };
        }
      }
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
      throw err;
    }
  };

  return { toggleWishlist };
};

// Utility hook to check if a product is in wishlist
export const useCheckWishlistStatus = () => {
  const { data: wishlistData } = useGetWishListsQuery();

  const isInWishlist = (productId) => {
    if (!productId || !wishlistData?.data) return false;
    
    return wishlistData.data.some(
      item => item.product?._id === productId
    );
  };

  const getWishlistItemId = (productId) => {
    if (!productId || !wishlistData?.data) return null;
    
    const item = wishlistData.data.find(
      item => item.product?._id === productId
    );
    
    return item?._id || null;
  };

  return { 
    isInWishlist, 
    getWishlistItemId,
    wishlistItems: wishlistData?.data || [] 
  };
};