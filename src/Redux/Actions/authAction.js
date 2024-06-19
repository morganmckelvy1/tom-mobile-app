import axios from 'axios';
import {Alert, ToastAndroid, Platform, AlertIOS} from 'react-native';
import {
  LOGIN_SUCCESS,
  CLEAR_AUTH,
  FORGOTPASSWORDRESETLINKSUCCESS,
  RESETPASSWORDSUCCESS,
  CLEARRESETLINK,
  CLEARRESETPASSWORDSTATUS,
  CHECKAUTH,
} from './types';
import {BASEURL} from '../../Global/common';
import {returnErrors, clearErrors} from './errorAction';
import {userDetails} from '../../Global/userDetails';

export const checkAuth = () => dispatch => {
  let userSavedData = userDetails();
  userSavedData.then(data => {
    if (data) {
      dispatch({
        type: CHECKAUTH,
        payload: data.token,
      });
    }
  });
};

export const clearAuth = () => dispatch => {
  dispatch({
    type: CLEAR_AUTH,
  });
};
export const LoginApi =
  ({email_phone_txt, password_txt, OS, generatedToken, timeZone}) =>
  async dispatch => {
    try {
      const sendData = {
        email: email_phone_txt,
        password: password_txt,
        device_type: OS,
        device_token: generatedToken,
        time_zone: timeZone,
      };
      const userLogin = await axios.post(BASEURL + '/login', sendData);
      if (userLogin) {
        if (Platform.OS === 'android') {
          ToastAndroid.show("Success", ToastAndroid.SHORT)
        } else {
          Alert.alert("Success");
        }
        dispatch({
          type: LOGIN_SUCCESS,
          payload: userLogin.data.data,
        });
        dispatch(clearErrors());
      }
    } catch (err) {
      console.log(err);
      if (Platform.OS === 'android') {
        ToastAndroid.show(err.response.data.message, ToastAndroid.SHORT)
      } else {
        Alert.alert(err.response.data.message);
      }
      dispatch(
        returnErrors(
          err.response.data,
          err.response.data.message,
          err.response.status,
          'LOGIN_FAIL',
        ),
      );
    }
  };

export const forgotpasswordresetlink =
  ({email_txt}) =>
  async dispatch => {
    try {
      const sendData = {
        email: email_txt,
      };
      const resetLink = await axios.post(
        BASEURL + '/password-reset-link',
        sendData,
      );
      if (resetLink) {
        dispatch({
          type: FORGOTPASSWORDRESETLINKSUCCESS,
          payload: resetLink.data.data,
        });
        dispatch(clearErrors());
      }
    } catch (err) {
      Alert.alert(err.response.data.message)
      dispatch(
        returnErrors(
          err.response.data,
          err.response.data.message,
          err.response.status,
          'LINKSENT_FAIL',
        ),
      );
    }
  };
export const clearcresetLink = () => dispatch => {
  dispatch({
    type: CLEARRESETLINK,
  });
};

export const resetPasswordAction =
  ({password_txt, confirmPassword_txt, emailToken}) =>
  async dispatch => {
    try {
      const sendData = {
        password: password_txt,
        confirm_password: confirmPassword_txt,
        email: emailToken,
      };
      const resePassword = await axios.post(
        // BASEURL + '/create-new-password-reset',
        BASEURL + '/password-reset-link', 
        sendData,
      );
      if (resePassword) {
        dispatch({
          type: RESETPASSWORDSUCCESS,
          payload: resePassword.data.data,
        });
        dispatch(clearErrors());
      }
    } catch (err) {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.data.message,
          err.response.status,
          'RESETPASSWORD_FAIL',
        ),
      );
    }
  };

export const clearResetpasswordstatus = () => dispatch => {
  dispatch({
    type: CLEARRESETPASSWORDSTATUS,
  });
};

export const logoutAction =
  ({user_id}) =>
  async dispatch => {
    console.log(user_id);
    try {
      const sendData = {
        user_id: user_id,
      };
      const logout = await axios.post(BASEURL + '/logout', sendData);
      if (logout) {
        dispatch(clearAuth());
        dispatch(clearErrors());
      }
    } catch (err) {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.data.message,
          err.response.status,
          'LOGOUT_FAIL',
        ),
      );
    }
  };
