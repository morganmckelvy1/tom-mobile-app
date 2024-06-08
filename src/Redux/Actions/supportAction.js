import axios from 'axios';
import {
  CREATESUPPORTSUCCESS,
} from './types';
import {BASEURL} from '../../Global/common';
import {returnErrors, clearErrors} from './errorAction';

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
      console.log('added support ',supportData.data);
      
    }
  } catch (err) {
    console.log('support update err', err);
  }
};
