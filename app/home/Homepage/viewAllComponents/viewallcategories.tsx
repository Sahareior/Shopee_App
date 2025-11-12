import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router';

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
          <TouchableOpacity onPress={()=> router.push('/home/Homepage/viewAllComponents/viewallcategories')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Tab System */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
          contentContainerStyle={styles.tabContentContainer}
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
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Categories Grid */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.categoriesGrid}>
            {currentCategories.map((category) => (
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
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default ViewAllCategories

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
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
  tabContainer: {
    marginBottom: 20,
    maxHeight: 40,
  },
  tabContentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#004CFF',
    borderColor: '#004CFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  categoryCard: {
    width: '48%',
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
})