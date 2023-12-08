import axios from 'axios';
import {
  CLEARCREATEAPPOINTMENTSUCCESS,
  CLEARDELETEAPPOINTMENTSUCCESS,
  CLEAREDITAPPOINTMENTSUCCESS,
  CLEARSEARCHCONTACTAPPOINTMENT,
  CREATEAPPOINTMENTSUCCESS,
  DELETEAPPOINTMENTSUCCESS,
  EDITAPPOINTMENTSUCCESS,
  GETAPPOINTMENTSUCCESS,
  SEARCHCONTACTAPPOINTMENTSUCCESS,
} from './types';
import {BASEURL} from '../../Global/common';
import {returnErrors, clearErrors} from './errorAction';

export const getAppointmentList =
  ({token, user_id}) =>
  async dispatch => {
    try {
      const appointmentList = await axios.get(
        BASEURL + '/appoiment/get-appoiment-list',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (appointmentList) {
        dispatch({
          type: GETAPPOINTMENTSUCCESS,
          payload: appointmentList.data.data,
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
            'FETCH_APPOINTMENT',
          ),
        );
      }
    }
  };

export const searchAppointmentcontact =
  ({token, text}) =>
  async dispatch => {
    try {
      const sendData = {
        search: text,
      };
      const searchedContact = await axios.post(
        BASEURL + '/appoiment/search-contact-appoiment',
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (searchedContact) {
        dispatch({
          type: SEARCHCONTACTAPPOINTMENTSUCCESS,
          payload: searchedContact.data.data,
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
            'SEARCHED_ERROR',
          ),
        );
      }
    }
  };

export const clearSearchedAppointment = () => dispatch => {
  dispatch({
    type: CLEARSEARCHCONTACTAPPOINTMENT,
  });
};

export const createAppointment =
  ({token, user_id, sendData}) =>
  async dispatch => {
    try {
      const createAppointment = await axios.post(
        BASEURL + '/appoiment/create-appoiment',
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (createAppointment) {
        dispatch({
          type: CREATEAPPOINTMENTSUCCESS,
          payload: createAppointment.data.message,
        });
        dispatch(clearErrors());
      }
    } catch (err) {
      alert('Please fill all fields');
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
            'CREATE_APPOINTMENT',
          ),
        );
      }
    }
  };

export const clearCreateAppointment = () => dispatch => {
  dispatch({
    type: CLEARCREATEAPPOINTMENTSUCCESS,
  });
};

export const editAppointment =
  ({token, user_id, sendData}) =>
  async dispatch => {
    try {
      const editAppointment = await axios.post(
        BASEURL + '/appoiment/edit-appoiment',
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (editAppointment) {
        dispatch({
          type: EDITAPPOINTMENTSUCCESS,
          payload: editAppointment.data.message,
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
            'EDIT_APPOINTMENT',
          ),
        );
      }
    }
  };

export const cleareditAppointment = () => dispatch => {
  dispatch({
    type: CLEAREDITAPPOINTMENTSUCCESS,
  });
};

export const deleteAppointment =
  ({token, id}) =>
  async dispatch => {
    try {
      const deleteAppointmentData = await axios.post(
        BASEURL + '/appoiment/delete_appointment/' + id,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (deleteAppointmentData) {
        dispatch({
          type: DELETEAPPOINTMENTSUCCESS,
          payload: deleteAppointmentData.data.data,
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
            'DELETE_APPOINTMENT',
          ),
        );
      }
    }
  };

export const clearDeleteAppointment = () => dispatch => {
  dispatch({
    type: CLEARDELETEAPPOINTMENTSUCCESS,
  });
};
