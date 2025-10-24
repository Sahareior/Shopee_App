import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import RecentlyViewed from '../home/Homepage/RecentlyViewed'
import JustForYou from '../home/Homepage/JustForYou'

const { width: screenWidth } = Dimensions.get('window')

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      brand: 'AudioTech',
      price: 199.99,
      originalPrice: 299.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
      inStock: true,
      rating: 4.5,
      reviewCount: 128,
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      brand: 'FitGear',
      price: 149.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
      inStock: true,
      rating: 4.2,
      reviewCount: 89,
    },
    {
      id: 3,
      name: 'Minimalist Backpack',
      brand: 'UrbanPack',
      price: 79.99,
      originalPrice: 99.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
      inStock: false,
      rating: 4.7,
      reviewCount: 204,
    },
    {
      id: 4,
      name: 'Organic Cotton T-Shirt',
      brand: 'EcoWear',
      price: 29.99,
      originalPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
      inStock: true,
      rating: 4.3,
      reviewCount: 67,
    },
    {
      id: 5,
      name: 'Ceramic Coffee Mug Set',
      brand: 'HomeEssentials',
      price: 34.99,
      originalPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
      inStock: true,
      rating: 4.8,
      reviewCount: 156,
    }
  ])

  const removeFromWishlist = (itemId) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== itemId))
  }

  const moveToCart = (item) => {
    // Implement move to cart logic here
    console.log('Moving to cart:', item.name)
    // You can remove from wishlist after moving to cart
    // removeFromWishlist(item.id)
  }

  const clearAllWishlist = () => {
    setWishlistItems([])
  }

  const renderWishlistItem = ({ item }) => (
    <View style={styles.wishlistItem}>
      <Image 
        source={item.image} 
        style={styles.productImage}
        contentFit="cover"
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
          <Text style={styles.currentPrice}>${item.price}</Text>
          <Text style={styles.originalPrice}>${item.originalPrice}</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
            </Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[
              styles.cartButton,
              !item.inStock && styles.disabledButton
            ]}
            onPress={() => moveToCart(item)}
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
            onPress={() => removeFromWishlist(item.id)}
          >
            <Ionicons name="trash-outline" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <RecentlyViewed from='home' />
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Wishlist</Text>
            <Text style={styles.subtitle}>{wishlistItems.length} items saved</Text>
          </View>
          
          {wishlistItems.length > 0 && (
            <TouchableOpacity style={styles.clearAllButton} onPress={clearAllWishlist}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Wishlist Items */}
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

        {/* Recently Viewed Section */}
        {wishlistItems.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recently Viewed</Text>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
                <Ionicons name="arrow-forward" size={16} color="#004CFF" />
              </TouchableOpacity>
            </View>
            
            {/* Recently Viewed Items */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentlyViewedContainer}
            >
              {wishlistItems.slice(0, 3).map((item) => (
                <TouchableOpacity key={item.id} style={styles.recentItem}>
                  <Image 
                    source={item.image} 
                    style={styles.recentItemImage}
                    contentFit="cover"
                  />
                  <View style={styles.recentItemInfo}>
                    <Text style={styles.recentItemPrice}>${item.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Recommendations */}
<View style={{paddingTop:30}}>
  <JustForYou />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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
    padding: 10,
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
    width:159,
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
    gap: 12,
  },
  recentItem: {
    width: 80,
    marginRight: 12,
  },
  recentItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  recentItemInfo: {
    marginTop: 8,
  },
  recentItemPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  recommendationsContainer: {
    gap: 12,
  },
  recommendationItem: {
    width: 150,
    marginRight: 12,
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
  recommendationImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationBrand: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
    marginBottom: 2,
  },
  recommendationName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
    lineHeight: 16,
  },
  recommendationPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  recommendationCurrentPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  recommendationOriginalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  addToWishlistButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
})