import {
    CREATESUPPORTSUCCESS,
    
  } from '../Actions/types';
  
  const initialState = {
    
    createsupportSuccess: null,
   
  };
  const supportReducer = (state = initialState, action) => {
    switch (action.type) {
      case CREATESUPPORTSUCCESS:
      return {
        ...state,
        createsupportSuccess: action.payload,
      };
      default:
      return state;
  }
};

export default supportReducer;
  