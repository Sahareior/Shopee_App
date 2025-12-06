import { Image } from 'expo-image';
import { Platform, ScrollView, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../home/Homepage/Header';
import RecentlyViewed from '../home/Homepage/RecentlyViewed';
import Stories from '../home/Homepage/Stories';
import CommonScroller from '../home/Homepage/CommonScroller';
import Categories from '../home/Homepage/Categories';
import FlashSale from '../home/Homepage/Flashsell';
import JustForYou from '../home/Homepage/JustForYou';
import { useGetProductsByTypesQuery } from '../redux/slices/jsonApiSlice';

export default function TabTwoScreen() {
  const { data: newItem, isLoading: isLoadingProducts } = useGetProductsByTypesQuery('new_item')

  const { data: justForYou, isLoading: isLoadingJustForYou } = useGetProductsByTypesQuery('just_for_you')
 
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header />
        <RecentlyViewed />
        <Stories />
        <CommonScroller title={'New Items'} data={newItem} />
        <Categories />
        <FlashSale />
        <JustForYou data={justForYou} />
        {/* Add some bottom padding to ensure all content is scrollable */}
        <ThemedView style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40, // Add padding at the bottom for better scrolling
  },

});