import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const ViewAllCategories = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');

  const categories = {
    All: [
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
      },
      {
        id: 5,
        name: 'Sports',
        images: [
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1536922246289-88c42f957773?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1519861155730-0b9f70fad08b?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
        ]
      },
      {
        id: 6,
        name: 'Books',
        images: [
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
        ]
      }
    ],
    Men: [
      {
        id: 7,
        name: "Men's Fashion",
        images: [
          'https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1520975916090-3105956dac38?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
        ]
      },
      {
        id: 8,
        name: "Men's Shoes",
        images: [
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
        ]
      },
      {
        id: 9,
        name: "Men's Grooming",
        images: [
          'https://images.unsplash.com/photo-1596704014032-82864ec98455?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1503951914875-452c0c6d7cfc?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1594736797933-d0d69e71e638?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1562157873-818bc0726f68?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
        ]
      },
      {
        id: 10,
        name: "Men's Watches",
        images: [
          'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1526045431048-f857369baa09?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
        ]
      },
      {
        id: 11,
        name: "Men's Sports",
        images: [
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1536922246289-88c42f957773?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1519861155730-0b9f70fad08b?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
        ]
      },
      {
        id: 12,
        name: "Men's Accessories",
        images: [
          'https://images.unsplash.com/photo-1590664354891-3790bf5d95e1?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1582142306909-195724d1a37e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
        ]
      }
    ],
    Women: [
      {
        id: 13,
        name: "Women's Fashion",
        images: [
          'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1485231183945-fffde7cb39ef?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
        ]
      },
      {
        id: 14,
        name: "Women's Shoes",
        images: [
          'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1518047601543-79c13ffad7c9?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
        ]
      },
      {
        id: 15,
        name: "Beauty & Cosmetics",
        images: [
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1526045478516-99145907023c?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
        ]
      },
      {
        id: 16,
        name: "Handbags",
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1591561954557-26941169b49e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1583496661160-fb5886a13d77?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
        ]
      },
      {
        id: 17,
        name: "Jewelry",
        images: [
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
        ]
      },
      {
        id: 18,
        name: "Women's Sports",
        images: [
          'https://images.unsplash.com/photo-1519311965067-36d47e693a62?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1519861155730-0b9f70fad08b?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60'
        ]
      }
    ]
  };

  const tabs = ['All', 'Men', 'Women'];

  const currentCategories = categories[activeTab] || [];

  return (
<SafeAreaView style={styles.safeArea}>
  <View style={styles.container}>
    {/* Header */}
    <View style={styles.header}>
      <Text style={styles.title}>Categories</Text>
      <TouchableOpacity 
        style={styles.seeAllButton}
        onPress={() => router.push('/home/Homepage/viewAllComponents/viewallcategories')}
      >
        <Text style={styles.seeAllText}>View All</Text>
      </TouchableOpacity>
    </View>

    {/* Tab System */}
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.tabContainer}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            activeTab === tab && styles.activeTab
          ]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[
            styles.tabText,
            activeTab === tab && styles.activeTabText
          ]}>
            {tab}
          </Text>
          {activeTab === tab && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      ))}
    </ScrollView>

    {/* Categories Grid */}
    <ScrollView 
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.categoriesGrid}>
        {currentCategories.map((category) => (
          <TouchableOpacity 
            key={category.id} 
            style={styles.categoryCard}
            activeOpacity={0.7}
          >
            <View style={styles.imagesContainer}>
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
              <View style={styles.categoryOverlay} />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  </View>
</SafeAreaView>
  )
}

export default ViewAllCategories

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  seeAllText: {
    fontSize: 15,
    color: '#0066ff',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  tabContainer: {
    marginBottom: 24,
    maxHeight: 44,
  },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  activeTab: {
    backgroundColor: '#ffffff',
    borderColor: '#0066ff',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 0.2,
  },
  activeTabText: {
    color: '#0066ff',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -2,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: '#0066ff',
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  imagesContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 12,
  },
  imagesGrid: {
    width: '100%',
    height: 160,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryImage: {
    width: '49%',
    height: '49%',
  },
  topLeftImage: {
    borderTopLeftRadius: 16,
  },
  topRightImage: {
    borderTopRightRadius: 16,
  },
  bottomLeftImage: {
    borderBottomLeftRadius: 16,
  },
  bottomRightImage: {
    borderBottomRightRadius: 16,
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
})