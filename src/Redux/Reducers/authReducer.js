import {
  CHECKAUTH,
  CLEAR_AUTH,
  CLEARRESETLINK,
  CLEARRESETPASSWORDSTATUS,
  FORGOTPASSWORDRESETLINKSUCCESS,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  RESETPASSWORDSUCCESS,
} from '../Actions/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  isAuthenticated: null,
  user: null,
  linksent: null,
  resetstatus: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      AsyncStorage.setItem('userData', JSON.stringify(action.payload));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case CHECKAUTH:
      return {
        ...state,
        isAuthenticated: true,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isAuthenticated: false,
      };
    case CLEAR_AUTH:
      AsyncStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
      };
    case FORGOTPASSWORDRESETLINKSUCCESS:
      return {
        ...state,
        linksent: true,
      };
    case CLEARRESETLINK:
      return {
        ...state,
        linksent: null,
      };
    case RESETPASSWORDSUCCESS:
      return {
        ...state,
        resetstatus: true,
      };
    case CLEARRESETPASSWORDSTATUS:
      return {
        ...state,
        resetstatus: null,
      };
    default:
      return state;
  }
};

export default authReducer;
