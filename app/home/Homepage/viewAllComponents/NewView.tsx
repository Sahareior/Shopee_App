import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const NewView = ({ data, sub, head, dataType = 'default' }) => {
    const router = useRouter();
    
    // Transform API data based on dataType
    const transformData = (rawData) => {
        if (!rawData) return [];
        
        // If data is already in the expected format (array of products)
        if (Array.isArray(rawData) && rawData.length > 0) {
            // Check if items already have productId structure
            if (rawData[0].productId || rawData[0].product) {
                return rawData;
            }
        }
        
        // If data has success flag and data array (API response format)
        if (rawData.success && Array.isArray(rawData.data)) {
            switch(dataType) {
                case 'recentView':
                    return rawData.data.map((item) => ({
                        _id: item._id,
                        productId: {
                            _id: item.product?._id || item.productId?._id,
                            name: item.product?.name || 'Product Name',
                            price: item.product?.price || 0,
                            images: item.product?.images || [],
                            rating: item.product?.rating || 4.0,
                            reviews: item.product?.reviews || 0,
                            discountPrice: item.product?.discountPrice
                        }
                    }));
                    
                case 'wishlist':
                    return rawData.data.map((item) => ({
                        _id: item._id,
                        productId: {
                            _id: item.product?._id || item.productId?._id,
                            name: item.product?.name || 'Product Name',
                            price: item.product?.price || 0,
                            originalPrice: item.product?.originalPrice || Math.round((item.product?.price || 0) * 1.2),
                            images: item.product?.images || [],
                            rating: item.product?.rating || 4.5,
                            reviews: item.product?.reviews || Math.floor(Math.random() * 100) + 1,
                            discountPrice: item.product?.discountPrice || item.product?.price,
                            brand: item.product?.brand || 'Brand',
                            inStock: item.product?.inStock !== undefined ? item.product.inStock : true
                        }
                    }));
                    
                default:
                    // Generic transformation for other API responses
                    return rawData.data.map((item) => ({
                        _id: item._id,
                        productId: {
                            _id: item.product?._id || item.productId?._id || item._id,
                            name: item.product?.name || item.name || 'Product Name',
                            price: item.product?.price || item.price || 0,
                            images: item.product?.images || item.images || [],
                            rating: item.product?.rating || item.rating || 4.0,
                            reviews: item.product?.reviews || item.reviews || 0,
                            discountPrice: item.product?.discountPrice || item.discountPrice,
                            brand: item.product?.brand || item.brand || 'Brand'
                        }
                    }));
            }
        }
        
        // If data is already an array but not in API response format
        if (Array.isArray(rawData)) {
            return rawData.map((item) => ({
                _id: item._id || Math.random().toString(),
                productId: {
                    _id: item._id || Math.random().toString(),
                    name: item.name || 'Product Name',
                    price: item.price || 0,
                    images: item.images || [],
                    rating: item.rating || 4.0,
                    reviews: item.reviews || 0,
                    discountPrice: item.discountPrice,
                    brand: item.brand || 'Brand'
                }
            }));
        }
        
        return [];
    };
    
    // Transform the data
    const transformedData = transformData(data);

    
    // If no data, render empty state
    if (!transformedData || transformedData.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.title}>{head}</Text>
                        <Text style={styles.sectionSubtitle}>{sub}</Text>
                    </View>
                    <Text style={styles.noProductsText}>No products available</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.title}>{head}</Text>
                    <Text style={styles.sectionSubtitle}>{sub}</Text>
                </View>
                
                <ScrollView 
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    {transformedData.map((item) => {
                        const product = item.productId;
                        if (!product) return null;

                        const displayPrice = product.discountPrice || product.price;
                        const hasDiscount = product.discountPrice && product.price && product.discountPrice < product.price;

                        return (
                            <TouchableOpacity 
                                key={item._id} 
                                style={styles.productItem}
                                onPress={() => router.push(`/product/${product._id}`)}
                            >
                                <View style={styles.productImageContainer}>
                                    {product.images?.[0] ? (
                                        <Image 
                                            source={{ uri: product.images[0] }} 
                                            style={styles.productImage}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View style={styles.placeholderImage}>
                                            <Ionicons name="image-outline" size={40} color="#ccc" />
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.productName} numberOfLines={2}>
                                    {product.name}
                                </Text>
                                
                                {/* Price Row */}
                                <View style={styles.priceRow}>
                                    <Text style={styles.currentPrice}>
                                        ${displayPrice.toFixed(2)}
                                    </Text>
                                    {hasDiscount && (
                                        <Text style={styles.originalPrice}>
                                            ${product.price.toFixed(2)}
                                        </Text>
                                    )}
                                </View>
                                
                                {/* Rating Row */}
                                <View style={styles.ratingRow}>
                                    <View style={styles.starsContainer}>
                                        {[...Array(5)].map((_, index) => {
                                            const rating = product.rating || 0;
                                            if (index < Math.floor(rating)) {
                                                return <Ionicons key={index} name="star" size={12} color="#FFD700" />;
                                            } else if (index === Math.floor(rating) && rating % 1 >= 0.5) {
                                                return <Ionicons key={index} name="star-half" size={12} color="#FFD700" />;
                                            } else {
                                                return <Ionicons key={index} name="star-outline" size={12} color="#E0E0E0" />;
                                            }
                                        })}
                                    </View>
                                    <Text style={styles.reviewsText}>{product.reviews || 0} reviews</Text>
                                </View>
                                
                                {/* Discount badge for wishlist items */}
                                {dataType === 'wishlist' && hasDiscount && (
                                    <View style={styles.discountBadge}>
                                        <Text style={styles.discountText}>
                                            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        backgroundColor: 'white', 
        paddingHorizontal: 7,
        position: 'relative'
    },
    section: { 
        marginVertical: 30 
    },
    sectionHeader: { 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        marginBottom: 26 
    },
    title: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: '#000' 
    },
    scrollContainer: { 
        paddingRight: 16, 
        gap: 15 
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    productItem: { 
        width: 140, 
        marginRight: 15, 
        alignItems: 'flex-start',
        position: 'relative'
    },
    productImageContainer: { 
        width: 140, 
        height: 140, 
        borderRadius: 12, 
        overflow: 'hidden', 
        marginBottom: 8, 
        backgroundColor: '#f8f9fa', 
        position: 'relative' 
    },
    productImage: { 
        width: '100%', 
        height: '100%' 
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
        lineHeight: 18,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    currentPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    originalPrice: {
        fontSize: 13,
        color: '#C7C7CC',
        textDecorationLine: 'line-through',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    reviewsText: {
        fontSize: 11,
        color: '#8E8E93',
        fontWeight: '500',
    },
    noProductsText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        paddingVertical: 20,
    },
    discountBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#FF3B30',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    discountText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default NewView;