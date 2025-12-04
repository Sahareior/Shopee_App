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
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGetAllProductsQuery, useGetCategoriesQuery, useLazyGetProductsByFilterQuery } from '@/app/redux/slices/jsonApiSlice'
import StickySlide from './StickySlide'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

/* ---------------------------
   Memoized ProductCard
   --------------------------- */
const ProductCard = React.memo(({ item, onPress }) => {
  const imageUrl = item.images && item.images.length > 0 ? item.images[0] : null
  const currentPrice = item.discountPrice || item.price
  const originalPrice = item.discountPrice ? item.price : null
  const discountPercent = originalPrice 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0

  const inStock = item.variations?.some(variation => variation.stock > 0)
  const isNew = item.labels?.includes('new_item')
  const isTrending = item.labels?.includes('top_product') || item.labels?.includes('flash_deal')

  return (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={onPress}
    >
      <View style={styles.productImageContainer}>
        {imageUrl ? (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.productImage}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.productImage, styles.noImage]}>
            <Ionicons name="image-outline" size={40} color="#ccc" />
          </View>
        )}
        <View style={styles.badgeContainer}>
          {isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
          {isTrending && (
            <View style={styles.trendingBadge}>
              <Ionicons name="flame" size={12} color="#fff" />
            </View>
          )}
        </View>
        {!inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productBrand}>{item.brand || 'Unknown Brand'}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{(item.rating || 0).toFixed(1)}</Text>
          <Text style={styles.reviewsText}>({item.reviews || 0})</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>${currentPrice}</Text>
          {originalPrice && originalPrice > currentPrice && (
            <Text style={styles.originalPrice}>${originalPrice}</Text>
          )}
        </View>
        
        {discountPercent > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {discountPercent}% OFF
            </Text>
          </View>
        )}

        <View style={styles.deliveryInfo}>
          <View style={styles.deliveryTag}>
            <Ionicons name="flash" size={12} color="#004CFF" />
            <Text style={styles.deliveryText}>Fast Delivery</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}, (prevProps, nextProps) => {
  // shallow compare id and a few important stable props to avoid unnecessary re-renders
  return prevProps.item._id === nextProps.item._id &&
         prevProps.item.price === nextProps.item.price &&
         prevProps.item.discountPrice === nextProps.item.discountPrice &&
         prevProps.item.rating === nextProps.item.rating &&
         prevProps.onPress === nextProps.onPress
})

/* ---------------------------
   Memoized Filter Drawer Component
   --------------------------- */
const FilterDrawer = React.memo(({
  visible,
  onClose,
  priceRange,
  handleLowPriceChange,
  handleHighPriceChange,
  handlePriceChange,
  selectedBrands,
  toggleBrand,
  brands,
  selectedSizes,
  toggleSize,
  sizes,
  selectedColors,
  toggleColor,
  colors,
  ratingFilter,
  setRatingFilter,
  availability,
  setAvailability,
  clearAllFilters,
  handleApplyFilters,
  getActiveFilterCount,
  getColorValue
}) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start()
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: true
      }).start()
    }
  }, [visible, slideAnim])

  // compute slider lefts as memo to avoid inline re-calcs each render
  const leftPct = `${(priceRange[0] / 2500) * 100}%`
  const rightPct = `${(priceRange[1] / 2500) * 100}%`

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.drawerOverlay}>
        <TouchableOpacity 
          style={styles.drawerBackdrop}
          onPress={onClose}
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
              onPress={onClose}
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
                  <View style={[styles.sliderFill, { 
                    left: leftPct,
                    width: `${((priceRange[1] - priceRange[0]) / 2500) * 100}%`
                  }]} />
                </View>
                
                <View style={styles.sliderHandles}>
                  <View style={[styles.sliderHandle, { 
                    left: leftPct,
                    transform: [{ translateX: -12 }]
                  }]}>
                    <View style={styles.handleDot} />
                  </View>
                  <View style={[styles.sliderHandle, { 
                    left: rightPct,
                    transform: [{ translateX: -12 }]
                  }]}>
                    <View style={styles.handleDot} />
                  </View>
                </View>
              </View>
              
              <View style={styles.priceInputsContainer}>
                <View style={styles.priceInputWrapper}>
                  <Text style={styles.priceInputLabel}>Min:</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={String(priceRange[0])}
                    onChangeText={handleLowPriceChange}
                    keyboardType="numeric"
                  />
                </View>
                <Text style={styles.priceSeparator}>-</Text>
                <View style={styles.priceInputWrapper}>
                  <Text style={styles.priceInputLabel}>Max:</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={String(priceRange[1])}
                    onChangeText={handleHighPriceChange}
                    keyboardType="numeric"
                  />
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
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyFiltersText}>Apply Filters</Text>
              <Text style={styles.filterCount}>({getActiveFilterCount()})</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
})

/* ---------------------------
   Main SeeAllProducts Component
   --------------------------- */
const SeeAllProducts = () => {
  const router = useRouter()
  const {data: allCategories} = useGetCategoriesQuery()
  const {data: allPro} = useGetAllProductsQuery()
  const [trigger, { data: filteredProductsFromApi, isLoading, isFetching }] = useLazyGetProductsByFilterQuery();
  
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [showFilterDrawer, setShowFilterDrawer] = useState(false)
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  
  // Advanced filter states
  const [priceRange, setPriceRange] = useState([0, 2500])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [ratingFilter, setRatingFilter] = useState(0)
  const [availability, setAvailability] = useState('all')
  
  const searchTimeoutRef = useRef(null)

  // Initialize products from API data
  useEffect(() => {
    if (allPro && allPro.length > 0) {
      setProducts(allPro)
      setFilteredProducts(allPro)
    }
  }, [allPro])

  // Extract unique brands, sizes, and colors only when allPro changes
  const { brands, sizes, colors } = useMemo(() => {
    const b = new Set()
    const s = new Set()
    const c = new Set()
    if (Array.isArray(allPro)) {
      allPro.forEach(product => {
        if (product.brand) b.add(product.brand)
        if (product.variations && product.variations.length > 0) {
          product.variations.forEach(variation => {
            if (variation.size) s.add(variation.size)
            if (variation.color) c.add(variation.color)
          })
        }
      })
    }
    return {
      brands: Array.from(b),
      sizes: Array.from(s),
      colors: Array.from(c)
    }
  }, [allPro])

  const sortOptions = [
    { label: 'All', value: 'All', icon: 'flame' },
    { label: 'Newest', value: 'newest', icon: 'time' },
    { label: 'Price: Low to High', value: 'price:asc', icon: 'arrow-up' },
    { label: 'Price: High to Low', value: 'price:desc', icon: 'arrow-down' },
    { label: 'Rating', value: 'rating:desc', icon: 'star' },
    { label: 'Most Reviewed', value: 'reviews', icon: 'chatbubble' }
  ]

  // Build API filters object
  const buildApiFilters = useCallback(() => {
    const filters = {};
    
    // Category filter - we keep activeCategory as the category name for simplicity
    if (activeCategory !== 'All') {
      const selectedCategory = allCategories?.find(cat => cat.name === activeCategory);
      if (selectedCategory) {
        filters.category = selectedCategory._id;
      }
    }
    
    // Search filter
    if (searchQuery.trim()) {
      filters.search = searchQuery.trim();
    }
    
    // Price range filter
    if (priceRange[0] > 0 || priceRange[1] < 2500) {
      filters.minPrice = priceRange[0];
      filters.maxPrice = priceRange[1];
    }
    
    // Brands filter
    if (selectedBrands.length > 0) {
      filters.brand = selectedBrands;
    }
    
    // Sizes filter
    if (selectedSizes.length > 0) {
      filters.size = selectedSizes;
    }
    
    // Colors filter
    if (selectedColors.length > 0) {
      filters.color = selectedColors;
    }
    
    // Rating filter
    if (ratingFilter > 0) {
      filters.rating = ratingFilter;
    }
    
    // Availability filter
    if (availability === 'inStock') {
      filters.inStock = true;
    }
    
    // Sorting - handle popular differently
    if (sortBy === 'newest') {
      filters.sortBy = 'createdAt:desc';
    } else if (sortBy === 'popular') {
      // leave default (backend or local logic can handle)
    } else if (sortBy !== 'popular') {
      filters.sortBy = sortBy;
    }
    
    return filters;
  }, [activeCategory, allCategories, searchQuery, priceRange, selectedBrands, selectedSizes, selectedColors, ratingFilter, availability, sortBy])

  // Apply filters via API
  const applyApiFilters = useCallback(async () => {
    const filters = buildApiFilters();
    
    // If no filters are active, use getAllProducts data
    if (Object.keys(filters).length === 0 && !searchQuery.trim()) {
      if (allPro && allPro.length > 0) {
        setFilteredProducts(allPro);
      }
      return;
    }

    console.log('Applying API filters:', filters);
    
    try {
      const result = await trigger(filters).unwrap();
      if (result) {
        setFilteredProducts(result);
      }
    } catch (error) {
      console.error('Filter error:', error);
      // Fallback to local filtering if API fails
      fallbackLocalFiltering();
    }
  }, [buildApiFilters, trigger, allPro, searchQuery])

  // Fallback to local filtering if API fails
  const fallbackLocalFiltering = useCallback(() => {
    let filtered = [...products];

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(product => 
        product.categoryId?.name === activeCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(query) ||
        product.categoryId?.name?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => {
      const price = product.discountPrice || product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => 
        product.brand && selectedBrands.includes(product.brand)
      );
    }

    // Filter by sizes
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => 
        product.variations?.some(variation => selectedSizes.includes(variation.size))
      );
    }

    // Filter by colors
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => 
        product.variations?.some(variation => selectedColors.includes(variation.color))
      );
    }

    // Filter by rating
    if (ratingFilter > 0) {
      filtered = filtered.filter(product => product.rating >= ratingFilter);
    }

    // Filter by availability
    if (availability === 'inStock') {
      filtered = filtered.filter(product => 
        product.variations?.some(variation => variation.stock > 0)
      );
    }

    // Sort products locally
    switch (sortBy) {
      case 'newest':
        filtered = filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'price:asc':
        filtered = filtered.sort((a, b) => 
          (a.discountPrice || a.price) - (b.discountPrice || b.price)
        );
        break;
      case 'price:desc':
        filtered = filtered.sort((a, b) => 
          (b.discountPrice || b.price) - (a.discountPrice || a.price)
        );
        break;
      case 'rating:desc':
        filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
      default:
        filtered = filtered.sort((a, b) => {
          const aIsTrending = a.labels?.includes('top_product') || a.labels?.includes('flash_deal');
          const bIsTrending = b.labels?.includes('top_product') || b.labels?.includes('flash_deal');
          return (bIsTrending ? 1 : 0) - (aIsTrending ? 1 : 0) || (b.reviews || 0) - (a.reviews || 0);
        });
        break;
    }

    setFilteredProducts(filtered);
  }, [products, activeCategory, searchQuery, priceRange, selectedBrands, selectedSizes, selectedColors, ratingFilter, availability, sortBy])

  // Debounced apply when filters change
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      applyApiFilters();
    }, 500); // 500ms debounce
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [
    activeCategory, 
    searchQuery, 
    sortBy, 
    priceRange, 
    selectedBrands, 
    selectedSizes, 
    selectedColors, 
    ratingFilter, 
    availability,
    applyApiFilters
  ]);

  // handlers memoized so they don't change identity each render
  const handleApplyFilters = useCallback(() => {
    setShowFilterDrawer(false);
    applyApiFilters();
  }, [applyApiFilters]);

  const handlePriceChange = useCallback((values) => {
    setPriceRange(values);
  }, []);

  const handleLowPriceChange = useCallback((value) => {
    const numValue = Math.min(Number(value), priceRange[1] - 1);
    setPriceRange([numValue, priceRange[1]]);
  }, [priceRange]);

  const handleHighPriceChange = useCallback((value) => {
    const numValue = Math.max(Number(value), priceRange[0] + 1);
    setPriceRange([priceRange[0], numValue]);
  }, [priceRange]);

  useEffect(() => {
    // Keep drawer animation in FilterDrawer component rather than here
  }, [showFilterDrawer])

  const toggleBrand = useCallback((brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }, [])

  const toggleSize = useCallback((size) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }, [])

  const toggleColor = useCallback((color) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    )
  }, [])

  const clearAllFilters = useCallback(() => {
    setPriceRange([0, 2500])
    setSelectedBrands([])
    setSelectedSizes([])
    setSelectedColors([])
    setRatingFilter(0)
    setAvailability('all')
    setSearchQuery('')
    setActiveCategory('All')
    setSortBy('popular')
  }, [])

  const getActiveFilterCount = useCallback(() => {
    let count = 0
    if (priceRange[0] > 0 || priceRange[1] < 2500) count++
    if (selectedBrands.length > 0) count++
    if (selectedSizes.length > 0) count++
    if (selectedColors.length > 0) count++
    if (ratingFilter > 0) count++
    if (availability !== 'all') count++
    if (searchQuery.trim()) count++
    if (activeCategory !== 'All') count++
    if (sortBy !== 'popular') count++
    return count
  }, [priceRange, selectedBrands, selectedSizes, selectedColors, ratingFilter, availability, searchQuery, activeCategory, sortBy])

  const getColorValue = useCallback((color) => {
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
      'Gold': '#FFD700',
      'Natural Titanium': '#8A7F8D',
      'Blue Titanium': '#5D8AA8',
      'Black Titanium': '#2C2C2C',
      'Phantom Black': '#1C1C1C',
      'Marble Gray': '#B2B2B2',
      'Space Gray': '#535353',
      'Platinum Silver': '#C0C0C0',
      'Frost White': '#F5F5F5',
      'Dark Blue': '#00008B',
      'Light Blue': '#ADD8E6'
    }
    return colorMap[color] || '#CCCCCC'
  }, [])

  // renderItem memoized and ProductCard is React.memo
  const renderProductItem = useCallback(({ item }) => (
    <ProductCard 
      item={item} 
      onPress={() => router.push(`/product/${item._id}`)} 
    />
  ), [router])

  // Fix category toggling to use category.name consistently
  const onCategoryPress = useCallback((categoryName) => {
    setActiveCategory(categoryName)
  }, [])

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
          {isLoading || isFetching ? (
            <ActivityIndicator size="small" color="#004CFF" style={{ marginLeft: 8 }} />
          ) : searchQuery ? (
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
            <TouchableOpacity
              style={[
                styles.categoryTab,
                activeCategory === 'All' && styles.activeCategoryTab
              ]}
              onPress={() => setActiveCategory('All')}
            >
              <Text style={[
                styles.categoryTabText,
                activeCategory === 'All' && styles.activeCategoryTabText
              ]}>
                All
              </Text>
            </TouchableOpacity>
            {allCategories?.map((category) => (
              <TouchableOpacity
                key={category?._id}
                style={[
                  styles.categoryTab,
                  activeCategory === category.name && styles.activeCategoryTab
                ]}
                onPress={() => onCategoryPress(category.name)}
              >
                <Text style={[
                  styles.categoryTabText,
                  activeCategory === category.name && styles.activeCategoryTabText
                ]}>
                  {category?.name}
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
              disabled={isLoading || isFetching}
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
            {(isLoading || isFetching) ? 'Loading products...' : `${filteredProducts.length} products found`}
            {getActiveFilterCount() > 0 && !isLoading && ` • ${getActiveFilterCount()} filter(s) active`}
          </Text>
        </View>

        {/* Products Grid */}
        {(isLoading || isFetching) && filteredProducts.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#004CFF" />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id.toString()}
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
            // small perf tweak: only update when filteredProducts changes
            extraData={filteredProducts.length}
          />
        )}

        {/* Filter Drawer (memoized component) */}
        <FilterDrawer
          visible={showFilterDrawer}
          onClose={() => setShowFilterDrawer(false)}
          priceRange={priceRange}
          handleLowPriceChange={handleLowPriceChange}
          handleHighPriceChange={handleHighPriceChange}
          handlePriceChange={handlePriceChange}
          selectedBrands={selectedBrands}
          toggleBrand={toggleBrand}
          brands={brands}
          selectedSizes={selectedSizes}
          toggleSize={toggleSize}
          sizes={sizes}
          selectedColors={selectedColors}
          toggleColor={toggleColor}
          colors={colors}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          availability={availability}
          setAvailability={setAvailability}
          clearAllFilters={clearAllFilters}
          handleApplyFilters={handleApplyFilters}
          getActiveFilterCount={getActiveFilterCount}
          getColorValue={getColorValue}
        />
      </View>
    </SafeAreaView>
  )
}

/* your existing styles - unchanged */
const styles = StyleSheet.create({
  // ... (the same styles you had originally)
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
    paddingHorizontal: 4,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
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
  noImage: {
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
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
    height: 40,
    justifyContent: 'center',
    marginBottom: 16,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    position: 'relative',
  },
  sliderFill: {
    height: 4,
    backgroundColor: '#004CFF',
    borderRadius: 2,
    position: 'absolute',
    top: 0,
  },
  sliderHandles: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 40,
  },
  sliderHandle: {
    position: 'absolute',
    width: 24,
    height: 24,
    top: -10,
  },
  handleDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#004CFF',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  priceInputsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  priceInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  priceInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#004CFF',
    textAlign: 'right',
  },
  priceSeparator: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
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
    backgroundColor: '#004CFF',
    borderColor: '#004CFF',
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
    flexDirection: 'row',
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
