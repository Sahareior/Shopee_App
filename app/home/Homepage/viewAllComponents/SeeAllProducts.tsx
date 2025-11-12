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
  Dimensions
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const SeeAllProducts = () => {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [showFilterDrawer, setShowFilterDrawer] = useState(false)
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  
  // Advanced filter states
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [ratingFilter, setRatingFilter] = useState(0)
  const [availability, setAvailability] = useState('all')
  
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current

  // Demo product data with enhanced properties
  const allProducts = [
    {
      id: 1,
      name: 'Premium Cotton T-Shirt',
      price: 45.99,
      originalPrice: 65.99,
      category: 'Clothing',
      brand: 'FashionCo',
      size: ['S', 'M', 'L', 'XL'],
      color: ['White', 'Black', 'Navy'],
      gender: 'Unisex',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.5,
      reviews: 128,
      isNew: true,
      isTrending: true,
      inStock: true,
      fastDelivery: true
    },
    {
      id: 2,
      name: 'Noise Cancelling Headphones Pro',
      price: 299.99,
      originalPrice: 399.99,
      category: 'Electronics',
      brand: 'AudioTech',
      size: ['One Size'],
      color: ['Black', 'Silver'],
      gender: 'Unisex',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.8,
      reviews: 256,
      isNew: false,
      isTrending: true,
      inStock: true,
      fastDelivery: true
    },
    {
      id: 3,
      name: 'Modern Minimalist Desk Lamp',
      price: 89.99,
      originalPrice: 119.99,
      category: 'Home',
      brand: 'HomeEssentials',
      size: ['One Size'],
      color: ['White', 'Black', 'Walnut'],
      gender: 'Unisex',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.6,
      reviews: 89,
      isNew: true,
      isTrending: false,
      inStock: true,
      fastDelivery: false
    },
    {
      id: 4,
      name: "Men's Performance Running Shoes",
      price: 129.99,
      originalPrice: 159.99,
      category: 'Shoes',
      brand: 'RunPro',
      size: ['8', '9', '10', '11', '12'],
      color: ['Black/Red', 'Blue/White', 'Gray'],
      gender: 'Men',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.7,
      reviews: 342,
      isNew: false,
      isTrending: true,
      inStock: true,
      fastDelivery: true
    },
    {
      id: 5,
      name: 'Smart Watch Series 6 Pro',
      price: 349.99,
      originalPrice: 449.99,
      category: 'Electronics',
      brand: 'TechWear',
      size: ['42mm', '46mm'],
      color: ['Black', 'Silver', 'Gold'],
      gender: 'Unisex',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.9,
      reviews: 512,
      isNew: true,
      isTrending: true,
      inStock: true,
      fastDelivery: true
    },
    {
      id: 6,
      name: "Designer Leather Handbag",
      price: 199.99,
      originalPrice: 299.99,
      category: 'Accessories',
      brand: 'LuxStyle',
      size: ['One Size'],
      color: ['Brown', 'Black', 'Camel'],
      gender: 'Women',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.4,
      reviews: 167,
      isNew: true,
      isTrending: false,
      inStock: true,
      fastDelivery: false
    },
    {
      id: 7,
      name: 'Mechanical Gaming Keyboard RGB',
      price: 149.99,
      originalPrice: 199.99,
      category: 'Electronics',
      brand: 'GameMaster',
      size: ['Full Size', 'Tenkeyless'],
      color: ['Black', 'White'],
      gender: 'Unisex',
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.5,
      reviews: 234,
      isNew: false,
      isTrending: true,
      inStock: false,
      fastDelivery: true
    },
    {
      id: 8,
      name: 'Professional Yoga Mat',
      price: 59.99,
      originalPrice: 79.99,
      category: 'Sports',
      brand: 'FitLife',
      size: ['Standard', 'Long'],
      color: ['Purple', 'Blue', 'Green'],
      gender: 'Unisex',
      image: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.3,
      reviews: 78,
      isNew: true,
      isTrending: false,
      inStock: true,
      fastDelivery: true
    }
  ]

  const categories = ['All', 'Clothing', 'Electronics', 'Home', 'Shoes', 'Accessories', 'Sports']
  const brands = ['FashionCo', 'AudioTech', 'HomeEssentials', 'RunPro', 'TechWear', 'LuxStyle', 'GameMaster', 'FitLife']
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '8', '9', '10', '11', '12', '42mm', '46mm', 'One Size', 'Standard', 'Long', 'Full Size', 'Tenkeyless']
  const colors = ['White', 'Black', 'Navy', 'Silver', 'Brown', 'Camel', 'Purple', 'Blue', 'Green', 'Red', 'Gray', 'Gold']
  
  const sortOptions = [
    { label: 'Popular', value: 'popular', icon: 'flame' },
    { label: 'Newest', value: 'newest', icon: 'time' },
    { label: 'Price: Low to High', value: 'price-low', icon: 'arrow-up' },
    { label: 'Price: High to Low', value: 'price-high', icon: 'arrow-down' },
    { label: 'Rating', value: 'rating', icon: 'star' },
    { label: 'Most Reviewed', value: 'reviews', icon: 'chatbubble' }
  ]

  useEffect(() => {
    filterProducts()
  }, [activeCategory, searchQuery, sortBy, priceRange, selectedBrands, selectedSizes, selectedColors, ratingFilter, availability])

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

  const filterProducts = () => {
    let filtered = [...allProducts]

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(product => product.category === activeCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => selectedBrands.includes(product.brand))
    }

    // Filter by sizes
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => 
        product.size.some(size => selectedSizes.includes(size))
      )
    }

    // Filter by colors
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => 
        product.color.some(color => selectedColors.includes(color))
      )
    }

    // Filter by rating
    if (ratingFilter > 0) {
      filtered = filtered.filter(product => product.rating >= ratingFilter)
    }

    // Filter by availability
    if (availability === 'inStock') {
      filtered = filtered.filter(product => product.inStock)
    } else if (availability === 'fastDelivery') {
      filtered = filtered.filter(product => product.fastDelivery)
    }

    // Sort products
    switch (sortBy) {
      case 'newest':
        filtered = filtered.sort((a, b) => b.id - a.id)
        break
      case 'price-low':
        filtered = filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered = filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered = filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'reviews':
        filtered = filtered.sort((a, b) => b.reviews - a.reviews)
        break
      case 'popular':
      default:
        filtered = filtered.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0) || b.reviews - a.reviews)
        break
    }

    setFilteredProducts(filtered)
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
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.productImageContainer}>
        <Image 
          source={item.image} 
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
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewsText}>({item.reviews})</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>${item.price}</Text>
          {item.originalPrice > item.price && (
            <Text style={styles.originalPrice}>${item.originalPrice}</Text>
          )}
        </View>
        
        {item.originalPrice > item.price && (
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
            {filteredProducts.length} products found
            {getActiveFilterCount() > 0 && ` • ${getActiveFilterCount()} filter(s) active`}
          </Text>
        </View>

        {/* Products Grid */}
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsGrid}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color="#ccc" />
              <Text style={styles.emptyStateTitle}>No products found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your filters or search terms
              </Text>
            </View>
          }
        />

        {/* Filter Drawer */}
        <FilterDrawer />
      </View>
    </SafeAreaView>
  )
}

// ... (Styles remain the same as in the previous response, but enhanced for premium look)
// Note: Due to character limits, I'll include the most important style additions:

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
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
  // Filter Drawer Styles
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
    // flex: 2,
    flexDirection: 'row',
    // padding: 3,
    paddingHorizontal: 18,
    paddingVertical: 12,
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