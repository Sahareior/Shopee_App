import { View, Text } from 'react-native'
import React from 'react'
import RecentlyViewed from '../home/Homepage/RecentlyViewed'
import { useGetStoryQuery } from '../redux/slices/jsonApiSlice';

const SocialPage = () => {
   const { data: feedResponse, isLoading, error } = useGetStoryQuery();
   
  return (
    <View>
      <RecentlyViewed />
      
    </View>
  )
}

export default SocialPage