import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  TextInput,
  FlatList,
  Modal,
  Animated,
  Dimensions,
  ActivityIndicator
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLazyGetProductsByFilterQuery } from '@/app/redux/slices/jsonApiSlice'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const SeeAllProducts = () => {
  const router = useRouter()
  const [trigger, { data: apiData, isLoading, isFetching, error }] = useLazyGetProductsByFilterQuery()
  
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [showFilterDrawer, setShowFilterDrawer] = useState(false)
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  
  // Advanced filter states
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [ratingFilter, setRatingFilter] = useState(0)
  const [availability, setAvailability] = useState('all')
  
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current

  const categories = ['All', 'Clothing', 'Electronics', 'Home', 'Shoes', 'Accessories', 'Sports']
  const brands = ['FashionCo', 'AudioTech', 'HomeEssentials', 'RunPro', 'TechWear', 'LuxStyle', 'GameMaster', 'FitLife']
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '8', '9', '10', '11', '12', '42mm', '46mm', 'One Size', 'Standard', 'Long', 'Full Size', 'Tenkeyless']
  const colors = ['White', 'Black', 'Navy', 'Silver', 'Brown', 'Camel', 'Purple', 'Blue', 'Green', 'Red', 'Gray', 'Gold']
  
  const sortOptions = [
    { label: 'Popular', value: 'popular', icon: 'flame', apiValue: { sortBy: 'createdAt', sortOrder: 'desc' } },
    { label: 'Newest', value: 'newest', icon: 'time', apiValue: { sortBy: 'createdAt', sortOrder: 'desc' } },
    { label: 'Price: Low to High', value: 'price-low', icon: 'arrow-up', apiValue: { sortBy: 'price', sortOrder: 'asc' } },
    { label: 'Price: High to Low', value: 'price-high', icon: 'arrow-down', apiValue: { sortBy: 'price', sortOrder: 'desc' } },
    { label: 'Rating', value: 'rating', icon: 'star', apiValue: { sortBy: 'rating', sortOrder: 'desc' } },
    { label: 'Most Reviewed', value: 'reviews', icon: 'chatbubble', apiValue: { sortBy: 'reviews', sortOrder: 'desc' } }
  ]

  // Map sortBy state to API parameters
  const getSortParams = () => {
    const option = sortOptions.find(opt => opt.value === sortBy)
    return option ? option.apiValue : { sortBy: 'createdAt', sortOrder: 'desc' }
  }

  // Build API parameters based on current filters
  const buildApiParams = () => {
    const sortParams = getSortParams()
    
    const params = {
      page: currentPage,
      limit: 20,
      sortBy: sortParams.sortBy,
      sortOrder: sortParams.sortOrder,
    }

    // Add filters if they're not default/empty
    if (activeCategory !== 'All') {
      params.category = activeCategory
    }

    if (searchQuery) {
      params.search = searchQuery
    }

    if (priceRange[0] > 0) {
      params.minPrice = priceRange[0]
    }

    if (priceRange[1] < 500) {
      params.maxPrice = priceRange[1]
    }

    if (selectedBrands.length > 0) {
      // Handle multiple brands as array
      selectedBrands.forEach(brand => {
        if (!params.brand) {
          params.brand = brand
        } else if (typeof params.brand === 'string') {
          params.brand = [params.brand, brand]
        } else if (Array.isArray(params.brand)) {
          params.brand.push(brand)
        }
      })
    }

    if (selectedSizes.length > 0) {
      // Handle multiple sizes as array
      selectedSizes.forEach(size => {
        if (!params.size) {
          params.size = size
        } else if (typeof params.size === 'string') {
          params.size = [params.size, size]
        } else if (Array.isArray(params.size)) {
          params.size.push(size)
        }
      })
    }

    if (selectedColors.length > 0) {
      // Handle multiple colors as array
      selectedColors.forEach(color => {
        if (!params.color) {
          params.color = color
        } else if (typeof params.color === 'string') {
          params.color = [params.color, color]
        } else if (Array.isArray(params.color)) {
          params.color.push(color)
        }
      })
    }

    if (ratingFilter > 0) {
      params.rating = ratingFilter
    }

    if (availability === 'inStock') {
      params.inStock = true
    } else if (availability === 'fastDelivery') {
      // Assuming you have a 'fastDelivery' label in your API
      if (!params.labels) {
        params.labels = 'fast_delivery'
      } else if (typeof params.labels === 'string') {
        params.labels = [params.labels, 'fast_delivery']
      } else if (Array.isArray(params.labels)) {
        params.labels.push('fast_delivery')
      }
    }

    return params
  }

  // Fetch products when filters change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = buildApiParams()
      setCurrentPage(1) // Reset to first page when filters change
      trigger(params)
    }, 300) // Debounce search

    return () => clearTimeout(delayDebounceFn)
  }, [
    activeCategory,
    searchQuery,
    sortBy,
    priceRange,
    selectedBrands,
    selectedSizes,
    selectedColors,
    ratingFilter,
    availability
  ])

  // Fetch more products when page changes
  useEffect(() => {
    if (currentPage > 1) {
      const params = buildApiParams()
      trigger(params)
    }
  }, [currentPage])

  // Update products when API data changes
  useEffect(() => {
    if (apiData) {
      let newProducts = []
      let total = 1
      let current = 1
      
      // Handle different API response structures
      if (apiData.data && Array.isArray(apiData.data)) {
        // Structure: { data: [], meta: { totalPages, currentPage, total } }
        newProducts = apiData.data
        if (apiData.meta) {
          total = apiData.meta.totalPages || 1
          current = apiData.meta.currentPage || 1
        }
      } else if (apiData.products && Array.isArray(apiData.products)) {
        // Structure: { products: [], totalPages, currentPage }
        newProducts = apiData.products
        total = apiData.totalPages || 1
        current = apiData.currentPage || 1
      } else if (Array.isArray(apiData)) {
        // Structure: direct array
        newProducts = apiData
      }
      
      // Update pagination state
      setTotalPages(total)
      
      // Update products list
      if (current === 1) {
        setProducts(newProducts)
      } else {
        setProducts(prev => [...prev, ...newProducts])
      }
      
      // Check if there are more pages
      setHasMore(current < total)
    }
  }, [apiData])

  useEffect(() => {
    if (showFilterDrawer) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [showFilterDrawer])

  const handleLoadMore = () => {
    if (hasMore && !isFetching && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  const toggleColor = (color) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    )
  }

  const clearAllFilters = () => {
    setPriceRange([0, 500])
    setSelectedBrands([])
    setSelectedSizes([])
    setSelectedColors([])
    setRatingFilter(0)
    setAvailability('all')
    setCurrentPage(1)
    setShowFilterDrawer(false)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (priceRange[0] > 0 || priceRange[1] < 500) count++
    if (selectedBrands.length > 0) count++
    if (selectedSizes.length > 0) count++
    if (selectedColors.length > 0) count++
    if (ratingFilter > 0) count++
    if (availability !== 'all') count++
    return count
  }

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => router.push(`/product/${item._id || item.id}`)}
    >
      <View style={styles.productImageContainer}>
        <Image 
          source={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'} 
          style={styles.productImage}
          contentFit="cover"
        />
        <View style={styles.badgeContainer}>
          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
          {item.isTrending && (
            <View style={styles.trendingBadge}>
              <Ionicons name="flame" size={12} color="#fff" />
            </View>
          )}
        </View>
        {!item.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productBrand}>{item.brand || 'Unknown Brand'}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.name || 'Unnamed Product'}</Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating || 0}</Text>
          <Text style={styles.reviewsText}>({item.reviews || 0})</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>${item.price || 0}</Text>
          {item.originalPrice && item.originalPrice > item.price && (
            <Text style={styles.originalPrice}>${item.originalPrice}</Text>
          )}
        </View>
        
        {item.originalPrice && item.originalPrice > item.price && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
            </Text>
          </View>
        )}

        <View style={styles.deliveryInfo}>
          {item.fastDelivery ? (
            <View style={styles.deliveryTag}>
              <Ionicons name="flash" size={12} color="#004CFF" />
              <Text style={styles.deliveryText}>Fast Delivery</Text>
            </View>
          ) : (
            <Text style={styles.standardDelivery}>Standard Delivery</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )

  const FilterDrawer = () => (
    <Modal
      visible={showFilterDrawer}
      transparent
      animationType="none"
      onRequestClose={() => setShowFilterDrawer(false)}
    >
      <View style={styles.drawerOverlay}>
        <TouchableOpacity 
          style={styles.drawerBackdrop}
          activeOpacity={1}
          onPress={() => setShowFilterDrawer(false)}
        />
        <Animated.View 
          style={[
            styles.filterDrawer,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Filters</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowFilterDrawer(false)}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              <View style={styles.priceRangeDisplay}>
                <Text style={styles.priceText}>${priceRange[0]} - ${priceRange[1]}</Text>
              </View>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderFill, { width: `${(priceRange[1] / 500) * 100}%` }]} />
                </View>
                <View style={styles.sliderHandles}>
                  <View style={[styles.sliderHandle, { left: `${(priceRange[0] / 500) * 100}%` }]} />
                  <View style={[styles.sliderHandle, { left: `${(priceRange[1] / 500) * 100}%` }]} />
                </View>
              </View>
            </View>

            {/* Brands */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Brands</Text>
              <View style={styles.chipContainer}>
                {brands.map(brand => (
                  <TouchableOpacity
                    key={brand}
                    style={[
                      styles.chip,
                      selectedBrands.includes(brand) && styles.chipSelected
                    ]}
                    onPress={() => toggleBrand(brand)}
                  >
                    <Text style={[
                      styles.chipText,
                      selectedBrands.includes(brand) && styles.chipTextSelected
                    ]}>
                      {brand}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sizes */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Sizes</Text>
              <View style={styles.chipContainer}>
                {sizes.map(size => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.chip,
                      selectedSizes.includes(size) && styles.chipSelected
                    ]}
                    onPress={() => toggleSize(size)}
                  >
                    <Text style={[
                      styles.chipText,
                      selectedSizes.includes(size) && styles.chipTextSelected
                    ]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Colors */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Colors</Text>
              <View style={styles.colorContainer}>
                {colors.map(color => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorChip,
                      selectedColors.includes(color) && styles.colorChipSelected,
                      { backgroundColor: getColorValue(color) }
                    ]}
                    onPress={() => toggleColor(color)}
                  >
                    {selectedColors.includes(color) && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Rating */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Customer Rating</Text>
              <View style={styles.ratingFilterContainer}>
                {[4, 3, 2, 1].map(rating => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingFilter,
                      ratingFilter === rating && styles.ratingFilterSelected
                    ]}
                    onPress={() => setRatingFilter(ratingFilter === rating ? 0 : rating)}
                  >
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Ionicons
                          key={star}
                          name={star <= rating ? "star" : "star-outline"}
                          size={16}
                          color={star <= rating ? "#FFD700" : "#ccc"}
                        />
                      ))}
                    </View>
                    <Text style={styles.ratingFilterText}>& Up</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Availability */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Availability</Text>
              <View style={styles.availabilityContainer}>
                <TouchableOpacity
                  style={[
                    styles.availabilityOption,
                    availability === 'all' && styles.availabilityOptionSelected
                  ]}
                  onPress={() => setAvailability('all')}
                >
                  <Text style={[
                    styles.availabilityText,
                    availability === 'all' && styles.availabilityTextSelected
                  ]}>All Items</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.availabilityOption,
                    availability === 'inStock' && styles.availabilityOptionSelected
                  ]}
                  onPress={() => setAvailability('inStock')}
                >
                  <Text style={[
                    styles.availabilityText,
                    availability === 'inStock' && styles.availabilityTextSelected
                  ]}>In Stock</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.availabilityOption,
                    availability === 'fastDelivery' && styles.availabilityOptionSelected
                  ]}
                  onPress={() => setAvailability('fastDelivery')}
                >
                  <Text style={[
                    styles.availabilityText,
                    availability === 'fastDelivery' && styles.availabilityTextSelected
                  ]}>Fast Delivery</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.drawerFooter}>
            <TouchableOpacity 
              style={styles.clearFiltersButton}
              onPress={clearAllFilters}
            >
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyFiltersButton}
              onPress={() => setShowFilterDrawer(false)}
            >
              <Text style={styles.applyFiltersText}>Apply Filters</Text>
              <Text style={styles.filterCount}>({getActiveFilterCount()})</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )

  const getColorValue = (color) => {
    const colorMap = {
      'White': '#FFFFFF',
      'Black': '#000000',
      'Navy': '#001F3F',
      'Silver': '#C0C0C0',
      'Brown': '#A52A2A',
      'Camel': '#C19A6B',
      'Purple': '#800080',
      'Blue': '#0074D9',
      'Green': '#2ECC40',
      'Red': '#FF4136',
      'Gray': '#AAAAAA',
      'Gold': '#FFD700'
    }
    return colorMap[color] || '#CCCCCC'
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>Failed to load products. Please try again.</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => trigger(buildApiParams())}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  // Loading state
  if (isLoading && currentPage === 1) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#004CFF" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>All Products</Text>
          <TouchableOpacity style={styles.cartButton}>
            <Ionicons name="cart-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, brands, categories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Quick Actions Bar */}
        <View style={styles.actionsBar}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryTab,
                  activeCategory === category && styles.activeCategoryTab
                ]}
                onPress={() => setActiveCategory(category)}
              >
                <Text style={[
                  styles.categoryTabText,
                  activeCategory === category && styles.activeCategoryTabText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterDrawer(true)}
          >
            <Ionicons name="options-outline" size={20} color="#004CFF" />
            {getActiveFilterCount() > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{getActiveFilterCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Sort Options */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.sortContainer}
          contentContainerStyle={styles.sortContent}
        >
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.sortTab,
                sortBy === option.value && styles.activeSortTab
              ]}
              onPress={() => setSortBy(option.value)}
            >
              <Ionicons 
                name={option.icon} 
                size={16} 
                color={sortBy === option.value ? '#fff' : '#666'} 
              />
              <Text style={[
                styles.sortTabText,
                sortBy === option.value && styles.activeSortTabText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {products.length} products found
            {getActiveFilterCount() > 0 && ` • ${getActiveFilterCount()} filter(s) active`}
            {isFetching && currentPage === 1 && ' • Loading...'}
          </Text>
        </View>

        {/* Products Grid */}
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => (item._id || item.id).toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsGrid}
          columnWrapperStyle={styles.columnWrapper}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetching && currentPage > 1 ? (
              <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size="small" color="#004CFF" />
                <Text style={styles.loadingMoreText}>Loading more products...</Text>
              </View>
            ) : hasMore ? (
              <View style={styles.loadMoreHint}>
                <Text style={styles.loadMoreHintText}>Swipe up to load more</Text>
              </View>
            ) : products.length > 0 ? (
              <View style={styles.endOfList}>
                <Text style={styles.endOfListText}>No more products</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            !isLoading && (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={64} color="#ccc" />
                <Text style={styles.emptyStateTitle}>No products found</Text>
                <Text style={styles.emptyStateText}>
                  Try adjusting your filters or search terms
                </Text>
                <TouchableOpacity 
                  style={styles.clearFiltersEmptyButton}
                  onPress={clearAllFilters}
                >
                  <Text style={styles.clearFiltersEmptyButtonText}>Clear All Filters</Text>
                </TouchableOpacity>
              </View>
            )
          }
          refreshControl={
            <ScrollView
              refreshing={isFetching && currentPage === 1}
              onRefresh={() => {
                setCurrentPage(1)
                trigger(buildApiParams())
              }}
            />
          }
        />

        {/* Filter Drawer */}
        <FilterDrawer />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#004CFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  loadMoreHint: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadMoreHintText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  endOfList: {
    paddingVertical: 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 16,
  },
  endOfListText: {
    fontSize: 14,
    color: '#999',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -0.5,
  },
  cartButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoriesContainer: {
    flex: 1,
    maxHeight: 40,
  },
  categoriesContent: {
    paddingHorizontal: 4,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  activeCategoryTab: {
    backgroundColor: '#e831ebff',
    borderColor: '#e831ebff',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeCategoryTabText: {
    color: '#fff',
  },
  filterButton: {
    padding: 12,
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    marginLeft: 12,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  sortContainer: {
    marginBottom: 16,
    height: 50,
    maxHeight: 50,
  },
  sortContent: {
    paddingHorizontal: 4,
  },
  sortTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 6,
  },
  activeSortTab: {
    backgroundColor: '#ec632dff',
    borderColor: '#ec632dff',
  },
  sortTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  activeSortTabText: {
    color: '#fff',
  },
  resultsContainer: {
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  productsGrid: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f8f9fa',
  },
  productImageContainer: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    gap: 4,
  },
  newBadge: {
    backgroundColor: '#e4240fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  trendingBadge: {
    backgroundColor: '#FF6B6B',
    padding: 6,
    borderRadius: 12,
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  productInfo: {
    flex: 1,
  },
  productBrand: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginLeft: 4,
    marginRight: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: '#666',
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
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  deliveryInfo: {
    marginTop: 4,
  },
  deliveryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deliveryText: {
    fontSize: 11,
    color: '#004CFF',
    fontWeight: '500',
  },
  standardDelivery: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  clearFiltersEmptyButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#004CFF',
  },
  clearFiltersEmptyButtonText: {
    color: '#004CFF',
    fontSize: 14,
    fontWeight: '600',
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerBackdrop: {
    flex: 1,
  },
  filterDrawer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.85,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  closeButton: {
    padding: 4,
  },
  filterContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  priceRangeDisplay: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004CFF',
  },
  sliderContainer: {
    height: 30,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    position: 'relative',
  },
  sliderFill: {
    height: 4,
    backgroundColor: '#ff3300ff',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  sliderHandles: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 30,
  },
  sliderHandle: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: '#ff3300ff',
    borderRadius: 12,
    top: -10,
    marginLeft: -12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  chipSelected: {
    backgroundColor: '#ff6f00ff',
    borderColor: '#ff6f00ff',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  chipTextSelected: {
    color: '#fff',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  colorChipSelected: {
    borderColor: '#004CFF',
    shadowColor: '#004CFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  ratingFilterContainer: {
    gap: 8,
  },
  ratingFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  ratingFilterSelected: {
    backgroundColor: '#f0f7ff',
    borderColor: '#004CFF',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingFilterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  availabilityContainer: {
    gap: 8,
  },
  availabilityOption: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  availabilityOptionSelected: {
    backgroundColor: '#f0f7ff',
    borderColor: '#004CFF',
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  availabilityTextSelected: {
    color: '#004CFF',
    fontWeight: '600',
  },
  drawerFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  clearFiltersButton: {
    flex: 1,
    padding: 14,
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  clearFiltersText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  applyFiltersButton: {
    flex: 2,
    flexDirection: 'row',
    padding: 14,
    backgroundColor: '#ed422bff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  applyFiltersText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  filterCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    opacity: 0.8,
  },
})

export default SeeAllProducts