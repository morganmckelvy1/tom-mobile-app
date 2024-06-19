import axios from 'axios';
import {
  CHANGEPASSWORDSUCCESS,
  CLEARPROFILEUPDATESTATUS,
  GETPROFILEDATA,
  UPDATEPROFILEDATA,CLEARCHANGEPASSWORDSTATUS,
  PROFILE_UPDATE_FAILED
} from './types';
import {BASEURL} from '../../Global/common';
import {returnErrors,clearErrors} from './errorAction';
import {logoutAction} from '../Actions/authAction';
import { ToastAndroid, Platform, AlertIOS, Alert} from 'react-native';

export const getProfileData =
  ({token,user_id}) =>
  async dispatch => {
    try {
      const profileData = await axios.get(BASEURL + '/get-user-profile', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (profileData) {
        dispatch({
          type: GETPROFILEDATA,
          payload: profileData.data.data,
        });
      }
    } catch (err) {
      dispatch(logoutAction({user_id}))
      if (Platform.OS === 'android') {
        ToastAndroid.show("Failed to load profile information. Please try again", ToastAndroid.SHORT)
      } else {
        Alert.alert("Failed to load profile information. Please try again");
      }
      if (err?.response?.status == 401) {
        dispatch(logoutAction({user_id}))
        dispatch(
          returnErrors(
            err.response.data,
            err.response.data.message,
            err.response.status,
            'AUTH_FAIL',
          ),
        );
      }
      
    }
  };

export const updateProfileField =
  ({token, sendData, singleFile}) =>
  async dispatch => {
    try {
      const updateprofileData = await axios.post(
        BASEURL + '/update-profile',
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );
      if (updateprofileData) {
        if (Platform.OS === 'android') {
          ToastAndroid.show("Success", ToastAndroid.SHORT)
        } else {
          Alert.alert("Success");
        }
        if (singleFile) {
          dispatch(updateProfilePic(token, singleFile));
        } else {
          dispatch({
            type: UPDATEPROFILEDATA,
          });
        }
      }
    } catch (err) {
      if (Platform.OS === 'android') {
        ToastAndroid.show("Failed to update profile. Please try again", ToastAndroid.SHORT)
      } else {
        Alert.alert("Failed to update profile. Please try again");
      }
      dispatch({
        type: PROFILE_UPDATE_FAILED,
      });
    }
  };

export const updateProfilePic = (token, file) => async dispatch => {
  try {
    const sendPicture = {
      picture: file.assets[0].base64,
    };
    const updateprofilepictureData = await axios.post(
      BASEURL + '/update-user-profile',
      sendPicture,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    );
    if (updateprofilepictureData) {
      if (Platform.OS === 'android') {
        ToastAndroid.show("Success", ToastAndroid.SHORT)
      } else {
        Alert.alert("Success");
      }
      dispatch({
        type: UPDATEPROFILEDATA,
      });
    }
  } catch (err) {
    if (Platform.OS === 'android') {
      ToastAndroid.show("Failed to update profile picture. Please try again", ToastAndroid.SHORT)
    } else {
      Alert.alert("Failed to update profile picture. Please try again");
    }
  }
};

export const clearUpdateProfileStatus = () => dispatch => {
  dispatch({
    type: CLEARPROFILEUPDATESTATUS,
  });
};

export const changePasswordAction =
  ({token, userId, currentPassword, newPassword}) =>
  async dispatch => {
    try {
      const sendData = {
        user_id: userId,
        current_password: currentPassword,
        password: newPassword,
      };
      const changedPassword = await axios.post(
        BASEURL + '/change-password',
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );
      if (changedPassword) {
        if (Platform.OS === 'android') {
          ToastAndroid.show("Success", ToastAndroid.SHORT)
        } else {
          Alert.alert("Success");
        }
        dispatch({
          type: CHANGEPASSWORDSUCCESS,
        });
        dispatch(clearErrors());
      }
    } catch (err) {
      if (Platform.OS === 'android') {
        ToastAndroid.show("Failed to update password. Please try again", ToastAndroid.SHORT)
      } else {
        Alert.alert("Failed to update password. Please try again");
      }
      dispatch(
        returnErrors(
          err.response.data,
          err.response.data.message,
          err.response.status,
          'CHANGE_PASSWORD',
        ),
      );
    }
  };

  export const clearchangePasswordStatus = () => dispatch => {
    dispatch({
      type: CLEARCHANGEPASSWORDSTATUS,
    });
  };
