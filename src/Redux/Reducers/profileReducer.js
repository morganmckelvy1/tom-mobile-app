import { GETPROFILEDATA, UPDATEPROFILEDATA, CLEARPROFILEUPDATESTATUS, CHANGEPASSWORDSUCCESS, CLEARCHANGEPASSWORDSTATUS, PROFILE_UPDATE_FAILED } from '../Actions/types';

const initialState = {
  profileDetails: null,
  profileupdatestatus: null,
  changepasswordStatus: null,
  profile_update_failed: false
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
    case PROFILE_UPDATE_FAILED:
      return {
        ...state,
        profile_update_failed: new Date().getTime(),
      };
    default:
      return state;
  }
};

export default profileReducer;
