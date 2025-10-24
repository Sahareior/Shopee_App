import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'

const JustForYou = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  // Sample products data
  const allProducts = [
    {
      id: 1,
      name: 'Wireless Earbuds Pro',
      price: '$79.99',
      originalPrice: '$99.99',
      image: 'https://images.unsplash.com/photo-1590658165737-15a047b8b5e0?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.5,
      discount: '20% OFF'
    },
    {
      id: 2,
      name: 'Smart Watch Series 5',
      price: '$199.99',
      originalPrice: '$249.99',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.8,
      discount: '20% OFF'
    },
    {
      id: 3,
      name: 'Bluetooth Speaker',
      price: '$49.99',
      originalPrice: '$69.99',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.3,
      discount: '29% OFF'
    },
    {
      id: 4,
      name: 'Gaming Mouse RGB',
      price: '$39.99',
      originalPrice: '$59.99',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.6,
      discount: '33% OFF'
    },
    {
      id: 5,
      name: 'Mechanical Keyboard',
      price: '$89.99',
      originalPrice: '$119.99',
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.7,
      discount: '25% OFF'
    },
    {
      id: 6,
      name: 'Laptop Stand Aluminum',
      price: '$29.99',
      originalPrice: '$39.99',
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.2,
      discount: '25% OFF'
    },
    {
      id: 7,
      name: 'USB-C Hub 7-in-1',
      price: '$34.99',
      originalPrice: '$49.99',
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.4,
      discount: '30% OFF'
    },
    {
      id: 8,
      name: 'Wireless Charger Fast',
      price: '$24.99',
      originalPrice: '$34.99',
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.1,
      discount: '29% OFF'
    },
    {
      id: 9,
      name: 'Noise Cancelling Headphones',
      price: '$149.99',
      originalPrice: '$199.99',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.9,
      discount: '25% OFF'
    },
    {
      id: 10,
      name: 'Tablet Stand Adjustable',
      price: '$19.99',
      originalPrice: '$29.99',
      image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.0,
      discount: '33% OFF'
    },
    {
      id: 11,
      name: 'Phone Case Premium',
      price: '$14.99',
      originalPrice: '$24.99',
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.3,
      discount: '40% OFF'
    },
    {
      id: 12,
      name: 'Power Bank 20000mAh',
      price: '$39.99',
      originalPrice: '$59.99',
      image: 'https://images.unsplash.com/photo-1597766589842-320e6b3d2c80?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.5,
      discount: '33% OFF'
    },
    {
      id: 13,
      name: 'Webcam 4K HD',
      price: '$59.99',
      originalPrice: '$79.99',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.6,
      discount: '25% OFF'
    },
    {
      id: 14,
      name: 'Desk Lamp LED',
      price: '$34.99',
      originalPrice: '$49.99',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.2,
      discount: '30% OFF'
    },
    {
      id: 15,
      name: 'Monitor Arm Stand',
      price: '$79.99',
      originalPrice: '$99.99',
      image: 'https://images.unsplash.com/photo-1586953983827-b6622f2ad0ab?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.7,
      discount: '20% OFF'
    },
    {
      id: 16,
      name: 'Cable Organizer Kit',
      price: '$12.99',
      originalPrice: '$19.99',
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
      rating: 4.1,
      discount: '35% OFF'
    }
  ]

  const productsPerPage = 8
  const totalPages = Math.ceil(allProducts.length / productsPerPage)

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
      pairs.push(products.slice(i, i + 2))
    }
    return pairs
  }

  const currentProducts = getCurrentPageProducts()
  const productPairs = groupProductsIntoPairs(currentProducts)

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  const renderProductRow = (pair, index) => (
    <View key={`row-${index}`} style={styles.productRow}>
      {pair.map((product) => (
        <TouchableOpacity onPress={()=> router.push('/home/Homepage/_routeCompo/details')} key={product.id} style={styles.productCard}>
          <View style={styles.imageContainer}>
            <Image 
              source={product.image} 
              style={styles.productImage}
              contentFit="cover"
            />
            {product.discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{product.discount}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
            
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {product.rating}</Text>
            </View>
            
            <View style={styles.priceContainer}>
              <Text style={styles.currentPrice}>{product.price}</Text>
              {product.originalPrice && (
                <Text style={styles.originalPrice}>{product.originalPrice}</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Just For You</Text>
        <Text style={styles.subtitle}>Personalized recommendations</Text>
      </View>

      {/* Products Grid using ScrollView instead of FlatList */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}
      >
        {productPairs.map((pair, index) => renderProductRow(pair, index))}
      </ScrollView>


    </View>
  )
}

export default JustForYou

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 11,
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
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
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  productCard: {
    flex: 1,
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
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
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
    marginHorizontal: 4,
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
})