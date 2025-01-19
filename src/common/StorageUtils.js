// StorageUtils.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const StorageUtils = {
  // Store user info
  storeUserInfo: async (userInfo) => {
    try {
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
      console.error('Error storing user info:', error);
    }
  },

  // Get user info
  getUserInfo: async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Error retrieving user info:', error);
      return null;
    }
  },

  // Store token
  storeToken: async (token) => {
    try {
      await AsyncStorage.setItem('userToken', token);
    } catch (error) {
      console.error('Error storing token:', error);
    }
  },

  // Get token
  getToken: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  },
  removeToken:async () => {
    try {
      await AsyncStorage.removeItem('userToken'); // Replace 'userToken' with the key you used for storing the token
      console.log('Token removed successfully');
    } catch (error) {
      console.error('Error removing token', error);
    }
  }
};

export default StorageUtils;
