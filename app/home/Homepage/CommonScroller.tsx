import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'

const { width: screenWidth } = Dimensions.get('window')

const CommonScroller = ({ title }) => {
    const router = useRouter();
    const arrayofProduct = [
        {
            id: 1,
            name: 'Nike Air Max',
            price: '$120',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
            rating: 4.5,
            discount: '20% OFF'
        },
        {
            id: 2,
            name: 'Adidas Ultraboost',
            price: '$180',
            originalPrice: '$200',
            image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
            rating: 4.8,
            isNew: true
        },
        {
            id: 3,
            name: 'Puma RS-X',
            price: '$90',
            image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
            rating: 4.2
        },
        {
            id: 4,
            name: 'New Balance 574',
            price: '$85',
            originalPrice: '$100',
            image: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
            rating: 4.3,
            discount: '15% OFF'
        },
        {
            id: 5,
            name: 'Reebok Classic',
            price: '$75',
            image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
            rating: 4.0,
            isNew: true
        },
        {
            id: 6,
            name: 'Converse Chuck',
            price: '$65',
            image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
            rating: 4.6
        }
    ]

    const renderProductItem = ({ item }) => (
        <TouchableOpacity style={styles.productCard}>
            <View style={styles.imageContainer}>
                <Image 
                    source={item.image} 
                    style={styles.productImage}
                    contentFit="cover"
                />
                {/* Badges */}
                {item.discount && (
                    <View style={[styles.badge, styles.discountBadge]}>
                        <Text style={styles.badgeText}>{item.discount}</Text>
                    </View>
                )}
                {item.isNew && (
                    <View style={[styles.badge, styles.newBadge]}>
                        <Text style={styles.badgeText}>NEW</Text>
                    </View>
                )}
            </View>
            
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                
                {/* <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>⭐ {item.rating}</Text>
                </View> */}
                
                <View style={styles.priceContainer}>
                    <Text style={styles.currentPrice}>{item.price}</Text>
                    {item.originalPrice && (
                        <Text style={styles.originalPrice}>{item.originalPrice}</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={()=> router.push('/home/Homepage/viewAllComponents/SeeAllProducts')}>
                    <Text style={styles.seeAllText}>See as All</Text>
                </TouchableOpacity>
            </View>
            
            {/* Products Scroll */}
            <FlatList
                data={arrayofProduct}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContent}
            />
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
        height: 120,
        borderRadius: 4,
    },
    badge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    discountBadge: {
        backgroundColor: '#FF6B6B',
    },
    newBadge: {
        backgroundColor: '#4CAF50',
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
        marginBottom: 6,
        lineHeight: 18,
    },
    ratingContainer: {
        marginBottom: 8,
    },
    rating: {
        fontSize: 12,
        color: '#666',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
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
    },
})