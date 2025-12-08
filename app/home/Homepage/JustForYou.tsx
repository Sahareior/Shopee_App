import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'

const JustForYou = ({data}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()
  
  // Use the data prop instead of static array
  const allProducts = data || []
  
  const productsPerPage = 8
  const totalPages = Math.ceil(allProducts.length / productsPerPage)
  
  // Get screen width for responsive design
  const { width } = Dimensions.get('window')
  const cardWidth = (width - 34) / 2 // 11px padding on each side + 12px gap

  // Get products for current page
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage
    const endIndex = startIndex + productsPerPage
    return allProducts.slice(startIndex, endIndex)
  }

  // Group products into pairs for 2 per row
  const groupProductsIntoPairs = (products) => {
    const pairs = []
    for (let i = 0; i < products.length; i += 2) {
      const pair = products.slice(i, i + 2)
      pairs.push(pair)
    }
    return pairs
  }

  const currentProducts = getCurrentPageProducts()
  const productPairs = groupProductsIntoPairs(currentProducts)

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5 // Show max 5 page numbers
    let startPage = 1
    let endPage = totalPages
    
    if (totalPages > maxPagesToShow) {
      const halfMaxPages = Math.floor(maxPagesToShow / 2)
      startPage = Math.max(1, currentPage - halfMaxPages)
      endPage = startPage + maxPagesToShow - 1
      
      if (endPage > totalPages) {
        endPage = totalPages
        startPage = Math.max(1, endPage - maxPagesToShow + 1)
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  const renderProductRow = (pair, index) => (
    <View key={`row-${index}`} style={styles.productRow}>
      {pair.map((product) => {
        // Calculate discount percentage if discountPrice exists
        const hasDiscount = product.discountPrice && product.price > product.discountPrice
        const discountPercentage = hasDiscount 
          ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
          : null
        
        // Check if product is new
        const isNewItem = product.labels?.includes('new_item')

        return (
          <View key={product._id} style={[
            styles.productCardWrapper,
            // If there's only one item in the pair, apply specific styling
            pair.length === 1 && styles.singleItemWrapper
          ]}>
            <TouchableOpacity 
              onPress={()=> router.push(`/product/${product._id}`)} 
              style={[
                styles.productCard,
                // Fixed width for single items
                pair.length === 1 && styles.singleItemCard
              ]}
            >
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: product.images[0] }} 
                  style={styles.productImage}
                  contentFit="cover"
                />
                {/* Discount Badge */}
                {discountPercentage && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
                  </View>
                )}
                {/* New Badge */}
                {isNewItem && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                
                {/* Brand */}
                <Text style={styles.brandText} numberOfLines={1}>{product.brand}</Text>
                
                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>⭐ {product.rating?.toFixed(1) || '4.0'}</Text>
                  <Text style={styles.reviews}>({product.reviews || 0})</Text>
                </View>
                
                <View style={styles.priceContainer}>
                  {hasDiscount ? (
                    <>
                      <Text style={styles.currentPrice}>${product.discountPrice.toFixed(2)}</Text>
                      <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
                    </>
                  ) : (
                    <Text style={styles.currentPrice}>${product.price.toFixed(2)}</Text>
                  )}
                </View>

                {/* Labels */}
                {product.labels && product.labels.length > 0 && (
                  <View style={styles.labelsContainer}>
                    {product.labels.slice(0, 2).map((label, labelIndex) => {
                      // Get display text for label
                      let displayText = ''
                      switch(label) {
                        case 'new_item':
                          displayText = 'New'
                          break
                        case 'top_product':
                          displayText = 'Top'
                          break
                        case 'just_for_you':
                          displayText = 'For You'
                          break
                        case 'flash_deal':
                          displayText = 'Flash'
                          break
                        default:
                          displayText = label
                      }

                      return (
                        <View key={labelIndex} style={styles.labelChip}>
                          <Text style={styles.labelText}>{displayText}</Text>
                        </View>
                      )
                    })}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        )
      })}
    </View>
  )

  const pageNumbers = getPageNumbers()

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Just For You</Text>
        <Text style={styles.subtitle}>Personalized recommendations</Text>
      </View>

      {/* Products Grid using ScrollView instead of FlatList */}
      {allProducts.length > 0 ? (
        <>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
          >
            {productPairs.map((pair, index) => renderProductRow(pair, index))}
            
            {/* Add empty cards if last row has only one item (for better layout) */}
            {productPairs.length > 0 && productPairs[productPairs.length - 1].length === 1 && (
              <View style={styles.productRow}>
                <View style={[styles.productCardWrapper, styles.emptyCardWrapper]}>
                  {/* Empty placeholder to maintain layout */}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Pagination */}
          {totalPages > 1 && (
            <View style={styles.paginationContainer}>
              {/* Previous Button */}
              <TouchableOpacity 
                style={[
                  styles.paginationButton, 
                  styles.navButton,
                  currentPage === 1 && styles.paginationButtonDisabled
                ]}
                onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <Text style={[
                  styles.paginationButtonText,
                  currentPage === 1 && styles.paginationButtonTextDisabled
                ]}>‹</Text>
              </TouchableOpacity>

              {/* First page button (show if not in current range) */}
              {pageNumbers[0] > 1 && (
                <>
                  <TouchableOpacity
                    style={[styles.paginationButton, styles.numberButton]}
                    onPress={() => setCurrentPage(1)}
                  >
                    <Text style={styles.paginationButtonText}>1</Text>
                  </TouchableOpacity>
                  {pageNumbers[0] > 2 && (
                    <Text style={styles.ellipsisText}>...</Text>
                  )}
                </>
              )}

              {/* Page Numbers */}
              <View style={styles.pageNumbersContainer}>
                {pageNumbers.map((pageNum) => (
                  <TouchableOpacity
                    key={pageNum}
                    style={[
                      styles.paginationButton,
                      styles.numberButton,
                      currentPage === pageNum && styles.activePageButton
                    ]}
                    onPress={() => setCurrentPage(pageNum)}
                  >
                    <Text style={[
                      styles.paginationButtonText,
                      currentPage === pageNum && styles.activePageText
                    ]}>
                      {pageNum}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Last page button (show if not in current range) */}
              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                  {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                    <Text style={styles.ellipsisText}>...</Text>
                  )}
                  <TouchableOpacity
                    style={[styles.paginationButton, styles.numberButton]}
                    onPress={() => setCurrentPage(totalPages)}
                  >
                    <Text style={styles.paginationButtonText}>{totalPages}</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Next Button */}
              <TouchableOpacity 
                style={[
                  styles.paginationButton, 
                  styles.navButton,
                  currentPage === totalPages && styles.paginationButtonDisabled
                ]}
                onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <Text style={[
                  styles.paginationButtonText,
                  currentPage === totalPages && styles.paginationButtonTextDisabled
                ]}>›</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products available</Text>
        </View>
      )}
    </View>
  )
}

export default JustForYou

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 7,
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 4,
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
  productsContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  productCardWrapper: {
    flex: 1,
    // This ensures both cards in a row have equal width
  },
  singleItemWrapper: {
    // When there's only one item, we need to position it properly
    alignItems: 'flex-start', // Align to the start (left)
    width: '50%', // Take only half the width
  },
  singleItemCard: {
    // Fixed width for single items to match paired items
    width: '100%',
  },
  emptyCardWrapper: {
    // Empty placeholder for layout
    opacity: 0,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    // Ensure all cards have the same height
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    lineHeight: 18,
    height: 36, // Fixed height for 2 lines
  },
  brandText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
  reviews: {
    fontSize: 11,
    color: '#999',
    marginLeft: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  labelChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  labelText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 10,
  },
  paginationButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
    minHeight: 36,
  },
  navButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  numberButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginHorizontal: 2,
  },
  activePageButton: {
    backgroundColor: '#004CFF',
    borderColor: '#004CFF',
  },
  paginationButtonDisabled: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef',
  },
  paginationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  paginationButtonTextDisabled: {
    color: '#ccc',
  },
  activePageText: {
    color: 'white',
  },
  pageNumbersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  ellipsisText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 4,
  },
})