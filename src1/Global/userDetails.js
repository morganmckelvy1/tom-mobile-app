import AsyncStorage from '@react-native-async-storage/async-storage';

export const userDetails = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('userData');

    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
    console.log('get user details error', e);
  }
};
