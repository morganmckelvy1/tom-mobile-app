import axios from 'axios';
import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  CLEARAUTH,
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
    type: CLEARAUTH,
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
        console.log('login true');
        dispatch({
          type: LOGIN_SUCCESS,
          payload: userLogin.data.data,
        });
        dispatch(clearErrors());
      }
    } catch (err) {
      console.log('login err', err.response.data.message);
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
        console.log('login true');
        dispatch({
          type: FORGOTPASSWORDRESETLINKSUCCESS,
          payload: resetLink.data.data,
        });
        dispatch(clearErrors());
      }
    } catch (err) {
      console.log('login err', err.response.data.message);
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
        BASEURL + '/create-new-password-reset',
        sendData,
      );
      if (resePassword) {
        console.log('resePassword true');
        dispatch({
          type: RESETPASSWORDSUCCESS,
          payload: resePassword.data.data,
        });
        dispatch(clearErrors());
      }
    } catch (err) {
      console.log('RESET err', err.response.data.message);
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
    try {
      const sendData = {
        user_id: user_id,
      };
      const logout = await axios.post(BASEURL + '/logout', sendData);
      if (logout) {
        console.log('logout true');
        dispatch(clearAuth());
        dispatch(clearErrors());
      }
    } catch (err) {
      console.log('logout err', err.response.data.message);
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
