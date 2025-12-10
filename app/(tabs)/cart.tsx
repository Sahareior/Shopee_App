import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useGetCartsQuery, useGetWishListsQuery } from '../redux/slices/jsonApiSlice'
import { useDeleteCartTool, useUpdateCartTool } from '../tools/useAddToCartTool'

const { width: screenWidth } = Dimensions.get('window')

const Cart = () => {
  const { data: cartApiData, isLoading, error,refetch:cartRefetch } = useGetCartsQuery('691f393838bceee55ce53ee5')
  const { data: wishlistApiData, isLoading: wishlistLoading, error: wishlistError } = useGetWishListsQuery('693103eec8c1629ff4515f09')
  const [cartItems, setCartItems] = useState([])
    const { updateToCart } = useUpdateCartTool();
    const {deleteFromCart} = useDeleteCartTool();

  const router = useRouter()

  // Transform API data when it loads
  useEffect(() => {
    if (cartApiData?.success && cartApiData?.data) {
      const transformedItems = cartApiData?.data?.map(item => ({
        id: item._id,
        name: item.product.name,
        brand: item.product.brand || 'Brand', // You might need to add brand to your product model
        price: item.product.price,
        originalPrice: item.product.originalPrice || item.product.price * 1.2, // Calculate or fetch from API
        image: item.product.images[0],
        quantity: item.quantity,
        inStock: true, // You might want to add stock field to product
        color: 'Default',
        size: 'M',
        productId: item.product._id, // Keep reference to original product ID
        cartItemId: item._id // Keep reference to cart item ID
      }))
      setCartItems(transformedItems)
    }
  }, [cartApiData])


  
  

 const updateQuantity = (itemId, newQuantity) => {
  if (newQuantity < 1) return
  console.log("Updating quantitadadadsadzy for item:", itemId );
  // Find the item in cartItems
  const itemToUpdate = cartItems.find(item => item.id === itemId)
  if (!itemToUpdate) return
  
  // Update local state
  setCartItems(prevItems =>
    prevItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    )
  )
  
  // Prepare data for API call based on your backend requirements
  const updateData = {
    quantity: newQuantity
  }
  
  // Call the API - note: your backend expects userId and productId
  // but your useUpdateCartTool expects userid and id
  updateToCart({ 

     itemId, // This should be the productId, not cartItemId
    ...updateData 
  })
}

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId))
    deleteFromCart(itemId);
  
    // TODO: Call API to remove item from cart on server
    // You'll need a removeFromCart API call
  }

  const moveToCart = (wishlistItem) => {
    // Check if item already exists in cart
    const existingItem = cartItems.find(item => item.id === wishlistItem.id)
    if (!existingItem) {
      setCartItems(prevItems => [
        ...prevItems,
        {
          ...wishlistItem,
          quantity: 1,
          color: 'Default',
          size: 'M'
        }
      ])
    }
    // Remove from wishlist after moving to cart
 
  }

  const removeFromWishlist = (itemId) => {
   
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  console.log('wishlistApiData:', wishlistApiData?.data)

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.cartItemImage} />
      
      <View style={styles.cartItemInfo}>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        
        <View style={styles.variantInfo}>
          <Text style={styles.variantText}>Color: {item.color}</Text>
          <Text style={styles.variantText}>Size: {item.size}</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>${item.price.toFixed(2)}</Text>
          {item.originalPrice > item.price && (
            <Text style={styles.originalPrice}>${item.originalPrice.toFixed(2)}</Text>
          )}
        </View>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Ionicons name="remove" size={16} color="#333" />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Ionicons name="add" size={16} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => removeFromCart(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  )



  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="cart-outline" size={60} color="#e0e0e0" />
          <Text style={styles.loadingText}>Loading your cart...</Text>
        </View>
      </SafeAreaView>
    )
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#ff6b6b" />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorSubtitle}>Unable to load your cart</Text>
          <TouchableOpacity style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Shopping Cart</Text>
          <Text style={styles.subtitle}>{getTotalItems()} items</Text>
        </View>

        {/* Cart Items */}
        {cartItems.length > 0 ? (
          <View style={styles.section}>
            <FlatList
              data={cartItems}
              renderItem={renderCartItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.cartList}
            />
          </View>
        ) : (
          <View style={styles.emptyCart}>
            <Ionicons name="cart-outline" size={80} color="#e0e0e0" />
            <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
            <Text style={styles.emptyCartSubtitle}>
              Add some items to get started
            </Text>
            <TouchableOpacity 
              style={styles.shopButton}
              onPress={() => router.push('/home/Homepage')}
            >
              <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Wishlist Section */}
        {wishlistApiData?.data?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>From Your Wishlist</Text>
              <Text style={styles.sectionSubtitle}>Items you might want to add</Text>
            </View>
            
            <View style={{maxHeight: 300}} >
          <ScrollView>
            
          </ScrollView>
            </View>
          </View>
        )}

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${getTotalPrice().toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>
                {getTotalPrice() > 50 ? 'Free' : '$5.99'}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>
                ${(getTotalPrice() * 0.08).toFixed(2)}
              </Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ${(getTotalPrice() + (getTotalPrice() > 50 ? 0 : 5.99) + (getTotalPrice() * 0.08)).toFixed(2)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Checkout Footer */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.footerTotal}>${getTotalPrice().toFixed(2)}</Text>
            <Text style={styles.footerItems}>{getTotalItems()} items</Text>
          </View>
          
          <TouchableOpacity 
            onPress={() => router.push('/home/Homepage/payments')} 
            style={styles.checkoutButton}
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

export default Cart

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#004CFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cartList: {
    gap: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cartItemImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  brand: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
    lineHeight: 18,
  },
  variantInfo: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  variantText: {
    fontSize: 12,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    minWidth: 20,
    textAlign: 'center',
  },
  deleteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyCartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCartSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  shopButton: {
    backgroundColor: '#9b31adff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  shopButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  wishlistList: {
    gap: 12,
  },
  wishlistItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  wishlistItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  outOfStockText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  wishlistItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  ratingText: {
    fontSize: 11,
    color: '#666',
  },
  wishlistActions: {
    flexDirection: 'row',
    gap: 8,
  },
  moveToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#004CFF',
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
  },
  moveToCartText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  disabledButtonText: {
    color: '#999',
  },
  wishlistDeleteButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004CFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 16,
  },
  totalContainer: {
    flex: 1,
  },
  footerTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  footerItems: {
    fontSize: 14,
    color: '#666',
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#9b31adff',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 12,
    flex: 2,
    justifyContent: 'center',
  },
  checkoutText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
})