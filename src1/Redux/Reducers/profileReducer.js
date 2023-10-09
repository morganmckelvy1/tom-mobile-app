import {GETPROFILEDATA, UPDATEPROFILEDATA,CLEARPROFILEUPDATESTATUS,CHANGEPASSWORDSUCCESS, CLEARCHANGEPASSWORDSTATUS} from '../Actions/types';

const initialState = {
  profileDetails: null,
  profileupdatestatus:null,
  changepasswordStatus:null
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case GETPROFILEDATA:
      return {
        ...state,
        profileDetails: action.payload,
      };
    case UPDATEPROFILEDATA:
      return {
        ...state,
        profileupdatestatus: true,
      };
      case CLEARPROFILEUPDATESTATUS:
        return {
          ...state,
          profileupdatestatus: null,
        };
        case CHANGEPASSWORDSUCCESS:
          return {
            ...state,
            changepasswordStatus: true,
          };
          case CLEARCHANGEPASSWORDSTATUS:
        return {
          ...state,
          changepasswordStatus: null,
        };
    default:
      return state;
  }
};

export default profileReducer;
