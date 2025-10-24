import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../home/Homepage/Header'
import RecentlyViewed from '../home/Homepage/RecentlyViewed'
import Stories from '../home/Homepage/Stories'
import CommonScroller from '../home/Homepage/CommonScroller'
import Categories from '../home/Homepage/Categories'
import FlashSale from '../home/Homepage/Flashsell'
import JustForYou from '../home/Homepage/JustForYou'
import ProfileHeader from '../home/ProfilePage/ProfileHeader'


const Home = () => {
  return (
    <SafeAreaView style={{ backgroundColor: '#FFF'}}>
      <ScrollView>
        <ProfileHeader />
        <Categories />
        <RecentlyViewed from='home' />
        {/* <Stories /> */}
        <CommonScroller title={'New Items'} />
        <FlashSale />
        <JustForYou />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home