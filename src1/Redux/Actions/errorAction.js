import {GET_ERRORS, CLEAR_ERRORS, SHOW_MESSAGE} from './types';

export const returnErrors = (res,message, status, id) => {
  return {
    type: GET_ERRORS,
    payload: {res, message, status, id},
  };
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};

export const showMessage = msg => {
  return {
    type: SHOW_MESSAGE,
    payload: msg,
  };
};
