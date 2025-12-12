
import { SafeAreaView } from 'react-native-safe-area-context';

import RecentlyViewed from '../home/Homepage/RecentlyViewed';



import NewsFeed from '../socialmedia/_components/NewsFeed';
import { ScrollView, StyleSheet } from 'react-native';
import Header from '../home/Homepage/Header';
import PostCreationComponent from '../socialmedia/_components/PostCreationComponent';

export default function TabTwoScreen() {

 
  
  return (
    <SafeAreaView style={styles.container}>
    <ScrollView>
        <Header />
      <PostCreationComponent />
      <RecentlyViewed />
      <NewsFeed />
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