import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import JustForYou from '../home/Homepage/JustForYou'
import RecentlyViewed from '../home/Homepage/RecentlyViewed'
import { useGetProductsByTypesQuery, useGetRecentViewedQuery, useGetWishListsQuery } from '../redux/slices/jsonApiSlice'
import { useDeleteWishlistTool } from '../tools/useAddToCartTool'

const { width: screenWidth } = Dimensions.get('window')

const Wishlist = () => {
  const { data: productByType, isLoading: isLoadingProducts } = useGetProductsByTypesQuery('top_product')
  const { data: forYou, isLoading: isLoadingForYou } = useGetProductsByTypesQuery('just_for_you')
  const { data: recentlyViewedData, isLoading: isLoadingRecent, refetch: refetchRecent } = useGetRecentViewedQuery('693103eec8c1629ff4515f09')
  const { data: wishlistData, isLoading: isLoadingWishlist, refetch: refetchWishlist } = useGetWishListsQuery('691f393838bceee55ce53ee5')
  const {deleteFromWishlist} = useDeleteWishlistTool()
  
  // State to manage local wishlist while APIs handle persistence
  const [wishlistItems, setWishlistItems] = useState([])

  // Transform API data to match component structure
  const transformWishlistData = (data) => {
    if (!data?.success || !data.data) return []
    
    return data.data.map((item) => ({
      id: item._id,
      productId: item.product._id,
      name: item.product.name,
      brand: item.product.brand || 'Brand',
      price: item.product.price,
      originalPrice: item.product.originalPrice || Math.round(item.product.price * 1.2),
      image: item.product.images?.[0] || 'https://via.placeholder.com/100',
      inStock: item.product.inStock !== undefined ? item.product.inStock : true,
      rating: item.product.rating || 4.5,
      reviewCount: item.product.reviewCount || Math.floor(Math.random() * 100) + 1,
      discount: Math.round(((item.product.originalPrice || Math.round(item.product.price * 1.2)) - item.product.price) / (item.product.originalPrice || Math.round(item.product.price * 1.2)) * 100)
    }))
  }

  const transformRecentViewedData = (data) => {
    if (!data?.success || !data.data) return []
    
    return data.data.map((item) => ({
      _id: item._id,
      product: {
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        images: item.product.images || []
      }
    }))
  }

  // Initialize data from API
  useEffect(() => {
    if (wishlistData) {
      const transformedData = transformWishlistData(wishlistData)
      setWishlistItems(transformedData)
    }
  }, [wishlistData])

  const recentlyViewed = transformRecentViewedData(recentlyViewedData)

  const handleRemoveFromWishlist = async (itemId) => {
 console.log('Removing from wishlist:', itemId)
    try {
      await deleteFromWishlist(itemId)
      // Update local state
      setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
      // Optionally refetch from API to ensure sync
     
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }

  const handleMoveToCart = (item) => {
    Alert.alert(
      "Move to Cart",
      `Add "${item.name}" to your cart?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Add to Cart", 
          onPress: () => {
            console.log('Moving to cart:', item.name)
            // First you would call add to cart API
            // Then remove from wishlist
            handleRemoveFromWishlist(item.id)
          }
        }
      ]
    )
  }

  const handleClearAllWishlist = () => {
    if (wishlistItems.length === 0) return
    
    Alert.alert(
      "Clear All",
      "Are you sure you want to remove all items from your wishlist?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear All", 
          style: "destructive",
          onPress: () => {
            setWishlistItems([])
            // Note: In production, you would need to call your clear all API here
            // Example: await clearAllWishlistAPI()
            // Then refetch: refetchWishlist()
          }
        }
      ]
    )
  }

  const renderWishlistItem = ({ item }) => (
    <View style={styles.wishlistItem}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.productImage}
        contentFit="cover"
        transition={200}
      />
      
      {!item.inStock && (
        <View style={styles.outOfStockOverlay}>
          <Text style={styles.outOfStockText}>Out of Stock</Text>
        </View>
      )}
      
      <View style={styles.productInfo}>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        
        <View style={styles.ratingContainer}>
          <View style={styles.stars}>
            {[...Array(5)].map((_, index) => (
              <Ionicons
                key={index}
                name={index < Math.floor(item.rating) ? "star" : "star-outline"}
                size={12}
                color="#FFD700"
              />
            ))}
          </View>
          <Text style={styles.ratingText}>({item.reviewCount})</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>${item.price.toFixed(2)}</Text>
          <Text style={styles.originalPrice}>${item.originalPrice.toFixed(2)}</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {item.discount}%
            </Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[
              styles.cartButton,
              !item.inStock && styles.disabledButton
            ]}
            onPress={() => handleMoveToCart(item)}
            disabled={!item.inStock}
          >
            <Ionicons name="cart-outline" size={16} color={item.inStock ? "#fff" : "#999"} />
            <Text style={[
              styles.cartButtonText,
              !item.inStock && styles.disabledButtonText
            ]}>
              {item.inStock ? 'Move to Cart' : 'Out of Stock'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleRemoveFromWishlist(item.id)}
          >
            <Ionicons name="trash-outline" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  const renderRecentItem = ({ item }) => (
    <TouchableOpacity style={styles.recentItem}>
      <Image 
        source={{ uri: item.product.images[0] }} 
        style={styles.recentItemImage}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.recentItemInfo}>
        <Text style={styles.recentItemName} numberOfLines={1}>
          {item.product.name}
        </Text>
        <Text style={styles.recentItemPrice}>${item.product.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  )

  if (isLoadingWishlist) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004CFF" />
        <Text style={styles.loadingText}>Loading your wishlist...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Wishlist Header (moved above top products to avoid overlap) */}
        <View style={styles.headerCard}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="heart" size={22} color="#FF4444" style={styles.headerIcon} />
              <View>
                <Text style={styles.title}>My Wishlist</Text>
                <Text style={styles.subtitle}>{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved</Text>
              </View>
            </View>

          </View>
        </View>

        <RecentlyViewed from='home' data={productByType} />
        
        {/* Wishlist Items */}
<View>
          {wishlistItems.length > 0 ? (
          <FlatList
            data={wishlistItems}
            renderItem={renderWishlistItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.wishlistList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={80} color="#e0e0e0" />
            <Text style={styles.emptyStateTitle}>Your wishlist is empty</Text>
            <Text style={styles.emptyStateSubtitle}>
              Save your favorite items here to keep track of them
            </Text>
            <TouchableOpacity style={styles.shopNowButton}>
              <Text style={styles.shopNowText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        )}
</View>

        {/* Recently Viewed Section */}
        {wishlistItems.length > 0 && recentlyViewed.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recently Viewed</Text>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
                <Ionicons name="arrow-forward" size={16} color="#004CFF" />
              </TouchableOpacity>
            </View>
            
            {/* Recently Viewed Items */}
            <FlatList
              data={recentlyViewed}
              renderItem={renderRecentItem}
              keyExtractor={(item) => item._id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentlyViewedContainer}
            />
          </View>
        )}

        {/* Recommendations */}
        <View style={{paddingTop:30}}>
          <JustForYou data={forYou} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Wishlist

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
  headerIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0A0A0A',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  clearAllText: {
    fontSize: 14,
    color: '#FF4444',
    fontWeight: '600',
  },
  wishlistList: {
    padding: 2,
  },
  wishlistItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
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
  productImage: {
    width: 100,
    height: 100,
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
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  brand: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
    lineHeight: 18,
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
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
  discountBadge: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    width: 159,
    backgroundColor: '#004CFF',
    paddingVertical: 6,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
  },
  cartButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  disabledButtonText: {
    color: '#999',
  },
  deleteButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  shopNowButton: {
    backgroundColor: '#004CFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopNowText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: '#004CFF',
    fontWeight: '600',
  },
  recentlyViewedContainer: {
    paddingRight: 20,
  },
  recentItem: {
    width: 100,
    marginRight: 12,
  },
  recentItemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  recentItemInfo: {
    marginTop: 8,
  },
  recentItemName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  recentItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
})