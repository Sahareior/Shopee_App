import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router';
import { useGetCategoriesQuery } from '@/app/redux/slices/jsonApiSlice';

const Categories = () => {
  const router = useRouter();

  const { data: categories, isLoading, error } = useGetCategoriesQuery();

  // Handle loading and error states
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error loading categories</Text>
      </View>
    );
  }

  // Function to generate multiple images for grid view
  // Since API only provides single image, we'll duplicate it for the grid
  const generateImagesArray = (mainImageUrl) => {
    // Create 4 images (for 2x2 grid) using the main image
    // You could modify this to use different images if available
    return [
      mainImageUrl,
      mainImageUrl,
      mainImageUrl,
      mainImageUrl
    ];
  };

  // Filter to show only top-level categories (where parentCategory is null)
  // Or show all categories based on your needs
  const topLevelCategories = categories?.filter(cat => cat.parentCategory === null) || [];
  
  // If you want to show all categories, just use categories array
  const displayCategories = categories || [];



  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity onPress={() => router.push('/home/Homepage/viewAllComponents/viewallcategories')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Categories Grid */}
      <View style={styles.categoriesGrid}>
        {displayCategories.slice(0,4).map((category) => (
          <TouchableOpacity 
            key={category._id} 
            style={styles.categoryCard}
            onPress={() => {
              // Navigate to category products page
              router.push(`/category/${category.slug}`);
            }}
          >
            <View style={styles.imagesGrid}>
              {generateImagesArray(category.image).map((image, index) => (
                <Image 
                  key={index}
                  source={{ uri: image }} 
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
    gap: 3,
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
});