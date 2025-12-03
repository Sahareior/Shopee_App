import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'

const { width: screenWidth } = Dimensions.get('window')

const CommonScroller = ({ title, data }) => {
    const router = useRouter();

    const renderProductItem = ({ item }) => {
        // Check if item has discount
        const hasDiscount = item.discountPrice && item.price > item.discountPrice;
        const discountPercentage = hasDiscount 
            ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
            : 0;

        // Check labels for badges
        const isNewItem = item.labels?.includes('new_item');
        const isTopProduct = item.labels?.includes('top_product');
        const isFlashDeal = item.labels?.includes('flash_deal');
        const isJustForYou = item.labels?.includes('just_for_you');

        return (
            <TouchableOpacity 
                style={styles.productCard}
                onPress={() => {
                    // Navigate to product detail page
                    router.push(`/product/${item._id}`);
                }}
            >
                <View style={styles.imageContainer}>
                    <Image 
                        source={{ uri: item.images[0] }} 
                        style={styles.productImage}
                        contentFit="cover"
                    />
                    
                    {/* Badges */}
                    <View style={styles.badgesContainer}>
                        {hasDiscount && (
                            <View style={[styles.badge, styles.discountBadge]}>
                                <Text style={styles.badgeText}>{discountPercentage}% OFF</Text>
                            </View>
                        )}
                        {isNewItem && (
                            <View style={[styles.badge, styles.newBadge]}>
                                <Text style={styles.badgeText}>NEW</Text>
                            </View>
                        )}
                        {isFlashDeal && (
                            <View style={[styles.badge, styles.flashBadge]}>
                                <Text style={styles.badgeText}>FLASH</Text>
                            </View>
                        )}
                    </View>
                </View>
                
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                    
                    {/* Brand */}
                    <Text style={styles.brandText} numberOfLines={1}>{item.brand}</Text>
                    
                    {/* Rating */}
                    <View style={styles.ratingContainer}>
                        <Text style={styles.rating}>⭐ {item.rating?.toFixed(1) || '4.0'}</Text>
                        <Text style={styles.reviews}>({item.reviews || 0})</Text>
                    </View>
                    
                    {/* Price */}
                    <View style={styles.priceContainer}>
                        {hasDiscount ? (
                            <>
                                <Text style={styles.currentPrice}>${item.discountPrice.toFixed(2)}</Text>
                                <Text style={styles.originalPrice}>${item.price.toFixed(2)}</Text>
                            </>
                        ) : (
                            <Text style={styles.currentPrice}>${item.price.toFixed(2)}</Text>
                        )}
                    </View>
                    

                </View>
            </TouchableOpacity>
        )
    }

    // Fallback to empty array if data is not provided
    const productData = data || [];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={()=> router.push('/home/Homepage/viewAllComponents/SeeAllProducts')}>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>
            
            {/* Products Scroll */}
            {productData.length > 0 ? (
                <FlatList
                    data={productData}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.flatListContent}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No products available</Text>
                </View>
            )}
        </View>
    )
}

export default CommonScroller

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    seeAllText: {
        fontSize: 14,
        color: '#004CFF',
        fontWeight: '600',
    },
    flatListContent: {
        paddingRight: 16,
        gap: 12,
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
    productCard: {
        width: 160,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 8,
        marginRight: 12,
       
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    productImage: {
        width: '100%',
        height: 140,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
    },
    badgesContainer: {
        position: 'absolute',
        top: 8,
        left: 8,
        flexDirection: 'column',
        gap: 4,
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    discountBadge: {
        backgroundColor: '#FF6B6B',
    },
    newBadge: {
        backgroundColor: '#4CAF50',
    },
    flashBadge: {
        backgroundColor: '#FF9800',
    },
    badgeText: {
        fontSize: 10,
        color: 'white',
        fontWeight: 'bold',
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
})