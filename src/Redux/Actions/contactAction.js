import axios from 'axios';
import {
  ToastAndroid, Platform, AlertIOS, Alert
} from 'react-native';
import {
  CAMPAIGNDOWNLOADSTATUS,
  CLEARCAMPAIGNDOWNLOADSTATUS,
  CLEARCREATECONTACTSTATUS,
  CLEARCREATEREMINDERSTATUS,
  CLEARDELETECONTACTSTATUS,
  CLEARDOWNLOADCAMPAIGNLIST,
  CLEARFEEDBACKSTATUS,
  CLEARVIEWCONTACT,
  CREATECONTACTSUCCESS,
  CREATEREMINDERSTATUS,
  DELETECONTACTSUCCESS,
  DOWNLOADCAMPAIGNLIST,
  FEEDBACKSTATUS,
  GETCONTACTCAMPAIGNTYPE,
  GETCONTACTLISTSUCCESS,
  VIEWCONTACT,
} from './types';
import {BASEURL} from '../../Global/common';
import {returnErrors, clearErrors} from './errorAction';
import {logoutAction} from './authAction';

export const getContactData =
  ({token, userId}) =>
  async dispatch => {
    try {
      const contactData = await axios.get(
        BASEURL + '/contact/get-contact-list',
        {
          params: {user_id: userId},
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (contactData) {
        dispatch({
          type: GETCONTACTLISTSUCCESS,
          payload: contactData.data.data,
        });
        dispatch(clearErrors());
      }
    } catch (err) {
      if (err.response.status == 401) {
        let user_id = userId;
        dispatch(logoutAction({user_id}));

        dispatch(
          returnErrors(
            err.response.data,
            err.response.data.message,
            err.response.status,
            'AUTH_FAIL',
          ),
        );
      } else {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.data.message,
            err.response.status,
            'FETCH_CONTACT',
          ),
        );
      }
    }
  };
export const viewContact =
  ({token, contactId}) =>
  async dispatch => {
    try {
      const sendData = {
        user_id: contactId,
      };
      const viewcontactData = await axios.post(
        BASEURL + '/contact/view-contact/' + contactId,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (viewcontactData) {
        dispatch({
          type: VIEWCONTACT,
          payload: viewcontactData.data.data,
        });
        dispatch(clearErrors());
      }
    } catch (err) {
      if (err.response.status == 401) {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.data.message,
            err.response.status,
            'AUTH_FAIL',
          ),
        );
      } else {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.data.message,
            err.response.status,
            'VIEW_CONTACT',
          ),
        );
      }
    }
  };
export const clearContactDetails = () => dispatch => {
  dispatch({
    type: CLEARVIEWCONTACT,
  });
};
export const getContactCampaign =
  ({token, userId}) =>
  async dispatch => {
    try {
      const contactCampaignData = await axios.get(
        BASEURL + '/contact/contact-campaign-type',
        {
          params: {user_id: userId},
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (contactCampaignData) {
        dispatch({
          type: GETCONTACTCAMPAIGNTYPE,
          payload: contactCampaignData.data.data,
        });
        dispatch(clearErrors());
      }
    } catch (err) {
      if (err.response.status == 401) {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.data.message,
            err.response.status,
            'AUTH_FAIL',
          ),
        );
      } else {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.data.message,
            err.response.status,
            'FETCH_CAMPAIGN',
          ),
        );
      }
    }
  };

export const createContact =
  ({token, sendData}) =>
  async dispatch => {
    try {
      const createcontactData = await axios.post(
        BASEURL + '/contact/create-update-contact',
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (createcontactData) {
        if (Platform.OS === 'android') {
          ToastAndroid.show("Success", ToastAndroid.SHORT)
        } else {
          Alert.alert("Success");
        }
        dispatch({
          type: CREATECONTACTSUCCESS,
          payload: createcontactData.data.data,
        });
        dispatch(clearErrors());
      }
    } catch (err) {
      if (Platform.OS === 'android') {
        ToastAndroid.show("Failed to add contact. Please try again", ToastAndroid.SHORT)
      } else {
        Alert.alert("Failed to add contact. Please try again");
      }
      if (err.response.status == 401) {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.data.message,
            err.response.status,
            'AUTH_FAIL',
          ),
        );
      } else {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.data.message,
            err.response.status,
            'CREATE_CONTACT',
          ),
        );
      }
    }
  };

export const clearcreatecontactStatus = () => dispatch => {
  dispatch({
    type: CLEARCREATECONTACTSTATUS,
  });
};

export const deleteContact =
  ({token, userId, id}) =>
  async dispatch => {
    try {
      const sendData = {
        user_id: userId,
      };
      const deletecontactData = await axios.post(
        BASEURL + '/contact/contact-delete/' + id,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (deletecontactData) {
        if (Platform.OS === 'android') {
          ToastAndroid.show("Success", ToastAndroid.SHORT)
        } else {
          Alert.alert("Success");
        }
        dispatch({
          type: DELETECONTACTSUCCESS,
          payload: deletecontactData.data.data,
        });
        dispatch(clearErrors());
      }
    } catch (err) {
      if (Platform.OS === 'android') {
        ToastAndroid.show("Failed to delete contact. Please try again", ToastAndroid.SHORT)
      } else {
        Alert.alert("Failed to delete contact. Please try again");
      }
      if (err.response.status == 401) {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.data.message,
            err.response.status,
            'AUTH_FAIL',
          ),
        );
      } else {
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

export const cleardeleteStatus = () => dispatch => {
  dispatch({
    type: CLEARDELETECONTACTSTATUS,
  });
};

export const feedBack =
  ({token, user_id, contactId}) =>
  async dispatch => {
    try {
      const sendData = {
        user_id: user_id,
      };
      const feedBackData = await axios.post(
        BASEURL + '/contact/send-contact-feedback/' + contactId,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (feedBackData) {
        if (Platform.OS === 'android') {
          ToastAndroid.show("Success", ToastAndroid.SHORT)
        } else {
          Alert.alert("Success");
        }
        dispatch({
          type: FEEDBACKSTATUS,
          payload: feedBackData.data.data,
        });
        dispatch(clearErrors());
      }
    } catch (err) {
      if (Platform.OS === 'android') {
        ToastAndroid.show("Failed to save feedback. Please try again", ToastAndroid.SHORT)
      } else {
        Alert.alert("Failed to save feedback. Please try again");
      }
      if (err.response.status == 401) {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.data.message,
            err.response.status,
            'AUTH_FAIL',
          ),
        );
      } else {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.data.message,
            err.response.status,
            'FEEDBACK_ERROR',
          ),
        );
      }
    }
  };

export const clearfeedBack = () => dispatch => {
  dispatch({
    type: CLEARFEEDBACKSTATUS,
  });
};

export const viewcampaignList =
  ({token, contactId}) =>
  async dispatch => {
    try {
      const campaignData = await axios.post(
        BASEURL + '/contact/view-campaign-download-list/' + contactId,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (campaignData) {
        dispatch({
          type: CAMPAIGNDOWNLOADSTATUS,
          payload: campaignData.data.data,
        });
        dispatch(clearErrors());
      }
    } catch (err) {
      if (err.response.status == 401) {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.data.message,
            err.response.status,
            'AUTH_FAIL',
          ),
        );
      } else {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.data.message,
            err.response.status,
            'CAMPAIGN_ERROR',
          ),
        );
      }
    }
  };

export const clearviewcampaignList = () => dispatch => {
  dispatch({
    type: CLEARCAMPAIGNDOWNLOADSTATUS,
  });
};

export const downloadCampaignList =
  ({token, user_id, contactId}) =>
  async dispatch => {
    try {
      const sendData = {
        user_id: user_id,
      };
      const campaignListDownloadData = await axios.post(
        BASEURL + '/contact/view-campaign-list-download/' + contactId,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (campaignListDownloadData) {
        dispatch({
          type: DOWNLOADCAMPAIGNLIST,
          payload: campaignListDownloadData.data.data,
        });
        dispatch(clearErrors());
      }
    } catch (err) {
      if (err.response.status == 401) {
        dispatch(logoutAction({user_id}));
        dispatch(
          returnErrors(
            err.response.data,
            err.response.data.message,
            err.response.status,
            'AUTH_FAIL',
          ),
        );
      } else {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.data.message,
            err.response.status,
            'CAMPAIGN_ERROR',
          ),
        );
      }
    }
  };

export const cleardownloadCampaignList = () => dispatch => {
  dispatch({
    type: CLEARDOWNLOADCAMPAIGNLIST,
  });
};
export const createReminder =
  ({token, contactId, sendData}) =>
  async dispatch => {
    try {
      const createReminderData = await axios.post(
        BASEURL + '/contact/create-reminder/' + contactId,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (createReminderData) {
        dispatch({
          type: CREATEREMINDERSTATUS,
          payload: createReminderData.data.data,
        });
        dispatch(clearErrors());
      }
    } catch (err) {
      if (err.response.status == 401) {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.data.message,
            err.response.status,
            'AUTH_FAIL',
          ),
        );
      } else {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.data.message,
            err.response.status,
            'CREATEREMINDER_ERROR',
          ),
        );
      }
    }
  };

export const clearcreateReminder = () => dispatch => {
  dispatch({
    type: CLEARCREATEREMINDERSTATUS,
  });
};
