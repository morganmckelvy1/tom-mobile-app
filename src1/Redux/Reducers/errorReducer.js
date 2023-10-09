import {
  GET_ERRORS,
  CLEAR_ERRORS,
  SHOW_MESSAGE,
  CLEARALL,
} from '../Actions/types';

const initialState = {
  response:null,
  message: {},
  status: null,
  id: null,
};

const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ERRORS:
      return {
        response: action.payload.res,
        message: action.payload.message,
        status: action.payload.status,
        id: action.payload.id,
      };
    case CLEAR_ERRORS:
      return {
        response: null,
        message: '',
        status: null,
        id: null,
      };
    case SHOW_MESSAGE:
      return {
        message: action.payload,
      };
    case CLEARALL:
      return {
        ...state,
        response: null,
        message: null,
        status: null,
        id: null,
      };
    default:
      return state;
  }
};

export default errorReducer;
