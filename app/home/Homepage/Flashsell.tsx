import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 30,
    seconds: 0
  })

  const [selectedProducts, setSelectedProducts] = useState([])

  const router = useRouter()

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const { hours, minutes, seconds } = prevTime
        
        if (seconds > 0) {
          return { ...prevTime, seconds: seconds - 1 }
        } else if (minutes > 0) {
          return { ...prevTime, minutes: minutes - 1, seconds: 59 }
        } else if (hours > 0) {
          return { hours: hours - 1, minutes: 59, seconds: 59 }
        } else {
          clearInterval(timer)
          return { hours: 0, minutes: 0, seconds: 0 }
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleProductSelect = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId)
      } else {
        return [...prev, productId]
      }
    })
  }

  const flashSaleProducts = [
    {
      id: 1,
      title: 'Sports Collection',
      products: [
        {
          id: '1-top',
          image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          discount: '40%',
          name: 'Running Shoes'
        },
        {
          id: '1-bottom',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          discount: '35%',
          name: 'Sports T-Shirt'
        }
      ]
    },
    {
      id: 2,
      title: 'Casual Wear',
      products: [
        {
          id: '2-top',
          image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          discount: '50%',
          name: 'Casual Shoes'
        },
        {
          id: '2-bottom',
          image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          discount: '45%',
          name: 'Denim Jacket'
        }
      ]
    },
    {
      id: 3,
      title: 'Running Gear',
      products: [
        {
          id: '3-top',
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          discount: '30%',
          name: 'Pro Running'
        },
        {
          id: '3-bottom',
          image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          discount: '25%',
          name: 'Training Shoes'
        }
      ]
    },
    {
      id: 4,
      title: 'Winter Collection',
      products: [
        {
          id: '4-top',
          image: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          discount: '60%',
          name: 'Winter Boots'
        },
        {
          id: '4-bottom',
          image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          discount: '55%',
          name: 'Wool Sweater'
        }
      ]
    }
  ]

  const renderProductItem = ({ item }) => {
    return (
      <View style={styles.productCard}>
      
        
        {/* Top Product - Selectable separately */}
        <TouchableOpacity 
          style={[
            styles.productContainer,
            selectedProducts.includes(item.products[0].id) && styles.selectedProduct
          ]}
          onPress={() => handleProductSelect(item.products[0].id)}
        >
          <Image 
            source={item.products[0].image}
            style={styles.productImage}
            contentFit="cover"
          />
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.products[0].discount}</Text>
            <Text style={styles.offText}>OFF</Text>
          </View>
          <Text style={styles.productName}>{item.products[0].name}</Text>
          
          {/* Selection Indicator */}
          {selectedProducts.includes(item.products[0].id) && (
            <View style={styles.selectionIndicator}>
              <Text style={styles.selectionText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Bottom Product - Selectable separately */}
        <TouchableOpacity 
          style={[
            styles.productContainer,
            selectedProducts.includes(item.products[1].id) && styles.selectedProduct
          ]}
          onPress={() => handleProductSelect(item.products[1].id)}
        >
          <Image 
            source={item.products[1].image}
            style={styles.productImage}
            contentFit="cover"
          />
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.products[1].discount}</Text>
            <Text style={styles.offText}>OFF</Text>
          </View>
          <Text style={styles.productName}>{item.products[1].name}</Text>
          
          {/* Selection Indicator */}
          {selectedProducts.includes(item.products[1].id) && (
            <View style={styles.selectionIndicator}>
              <Text style={styles.selectionText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header with Timer */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={()=> router.push('/home/Homepage/_routeCompo/flashSellsDetails')}>
            <Text  style={styles.title}>Flash Sale</Text>
          </TouchableOpacity>
          <Text style={styles.subtitle}>Limited time offers</Text>
 
        </View>
        
        {/* Countdown Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.endsIn}>Ends in:</Text>
          <View style={styles.timer}>
            <View style={styles.timeUnit}>
              <Text style={styles.timeNumber}>{timeLeft.hours.toString().padStart(2, '0')}</Text>
              <Text style={styles.timeLabel}>HRS</Text>
            </View>
            <Text style={styles.colon}>:</Text>
            <View style={styles.timeUnit}>
              <Text style={styles.timeNumber}>{timeLeft.minutes.toString().padStart(2, '0')}</Text>
              <Text style={styles.timeLabel}>MIN</Text>
            </View>
            <Text style={styles.colon}>:</Text>
            <View style={styles.timeUnit}>
              <Text style={styles.timeNumber}>{timeLeft.seconds.toString().padStart(2, '0')}</Text>
              <Text style={styles.timeLabel}>SEC</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Products Scroll */}
      <FlatList
        data={flashSaleProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  )
}

export default FlashSale

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 11,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  selectedCount: {
    fontSize: 12,
    color: '#004CFF',
    marginTop: 4,
    fontWeight: '600',
  },
  timerContainer: {
    alignItems: 'flex-end',
  },
  endsIn: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeUnit: {
    alignItems: 'center',
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 40,
  },
  timeNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  timeLabel: {
    fontSize: 8,
    color: 'white',
    fontWeight: '600',
  },
  colon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4444',
    marginHorizontal: 4,
  },
  flatListContent: {
    paddingRight: 1,
    gap: -1,
    // paddingLeft:20
  },
  productCard: {
    width: 180,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginRight: 12,
   
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  productContainer: {
    position: 'relative',
    marginBottom: 19,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedProduct: {
    borderColor: '#004CFF',
    backgroundColor: '#f0f8ff',
  },
  productImage: {
    width: '100%',
    height: 90,
    borderRadius: 6,
  },
  productName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignItems: 'center',
    minWidth: 35,
  },
  discountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  offText: {
    fontSize: 7,
    color: 'white',
    fontWeight: '600',
  },
  selectionIndicator: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#004CFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
})