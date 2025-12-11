import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Dimensions, Modal, Animated } from 'react-native'
import React, { useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import JustForYou from '../JustForYou'
import { usePostRecentViewedMutation } from '@/app/redux/slices/jsonApiSlice'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const Details = () => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedColor, setSelectedColor] = useState(0)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [showOptionsDrawer, setShowOptionsDrawer] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [postRecentViewed] = usePostRecentViewedMutation()
  
  const slideAnim = useRef(new Animated.Value(screenHeight)).current

  // Product data
  const product = {
    id: 1,
    name: 'Premium Wireless Headphones',
    brand: 'AudioTech',
    price: 299.99,
    discountPrice: 199.99,
    rating: 4.5,
    reviewCount: 128,
    description: 'Experience premium sound quality with our latest wireless headphones. Featuring noise cancellation, 30-hour battery life, and comfortable over-ear design perfect for all-day use.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521334884684-d80222895322?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { id: 1, name: 'Black', value: '#000000' },
      { id: 2, name: 'Silver', value: '#C0C0C0' },
      { id: 3, name: 'Blue', value: '#0047AB' },
      { id: 4, name: 'Red', value: '#FF4444' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    specifications: [
      { label: 'Brand', value: 'AudioTech' },
      { label: 'Model', value: 'WH-2024' },
      { label: 'Connectivity', value: 'Bluetooth 5.2' },
      { label: 'Battery Life', value: '30 hours' },
      { label: 'Charging Time', value: '2 hours' },
      { label: 'Weight', value: '250g' },
      { label: 'Warranty', value: '2 years' }
    ],
    deliveryMethods: [
      { id: 1, name: 'Standard Delivery', price: 'Free', duration: '3-5 days', icon: 'car-outline' },
      { id: 2, name: 'Express Delivery', price: '$9.99', duration: '1-2 days', icon: 'rocket-outline' },
      { id: 3, name: 'Same Day Delivery', price: '$19.99', duration: 'Today', icon: 'flash-outline' }
    ],
    reviews: [
      {
        id: 1,
        user: { name: 'Sarah M.', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.1.0&auto=format&fit=crop&w=200&q=80' },
        rating: 5,
        comment: 'Amazing sound quality! The noise cancellation is incredible and battery life lasts forever.',
        date: '2 days ago',
        likes: 24
      },
      {
        id: 2,
        user: { name: 'Mike R.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&auto=format&fit=crop&w=200&q=80' },
        rating: 4,
        comment: 'Very comfortable for long sessions. The build quality is excellent.',
        date: '1 week ago',
        likes: 18
      },
      {
        id: 3,
        user: { name: 'Emma L.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.1.0&auto=format&fit=crop&w=200&q=80' },
        rating: 5,
        comment: 'Best headphones I have ever owned. Worth every penny!',
        date: '2 weeks ago',
        likes: 31
      },
      {
        id: 4,
        user: { name: 'John D.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.1.0&auto=format&fit=crop&w=200&q=80' },
        rating: 3,
        comment: 'Good sound but the ear cushions could be more comfortable.',
        date: '3 weeks ago',
        likes: 8
      }
    ]
  }

  const openOptionsDrawer = () => {
    setShowOptionsDrawer(true)
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const closeOptionsDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowOptionsDrawer(false)
    })
  }

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1)
  }

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Added to cart:', {
      product: product.name,
      color: product.colors[selectedColor].name,
      size: selectedSize,
      quantity: quantity,
      price: product.discountPrice
    })
    closeOptionsDrawer()
  }

  const handleBuyNow = () => {
    // Buy now logic here
    console.log('Buy now:', {
      product: product.name,
      color: product.colors[selectedColor].name,
      size: selectedSize,
      quantity: quantity,
      price: product.discountPrice
    })
    closeOptionsDrawer()
  }

  const handleAddToWishlist = () => {
    // Add to wishlist logic here
    console.log('Added to wishlist:', {
      product: product.name,
      color: product.colors[selectedColor].name,
      size: selectedSize
    })
    closeOptionsDrawer()
  }

  const displayedReviews = showAllReviews ? product.reviews : product.reviews.slice(0, 2)

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Image source={item.user.avatar} style={styles.reviewAvatar} />
        <View style={styles.reviewUserInfo}>
          <Text style={styles.reviewUserName}>{item.user.name}</Text>
          <View style={styles.reviewRating}>
            {[...Array(5)].map((_, index) => (
              <Ionicons
                key={index}
                name={index < item.rating ? "star" : "star-outline"}
                size={14}
                color="#FFD700"
              />
            ))}
          </View>
        </View>
        <Text style={styles.reviewDate}>{item.date}</Text>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
      <View style={styles.reviewFooter}>
        <TouchableOpacity style={styles.likeButton}>
          <Ionicons name="heart-outline" size={16} color="#666" />
          <Text style={styles.likeCount}>{item.likes}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        <View style={styles.imageSection}>
          <Image 
            source={product.images[selectedImage]} 
            style={styles.mainImage}
            contentFit="cover"
          />
          
          {/* Image Thumbnails */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailsContainer}
            contentContainerStyle={styles.thumbnailsContent}
          >
            {product.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.thumbnail,
                  selectedImage === index && styles.thumbnailSelected
                ]}
                onPress={() => setSelectedImage(index)}
              >
                <Image 
                  source={image} 
                  style={styles.thumbnailImage}
                  contentFit="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <View style={styles.header}>
            <Text style={styles.brand}>{product.brand}</Text>
            <View style={styles.productNameRow}>
              <Text style={styles.productName}>{product.name}</Text>
              <TouchableOpacity onPress={openOptionsDrawer}>
                <Ionicons name="arrow-forward" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>
                {[...Array(5)].map((_, index) => (
                  <Ionicons
                    key={index}
                    name={index < Math.floor(product.rating) ? "star" : "star-outline"}
                    size={16}
                    color="#FFD700"
                  />
                ))}
              </View>
              <Text style={styles.ratingText}>({product.reviewCount} reviews)</Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.discountPrice}>${product.discountPrice}</Text>
            <Text style={styles.originalPrice}>${product.price}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{product.description}</Text>

          {/* Color Variation */}
          <View style={styles.variationSection}>
            <Text style={styles.variationTitle}>Color</Text>
            <View style={styles.colorsContainer}>
              {product.colors.map((color, index) => (
                <TouchableOpacity
                  key={color.id}
                  style={[
                    styles.colorOption,
                    selectedColor === index && styles.colorOptionSelected,
                    { backgroundColor: color.value }
                  ]}
                  onPress={() => setSelectedColor(index)}
                >
                  {selectedColor === index && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Size Variation */}
          <View style={styles.variationSection}>
            <Text style={styles.variationTitle}>Size</Text>
            <View style={styles.sizesContainer}>
              {product.sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeOption,
                    selectedSize === size && styles.sizeOptionSelected
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[
                    styles.sizeText,
                    selectedSize === size && styles.sizeTextSelected
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Specifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specifications</Text>
          {product.specifications.map((spec, index) => (
            <View key={index} style={styles.specRow}>
              <Text style={styles.specLabel}>{spec.label}</Text>
              <Text style={styles.specValue}>{spec.value}</Text>
            </View>
          ))}
        </View>

        {/* Delivery Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Options</Text>
          {product.deliveryMethods.map((method) => (
            <View key={method.id} style={styles.deliveryOption}>
              <Ionicons name={method.icon} size={24} color="#004CFF" />
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryName}>{method.name}</Text>
                <Text style={styles.deliveryDuration}>{method.duration}</Text>
              </View>
              <Text style={styles.deliveryPrice}>{method.price}</Text>
            </View>
          ))}
        </View>

        {/* Ratings & Reviews */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
            <View style={styles.ratingSummary}>
              <Text style={styles.overallRating}>{product.rating}</Text>
              <View style={styles.ratingStars}>
                {[...Array(5)].map((_, index) => (
                  <Ionicons
                    key={index}
                    name={index < Math.floor(product.rating) ? "star" : "star-outline"}
                    size={16}
                    color="#FFD700"
                  />
                ))}
              </View>
              <Text style={styles.totalReviews}>{product.reviewCount} reviews</Text>
            </View>
          </View>

          <FlatList
            data={displayedReviews}
            renderItem={renderReviewItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            style={styles.reviewsList}
          />

          {product.reviews.length > 2 && (
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => setShowAllReviews(!showAllReviews)}
            >
              <Text style={styles.viewAllText}>
                {showAllReviews ? 'Show Less' : `View All Reviews (${product.reviewCount})`}
              </Text>
              <Ionicons 
                name={showAllReviews ? "chevron-up" : "chevron-down"} 
                size={16} 
                color="#004CFF" 
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={{marginTop:40}}>
          <JustForYou />
        </View>
      </ScrollView>

      {/* Options Drawer Modal */}
      <Modal
        visible={showOptionsDrawer}
        transparent={true}
        animationType="slide"
        onRequestClose={closeOptionsDrawer}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.overlayTouchable}
            onPress={closeOptionsDrawer}
          />
          <Animated.View 
            style={[
              styles.drawerContainer,
              {
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Select Options</Text>
              <TouchableOpacity onPress={closeOptionsDrawer}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.drawerContent}>
              {/* Product Preview */}
              <View style={styles.productPreview}>
                <Image 
                  source={product.images[selectedImage]} 
                  style={styles.previewImage}
                  contentFit="cover"
                />
                <View style={styles.previewInfo}>
                  <Text style={styles.previewName}>{product.name}</Text>
                  <Text style={styles.previewPrice}>${product.discountPrice}</Text>
                </View>
              </View>

              {/* Color Selection */}
              <View style={styles.drawerSection}>
                <Text style={styles.drawerSectionTitle}>Color</Text>
                <View style={styles.colorsContainer}>
                  {product.colors.map((color, index) => (
                    <TouchableOpacity
                      key={color.id}
                      style={[
                        styles.colorOption,
                        selectedColor === index && styles.colorOptionSelected,
                        { backgroundColor: color.value }
                      ]}
                      onPress={() => setSelectedColor(index)}
                    >
                      {selectedColor === index && (
                        <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Size Selection */}
              <View style={styles.drawerSection}>
                <Text style={styles.drawerSectionTitle}>Size</Text>
                <View style={styles.sizesContainer}>
                  {product.sizes.map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeOption,
                        selectedSize === size && styles.sizeOptionSelected
                      ]}
                      onPress={() => setSelectedSize(size)}
                    >
                      <Text style={[
                        styles.sizeText,
                        selectedSize === size && styles.sizeTextSelected
                      ]}>
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Quantity Selection */}
              <View style={styles.drawerSection}>
                <Text style={styles.drawerSectionTitle}>Quantity</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={decreaseQuantity}
                  >
                    <Ionicons name="remove" size={20} color="#333" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={increaseQuantity}
                  >
                    <Ionicons name="add" size={20} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.wishlistButtonDrawer}
                onPress={handleAddToWishlist}
              >
                <Ionicons name="heart-outline" size={24} color="#333" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.addToCartButtonDrawer}
                onPress={handleAddToCart}
              >
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.buyNowButton}
                onPress={handleBuyNow}
              >
                <Text style={styles.buyNowText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default Details

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageSection: {
    marginBottom: 20,
  },
  mainImage: {
    width: screenWidth,
    height: 400,
  },
  thumbnailsContainer: {
    marginTop: 12,
    paddingHorizontal: 10,
  },
  thumbnailsContent: {
    gap: 12,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbnailSelected: {
    borderColor: '#004CFF',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  infoSection: {
    padding: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  header: {
    marginBottom: 16,
  },
  brand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  productNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  discountPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 24,
  },
  variationSection: {
    marginBottom: 24,
  },
  variationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  colorsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#004CFF',
  },
  sizesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sizeOptionSelected: {
    backgroundColor: '#004CFF',
    borderColor: '#004CFF',
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sizeTextSelected: {
    color: 'white',
  },
  section: {
    padding: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  specLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  specValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  deliveryDuration: {
    fontSize: 14,
    color: '#666',
  },
  deliveryPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004CFF',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  ratingSummary: {
    alignItems: 'center',
  },
  overallRating: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 4,
  },
  totalReviews: {
    fontSize: 12,
    color: '#666',
  },
  reviewsList: {
    marginBottom: 16,
  },
  reviewItem: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 1,
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 8,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeCount: {
    fontSize: 12,
    color: '#666',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004CFF',
  },
  // Drawer Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  drawerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.8,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  drawerContent: {
    padding: 20,
  },
  productPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  previewPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004CFF',
  },
  drawerSection: {
    marginBottom: 24,
  },
  drawerSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    minWidth: 40,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  wishlistButtonDrawer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addToCartButtonDrawer: {
    flex: 1,
    backgroundColor: '#004CFF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buyNowText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
})