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
} from '../Actions/types';

const initialState = {
  appointmentList: null,
  searchedContacts: null,
  createappointSuccess: null,
  editappointSuccess: null,
  deleteAppointment:null
};

const appointmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case GETAPPOINTMENTSUCCESS:
      return {
        ...state,
        appointmentList: action.payload,
      };
    case SEARCHCONTACTAPPOINTMENTSUCCESS:
      return {
        ...state,
        searchedContacts: action.payload,
      };
    case CLEARSEARCHCONTACTAPPOINTMENT:
      return {
        ...state,
        searchedContacts: '',
      };
    case CREATEAPPOINTMENTSUCCESS:
      return {
        ...state,
        createappointSuccess: action.payload,
      };
    case CLEARCREATEAPPOINTMENTSUCCESS:
      return {
        ...state,
        createappointSuccess: '',
      };
    case EDITAPPOINTMENTSUCCESS:
      return {
        ...state,
        editappointSuccess: action.payload,
      };
    case CLEAREDITAPPOINTMENTSUCCESS:
      return {
        ...state,
        editappointSuccess: '',
      };
      case DELETEAPPOINTMENTSUCCESS:
        return {
          ...state,
          deleteAppointment: action.payload,
        };
      case CLEARDELETEAPPOINTMENTSUCCESS:
        return {
          ...state,
          deleteAppointment: '',
        };
    default:
      return state;
  }
};

export default appointmentReducer;
