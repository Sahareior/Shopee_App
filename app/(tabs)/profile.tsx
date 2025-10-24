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

export default function TabTwoScreen() {
  return (
 <SafeAreaView style={{ backgroundColor: '#FFF'}}>
    <ScrollView>
        <Header />
        <RecentlyViewed />
        <Stories />
        <CommonScroller title={'New Items'} />
        <Categories />
        <FlashSale />
        <JustForYou />
      </ScrollView>
</SafeAreaView>
  );
}


