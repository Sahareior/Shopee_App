import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router';
import { useGetCategoriesQuery } from '@/app/redux/slices/jsonApiSlice';

const Categories = () => {
  const router = useRouter();

  const { data: categoriesData, isLoading, error } = useGetCategoriesQuery();

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

  // Extract the actual categories array from the response
  const categories = categoriesData?.data || [];
  
  // Filter to show only top-level categories (where parentCategory is null)
  const topLevelCategories = categories.filter(cat => cat.parentCategory === null);
  
  // Sort categories by order field
  const sortedCategories = [...topLevelCategories].sort((a, b) => a.order - b.order);
  
  // Take first 4 categories to display
  const displayCategories = sortedCategories.slice(0, 4);

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
        {displayCategories.map((category) => (
          <TouchableOpacity 
            key={category._id} 
            style={styles.categoryCard}
            onPress={() => {
              // Navigate to category products page
              router.push(`/category/${category.slug}`);
            }}
          >
            <View style={styles.imagesGrid}>
              {/* Use the actual images array from API */}
              {category.images && category.images.length > 0 ? (
                category.images.slice(0, 4).map((image, index) => (
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
                    transition={300}
                    placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                  />
                ))
              ) : (
                // Fallback if no images
                Array.from({ length: 4 }).map((_, index) => (
                  <View 
                    key={index}
                    style={[
                      styles.categoryImage,
                      index === 0 && styles.topLeftImage,
                      index === 1 && styles.topRightImage,
                      index === 2 && styles.bottomLeftImage,
                      index === 3 && styles.bottomRightImage,
                      styles.placeholderImage
                    ]}
                  />
                ))
              )}
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Show message if no categories */}
      {displayCategories.length === 0 && !isLoading && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No categories available</Text>
        </View>
      )}
    </View>
  )
}

export default Categories

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 0,
    marginTop: 0,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  imagesGrid: {
    width: '100%',
    height: 140,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  categoryImage: {
    width: '49%',
    height: '49%',
    backgroundColor: '#f5f5f5',
  },
  placeholderImage: {
    backgroundColor: '#e0e0e0',
  },
  topLeftImage: {
    borderTopLeftRadius: 10,
  },
  topRightImage: {
    borderTopRightRadius: 10,
  },
  bottomLeftImage: {
    borderBottomLeftRadius: 10,
  },
  bottomRightImage: {
    borderBottomRightRadius: 10,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});