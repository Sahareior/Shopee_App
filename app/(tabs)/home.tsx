import { View, Text, ScrollView, StatusBar } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../home/Homepage/Header';
import RecentlyViewed from '../home/Homepage/RecentlyViewed';
import Stories from '../home/Homepage/Stories';
import CommonScroller from '../home/Homepage/CommonScroller';
import Categories from '../home/Homepage/Categories';
import FlashSale from '../home/Homepage/Flashsell';
import JustForYou from '../home/Homepage/JustForYou';
import ProfileHeader from '../home/ProfilePage/ProfileHeader';
import {  useGetProductsByTypesQuery } from '../redux/slices/jsonApiSlice';

const Home = () => {
  
const {data:productByType} = useGetProductsByTypesQuery('top_product')
const {data:newItems} = useGetProductsByTypesQuery('new_item')
const {data:forYou} = useGetProductsByTypesQuery('just_for_you')



  return (
    <>

     

      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
        <ScrollView>
          <ProfileHeader />
          <Categories />
          <RecentlyViewed data={productByType} from="home" />
   
          <CommonScroller data={newItems} title={'New Items'} />
          <FlashSale />
          <JustForYou data={forYou} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Home;
