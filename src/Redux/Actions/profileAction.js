import axios from 'axios';
import {
  CHANGEPASSWORDSUCCESS,
  CLEARPROFILEUPDATESTATUS,
  GETPROFILEDATA,
  UPDATEPROFILEDATA,CLEARCHANGEPASSWORDSTATUS
} from './types';
import {BASEURL} from '../../Global/common';
import {returnErrors,clearErrors} from './errorAction';
import {logoutAction} from '../Actions/authAction';

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
        console.log('fetched profile data');
        dispatch({
          type: GETPROFILEDATA,
          payload: profileData.data.data,
        });
      }
    } catch (err) {
      console.log('profile err', err?.response?.status);
      if (err.response.status == 401) {
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
        console.log('updateProfileField data', updateprofileData.status);

        if (singleFile) {
          dispatch(updateProfilePic(token, singleFile));
        } else {
          dispatch({
            type: UPDATEPROFILEDATA,
          });
        }
      }
    } catch (err) {
      console.log('profile update err', err);
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
      console.log('update profile picture');
      dispatch({
        type: UPDATEPROFILEDATA,
      });
    }
  } catch (err) {
    console.log('profile update err', err);
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
        console.log('changedPassword data', changedPassword.status);
        dispatch({
          type: CHANGEPASSWORDSUCCESS,
        });
        dispatch(clearErrors());
      }
    } catch (err) {
      console.log('change password err', err);
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
