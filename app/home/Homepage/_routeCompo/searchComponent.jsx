import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import JustForYou from '../JustForYou'

const { width: screenWidth } = Dimensions.get('window')

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)

  const categories = [
    {
      id: 1,
      name: 'Dresses',
      thumbnail: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      isLive: false
    },
    {
      id: 2,
      name: 'T-Shirts',
      thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      isLive: true
    },
    {
      id: 3,
      name: 'Jeans',
      thumbnail: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      isLive: false
    },
    {
      id: 4,
      name: 'Shoes',
      thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      isLive: true
    },
    {
      id: 5,
      name: 'Accessories',
      thumbnail: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      isLive: false
    },
    {
      id: 6,
      name: 'Bags',
      thumbnail: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      isLive: false
    },
    {
      id: 7,
      name: 'Watches',
      thumbnail: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      isLive: true
    },
    {
      id: 8,
      name: 'Jewelry',
      thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      isLive: false
    },
    {
      id: 9,
      name: 'Sunglasses',
      thumbnail: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      isLive: false
    },
    {
      id: 10,
      name: 'Hats',
      thumbnail: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      isLive: true
    },
    {
      id: 11,
      name: 'Jackets',
      thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      isLive: false
    },
    {
      id: 12,
      name: 'Activewear',
      thumbnail: 'https://images.unsplash.com/photo-1506629905607-e48b0e67d879?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      isLive: true
    },
    {
      id: 13,
      name: 'Swimwear',
      thumbnail: 'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      isLive: false
    },
    {
      id: 14,
      name: 'Lingerie',
      thumbnail: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d77?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      isLive: false
    },
    {
      id: 15,
      name: 'Kids',
      thumbnail: 'https://images.unsplash.com/photo-1503454532315-4de1d5e71761?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      isLive: true
    },
    {
      id: 16,
      name: 'Men',
      thumbnail: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      isLive: false
    },
    {
      id: 17,
      name: 'Women',
      thumbnail: 'https://images.unsplash.com/photo-1485231183945-fffde7cb39ef?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      isLive: true
    },
    {
      id: 18,
      name: 'Beauty',
      thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80',
      isLive: false
    }
  ]

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setSearchQuery(category.name)
  }

  const clearSelection = () => {
    setSelectedCategory(null)
    setSearchQuery('')
  }

  // Calculate item width for 6 items per row with spacing
  const itemWidth = (screenWidth - 40) / 6 // 40 = padding horizontal (20 + 20)

  const renderCategoryRow = (rowCategories, rowIndex) => (
    <View key={rowIndex} style={styles.categoryRow}>
      {rowCategories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryCard,
            { width: itemWidth },
            selectedCategory?.id === category.id && styles.categoryCardSelected
          ]}
          onPress={() => handleCategorySelect(category)}
        >
          <View style={styles.imageContainer}>
            <Image 
              source={category.thumbnail} 
              style={styles.categoryImage}
              contentFit="cover"
            />
            
            {/* Live Badge */}
            {category.isLive && (
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            )}
            
            {/* Selection Indicator */}
            {selectedCategory?.id === category.id && (
              <View style={styles.selectedIndicator}>
                <Ionicons name="checkmark" size={12} color="white" />
              </View>
            )}
          </View>
          
          <Text style={styles.categoryName} numberOfLines={1}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )

  // Split categories into rows of 6
  const categoryRows = []
  for (let i = 0; i < categories.length; i += 6) {
    categoryRows.push(categories.slice(i, i + 6))
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Browse Categories</Text>
        
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search categories..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            editable={false}
          />
          {selectedCategory && (
            <TouchableOpacity onPress={clearSelection} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories in Rows of 6 */}
      <ScrollView 
        style={styles.categoriesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContent}
      >
        {categoryRows.map((rowCategories, index) => 
          renderCategoryRow(rowCategories, index)
        )}

  <JustForYou />

      </ScrollView>


    </SafeAreaView>
  )
}

export default SearchComponent

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  searchContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 45,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    zIndex: 1,
  },
  categoriesContainer: {
    flex: 1,
  },
  categoriesContent: {
    paddingVertical: 15,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  categoryCard: {
    alignItems: 'center',
    padding: 4,
  },
  categoryCardSelected: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#004CFF',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 6,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  categoryName: {
    fontSize: 10,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginTop: 2,
  },
  liveBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4444',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    gap: 1,
  },
  liveDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'white',
  },
  liveText: {
    fontSize: 6,
    color: 'white',
    fontWeight: 'bold',
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#004CFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  selectedInfo: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedInfoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  selectedCategoryText: {
    fontWeight: 'bold',
    color: '#004CFF',
  },
  viewAllButton: {
    backgroundColor: '#004CFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewAllText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
})