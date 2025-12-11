import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const NewView = ({ data }) => {
    const router = useRouter()
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.title}>Recently Viewed</Text>
          <TouchableOpacity>
            
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {data?.map((item) => (
            <TouchableOpacity 
              key={item._id} 
              style={styles.productItem}
              onPress={() => router.push(`/product/${item.productId._id}`)}
            >
              <View style={styles.productImageContainer}>
                <Image 
                  source={{ uri: item.productId.images[0] }} 
                  style={styles.productImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.productName} numberOfLines={2}>
                {item.productId.name}
              </Text>
              
              {/* Price Row */}
              <View style={styles.priceRow}>
                <Text style={styles.currentPrice}>
                  ${item.productId.discountPrice ? item.productId.discountPrice.toFixed(2) : item.productId.price.toFixed(2)}
                </Text>
                {item.productId.discountPrice && (
                  <Text style={styles.originalPrice}>
                    ${item.productId.price.toFixed(2)}
                  </Text>
                )}
              </View>
              
              {/* Rating Row */}
              <View style={styles.ratingRow}>
                <View style={styles.starsContainer}>
                  {[...Array(5)].map((_, index) => {
                    const rating = item.productId.rating || 0;
                    if (index < Math.floor(rating)) {
                      return <Ionicons key={index} name="star" size={12} color="#FFD700" />;
                    } else if (index === Math.floor(rating) && rating % 1 >= 0.5) {
                      return <Ionicons key={index} name="star-half" size={12} color="#FFD700" />;
                    } else {
                      return <Ionicons key={index} name="star-outline" size={12} color="#E0E0E0" />;
                    }
                  })}
                </View>
                <Text style={styles.reviewsText}>{item.productId.reviews || 0} reviews</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    backgroundColor: 'white', 
    paddingHorizontal: 16 
  },
  section: { 
    marginVertical: 30 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 26 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#000' 
  },
  seeAllText: { 
    fontSize: 14, 
    color: '#004CFF', 
    fontWeight: '600' 
  },
  scrollContainer: { 
    paddingRight: 16, 
    gap: 15 
  },
  productItem: { 
    width: 140, 
    marginRight: 15, 
    alignItems: 'flex-start' 
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
});

export default NewView;