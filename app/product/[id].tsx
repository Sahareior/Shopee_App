import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,

  FlatList,
  Alert
} from 'react-native';

import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGetProductByIdQuery, useGetRecentViewedQuery, usePostRecentViewedMutation } from '../redux/slices/jsonApiSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAddToCartTool, useAddToWishlistTool, useUpdateCartTool } from '../tools/useAddToCartTool';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Constants for better maintainability
const COLORS = {
  primary: '#004CFF',
  secondary: '#ed422bff',
  success: '#2ECC40',
  error: '#FF6B6B',
  warning: '#FFD700',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  border: '#E9ECEF',
  textPrimary: '#000000',
  textSecondary: '#666666',
  textDisabled: '#999999',
};

const SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
};

const SPACING = {
  xs: 4,
  sm: 8,
  base: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
};

// Extract components for better organization
const LoadingState = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    <Text style={styles.loadingText}>Loading product details...</Text>
  </View>
);

const ErrorState = ({ onRetry }) => (
  <View style={styles.errorContainer}>
    <Ionicons name="alert-circle" size={64} color={COLORS.error} />
    <Text style={styles.errorTitle}>Product Not Found</Text>
    <Text style={styles.errorText}>
      We couldn't find the product you're looking for.
    </Text>
    <TouchableOpacity 
      style={styles.primaryButton}
      onPress={onRetry}
    >
      <Text style={styles.primaryButtonText}>Go Back</Text>
    </TouchableOpacity>
  </View>
);

const Header = ({ title, onBack, onCart }) => (
  <View style={styles.header}>
    <TouchableOpacity 
      style={styles.iconButton}
      onPress={onBack}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
    </TouchableOpacity>
    <Text style={styles.headerTitle} numberOfLines={1}>
      {title}
    </Text>
    <TouchableOpacity 
      style={styles.iconButton}
      onPress={onCart}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name="cart-outline" size={22} color={COLORS.textPrimary} />
    </TouchableOpacity>
  </View>
);

const ImageGallery = ({ images, selectedIndex, onSelect }) => {
  if (!images?.length) {
    return (
      <View style={[styles.mainImage, styles.noImage]}>
        <Ionicons name="image-outline" size={60} color={COLORS.border} />
      </View>
    );
  }

  return (
    <View style={styles.imageSection}>
      <View style={styles.mainImageContainer}>
        <Image
          source={{ uri: images[selectedIndex] }}
          style={styles.mainImage}
          resizeMode="contain"
        />
      </View>
      {images.length > 1 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailContainer}
          contentContainerStyle={styles.thumbnailContent}
        >
          {images.map((img, index) => (
            <TouchableOpacity
              key={`${img}-${index}`}
              style={[
                styles.thumbnail,
                selectedIndex === index && styles.thumbnailSelected
              ]}
              onPress={() => onSelect(index)}
            >
              <Image
                source={{ uri: img }}
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const PriceDisplay = ({ price, discountPrice }) => {
  const currentPrice = discountPrice || price;
  const originalPrice = discountPrice ? price : null;
  const discountPercent = originalPrice 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return (
    <View style={styles.priceSection}>
      <View style={styles.priceRow}>
        <Text style={styles.currentPrice}>${currentPrice.toFixed(2)}</Text>
        {originalPrice && (
          <>
            <Text style={styles.originalPrice}>${originalPrice.toFixed(2)}</Text>
            {discountPercent > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{discountPercent}%</Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const ColorSelector = ({ colors, selectedColor, onSelect, getColorValue }) => (
  <View style={styles.selectionSection}>
    <Text style={styles.selectionTitle}>Color</Text>
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.colorOptions}
    >
      {colors.map(color => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorOption,
            selectedColor === color && styles.colorOptionSelected
          ]}
          onPress={() => onSelect(color)}
        >
          <View 
            style={[
              styles.colorDot,
              { backgroundColor: getColorValue(color) }
            ]}
          />
          <Text style={styles.colorText}>{color}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const SizeSelector = ({ sizes, selectedSize, onSelect, getSizeStock }) => (
  <View style={styles.selectionSection}>
    <Text style={styles.selectionTitle}>Size</Text>
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.sizeOptions}
    >
      {sizes.map(size => {
        const inStock = getSizeStock(size);
        return (
          <TouchableOpacity
            key={size}
            style={[
              styles.sizeOption,
              selectedSize === size && styles.sizeOptionSelected,
              !inStock && styles.sizeOptionDisabled
            ]}
            onPress={() => inStock && onSelect(size)}
            disabled={!inStock}
          >
            <Text style={[
              styles.sizeText,
              selectedSize === size && styles.sizeTextSelected,
              !inStock && styles.sizeTextDisabled
            ]}>
              {size}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

const QuantitySelector = ({ quantity, maxQuantity, onChange }) => (
  <View style={styles.selectionSection}>
    <Text style={styles.selectionTitle}>Quantity</Text>
    <View style={styles.quantitySelector}>
      <TouchableOpacity
        style={[
          styles.quantityButton,
          quantity <= 1 && styles.quantityButtonDisabled
        ]}
        onPress={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
      >
        <Ionicons 
          name="remove" 
          size={20} 
          color={quantity <= 1 ? COLORS.border : COLORS.textPrimary} 
        />
      </TouchableOpacity>
      <Text style={styles.quantityText}>{quantity}</Text>
      <TouchableOpacity
        style={[
          styles.quantityButton,
          quantity >= maxQuantity && styles.quantityButtonDisabled
        ]}
        onPress={() => onChange(Math.min(maxQuantity, quantity + 1))}
        disabled={quantity >= maxQuantity}
      >
        <Ionicons 
          name="add" 
          size={20} 
          color={quantity >= maxQuantity ? COLORS.border : COLORS.textPrimary} 
        />
      </TouchableOpacity>
    </View>
  </View>
);

const StockBadge = ({ stock }) => {
  if (stock === 0) {
    return (
      <View style={styles.outOfStockBadge}>
        <Text style={styles.outOfStockText}>Out of Stock</Text>
      </View>
    );
  }

  return (
    <View style={styles.inStockBadge}>
      <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
      <Text style={styles.inStockText}>
        {stock <= 10 ? `Only ${stock} left` : 'In Stock'}
      </Text>
    </View>
  );
};

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useAddToCartTool();
  const { addToWishlist } = useAddToWishlistTool();

  
  const { data: product, isLoading, error, refetch } = useGetProductByIdQuery(id);
  const {data:recentView, refetch:recentRefetch} = useGetRecentViewedQuery()
  const [postRecentViewed] = usePostRecentViewedMutation()
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Memoized computations
  const { colors, sizes, inStock } = useMemo(() => ({
    colors: [...new Set(product?.variations?.map(v => v.color) || [])],
    sizes: [...new Set(product?.variations?.map(v => v.size) || [])],
    inStock: product?.variations?.some(v => v.stock > 0) || false,
  }), [product]);

  const selectedColor = selectedVariation?.color;
  const selectedSize = selectedVariation?.size;
  const selectedStock = selectedVariation?.stock || 0;


  useEffect(()=> {
     const start = async () => {
      const res = await postRecentViewed({productId:id})
      recentRefetch()
     }
     start()
  },[id])

  // Set default variation
  React.useEffect(() => {
   
    if (product?.variations?.length) {
      const defaultVariation = product.variations.find(v => v.stock > 0) || product.variations[0];
      setSelectedVariation(defaultVariation);
    }
  }, [product]);

  // Handlers
  const handleColorSelect = useCallback((color) => {
    const variation = product.variations.find(v => 
      v.color === color && (selectedSize ? v.size === selectedSize : true) && v.stock > 0
    ) || product.variations.find(v => v.color === color);
    
    if (variation) {
      setSelectedVariation(variation);
    }
  }, [product, selectedSize]);

  const handleSizeSelect = useCallback((size) => {
    const variation = product.variations.find(v => 
      v.size === size && (selectedColor ? v.color === selectedColor : true) && v.stock > 0
    ) || product.variations.find(v => v.size === size);
    
    if (variation) {
      setSelectedVariation(variation);
    }
  }, [product, selectedColor]);

const handleAddToCart =() =>{
  const data ={
    product: id,
    quantity: quantity, 
    user: '691f393838bceee55ce53ee5'
  }
  addToCart(data);
  console.log(id)
}


  const handleBuyNow = useCallback(() => {
    if (!selectedVariation) {
      Alert.alert('Please Select', 'Choose a color and size first');
      return;
    }
    
    if (selectedStock === 0) {
      Alert.alert('Out of Stock', 'This item is currently unavailable');
      return;
    }

    router.push({
      pathname: '/checkout',
      params: { 
        productId: product._id,
        variationId: selectedVariation._id,
        quantity 
      }
    });
  }, [product, selectedVariation, quantity]);

  const getSizeStock = useCallback((size) => {
    return product?.variations?.some(v => v.size === size && v.stock > 0) || false;
  }, [product]);

  // Helper function for color mapping (moved to component for better organization)
  const getColorValue = (color) => {
    const colorMap = {
      'White': '#FFFFFF', 'Black': '#000000', 'Navy': '#001F3F',
      'Silver': '#C0C0C0', 'Brown': '#A52A2A', 'Camel': '#C19A6B',
      'Purple': '#800080', 'Blue': '#0074D9', 'Green': '#2ECC40',
      'Red': '#FF4136', 'Gray': '#AAAAAA', 'Gold': '#FFD700',
      'Natural Titanium': '#8A7F8D', 'Blue Titanium': '#5D8AA8',
      'Black Titanium': '#2C2C2C', 'Phantom Black': '#1C1C1C',
      'Marble Gray': '#B2B2B2', 'Space Gray': '#535353',
      'Platinum Silver': '#C0C0C0', 'Frost White': '#F5F5F5',
      'Dark Blue': '#00008B', 'Light Blue': '#ADD8E6'
    };
    return colorMap[color] || '#CCCCCC';
  };

  // Render states
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState onRetry={() => router.back()} />;
  if (!product) return null;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
    <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <Header 
            title={product.name}
            onBack={() => router.back()}
            onCart={() => router.push('/cart')}
          />

          <ImageGallery 
            images={product.images}
            selectedIndex={selectedImage}
            onSelect={setSelectedImage}
          />

          <View style={styles.productInfo}>
            <View style={styles.brandCategory}>
              <Text style={styles.brand}>{product.brand || 'Brand'}</Text>
              <View style={styles.categoryTag}>
                <Text style={styles.category}>{product.categoryId?.name || 'General'}</Text>
              </View>
            </View>

            <Text style={styles.productTitle}>{product.name}</Text>

            <View style={styles.ratingRow}>
              <View style={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons 
                    key={i}
                    name={i < Math.floor(product.rating || 0) ? "star" : "star-outline"}
                    size={16}
                    color={COLORS.warning}
                  />
                ))}
                <Text style={styles.ratingValue}>{(product.rating || 0).toFixed(1)}</Text>
              </View>
              <Text style={styles.reviews}>({product.reviews || 0} reviews)</Text>
              <StockBadge stock={selectedStock} />
            </View>

            <PriceDisplay 
              price={product.price}
              discountPrice={product.discountPrice}
            />

            {colors.length > 0 && (
              <ColorSelector 
                colors={colors}
                selectedColor={selectedColor}
                onSelect={handleColorSelect}
                getColorValue={getColorValue}
              />
            )}

            {sizes.length > 0 && (
              <SizeSelector 
                sizes={sizes}
                selectedSize={selectedSize}
                onSelect={handleSizeSelect}
                getSizeStock={getSizeStock}
              />
            )}

            <QuantitySelector 
              quantity={quantity}
              maxQuantity={selectedStock}
              onChange={setQuantity}
            />

            {product.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{product.description}</Text>
              </View>
            )}

            {product.labels?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Features</Text>
                <View style={styles.tags}>
                  {product.labels.map(label => (
                    <View key={label} style={styles.tag}>
                      <Text style={styles.tagText}>
                        {label.replace(/_/g, ' ')}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.actionBar}>
          <TouchableOpacity onPress={() => addToWishlist({ user: '691f393838bceee55ce53ee5', product: id })} style={styles.wishlistButton}>
            <Ionicons name="heart-outline" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[
                styles.addToCartButton,
                (!inStock || !selectedVariation) && styles.buttonDisabled
              ]}
              onPress={() => handleAddToCart()}
              disabled={!inStock || !selectedVariation}
            >
              <Ionicons name="cart" size={24} color={COLORS.background} />
             
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.buyNowButton,
                (!inStock || !selectedVariation) && styles.buttonDisabled
              ]}
              onPress={handleBuyNow}
              disabled={!inStock || !selectedVariation}
            >
              <Text style={styles.buttonText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  // Base Layout
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 1,
    paddingVertical: SPACING.base,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginHorizontal: SPACING.sm,
  },
  
  // Image Gallery
  imageSection: {
    marginBottom: SPACING.xl,
  },
  mainImageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: COLORS.surface,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailContainer: {
    marginTop: SPACING.base,
  },
  thumbnailContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbnailSelected: {
    borderColor: COLORS.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  
  // Product Info
  productInfo: {
    paddingHorizontal: SPACING.md,
  },
  brandCategory: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  brand: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  categoryTag: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
  },
  category: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  productTitle: {
    fontSize: SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.base,
    lineHeight: 32,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingValue: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  reviews: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  
  // Price
  priceSection: {
    marginBottom: SPACING.lg,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.base,
  },
  currentPrice: {
    fontSize: SIZES['3xl'],
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  originalPrice: {
    fontSize: SIZES.xl,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
  },
  discountText: {
    color: COLORS.background,
    fontSize: SIZES.sm,
    fontWeight: '700',
  },
  
  // Selection Sections
  selectionSection: {
    marginBottom: SPACING.lg,
  },
  selectionTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingVertical: 2,
  },
  colorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  colorOptionSelected: {
    backgroundColor: '#f0f7ff',
    borderColor: COLORS.primary,
  },
  colorDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  colorText: {
    fontSize: SIZES.sm,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  sizeOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingVertical: 2,
  },
  sizeOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sizeOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sizeOptionDisabled: {
    opacity: 0.5,
  },
  sizeText: {
    fontSize: SIZES.sm,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  sizeTextSelected: {
    color: COLORS.background,
  },
  sizeTextDisabled: {
    color: COLORS.textDisabled,
  },
  
  // Quantity Selector
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    width: 140,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    minWidth: 40,
    textAlign: 'center',
  },
  
  // Sections
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  tag: {
    backgroundColor: '#f0f7ff',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d0e7ff',
  },
  tagText: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  
  // Stock Badges
  inStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
    gap: 4,
  },
  inStockText: {
    fontSize: SIZES.sm,
    color: COLORS.success,
    fontWeight: '600',
  },
  outOfStockBadge: {
    backgroundColor: '#ffebee',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
  },
  outOfStockText: {
    fontSize: SIZES.sm,
    color: COLORS.error,
    fontWeight: '600',
  },
  
  // Action Bar
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.base,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  wishlistButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionButtons: {
    flex: 1,
    flexDirection: 'row',
    gap: SPACING.base,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#cf44acff',
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: SIZES.base,
    fontWeight: '600',
  },
  
  // Loading & Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.base,
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  errorTitle: {
    fontSize: SIZES.xl,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  errorText: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.base,
    borderRadius: 8,
    minWidth: 120,
  },
  primaryButtonText: {
    color: COLORS.background,
    fontSize: SIZES.base,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ProductDetailScreen;