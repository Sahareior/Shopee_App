import { AsyncStorage } from '@react-native-async-storage/async-storage';


   export const getUser = async () => {
      const userData = await AsyncStorage.getItem('authUser')
      const user = userData ? JSON.parse(userData) : null
      
      return user
    }