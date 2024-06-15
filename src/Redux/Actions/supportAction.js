import axios from 'axios';
import {
  ToastAndroid, Platform, AlertIOS
} from 'react-native';
import {BASEURL} from '../../Global/common';

export const supportMessage = (token,topic,message) => async dispatch => {
  try {
    console.log('1');
    const sendData = {
      topic: topic,
      message: message,
    };

    const supportData = await axios.post(
      BASEURL + '/support/create-support',
      sendData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    );
    if (supportData) {
      if (Platform.OS === 'android') {
        ToastAndroid.show("Success", ToastAndroid.SHORT)
      } else {
        AlertIOS.alert("Success");
      }
    }
  } catch (err) {
    console.log('support update err', err);
  }
};
