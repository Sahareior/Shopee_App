import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router';

const Categories = () => {
  const router = useRouter();
  const categories = [
    {
      id: 1,
      name: 'Clothing',
      images: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
      ]
    },
    {
      id: 2,
      name: 'Electronics',
      images: [
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
      ]
    },
    {
      id: 3,
      name: 'Home & Garden',
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
      ]
    },
    {
      id: 4,
      name: 'Beauty',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1526045478516-99145907023c?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
      ]
    }
  ]

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity onPress={()=> router.push('/home/Homepage/viewAllComponents/viewallcategories')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Categories Grid */}
      <View style={styles.categoriesGrid}>
        {categories.map((category) => (
          <TouchableOpacity key={category.id} style={styles.categoryCard}>
            <View style={styles.imagesGrid}>
              {category.images.map((image, index) => (
                <Image 
                  key={index}
                  source={image} 
                  style={[
                    styles.categoryImage,
                    index === 0 && styles.topLeftImage,
                    index === 1 && styles.topRightImage,
                    index === 2 && styles.bottomLeftImage,
                    index === 3 && styles.bottomRightImage
                  ]}
                  contentFit="cover"
                />
              ))}
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export default Categories

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%', // 2 columns with gap
    alignItems: 'center',
    marginBottom: 20,
  },
  imagesGrid: {
    width: '100%',
    height: 140,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // gap: ,
    gap:3,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  categoryImage: {
    width: '49%',
    height: '49%',
  },
  topLeftImage: {
    borderTopLeftRadius: 12,
  },
  topRightImage: {
    borderTopRightRadius: 12,
  },
  bottomLeftImage: {
    borderBottomLeftRadius: 12,
  },
  bottomRightImage: {
    borderBottomRightRadius: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
})