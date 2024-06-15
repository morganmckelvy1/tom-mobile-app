import {
  CAMPAIGNDOWNLOADSTATUS,
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
} from '../Actions/types';

const initialState = {
  contactData: null,
  createContact: null,
  campaignType: null,
  deletedContact: null,
  contactDetails: null,
  feedBack: null,
  campaignList: null,
  createReminder: null,
  campaigndownloadlist:null
};

const contactReducer = (state = initialState, action) => {
  switch (action.type) {
    case GETCONTACTLISTSUCCESS:
      return {
        ...state,
        contactData: action.payload,
      };
    case GETCONTACTCAMPAIGNTYPE:
      return {
        ...state,
        campaignType: action.payload,
      };
    case VIEWCONTACT:
      return {
        ...state,
        contactDetails: action.payload,
      };
    case CLEARVIEWCONTACT:
      return {
        ...state,
        contactDetails: null,
      };
    case CREATECONTACTSUCCESS:
      return {
        ...state,
        createContact: true,
      };

    case CLEARCREATECONTACTSTATUS:
      return {
        ...state,
        createContact: null,
      };
    case DELETECONTACTSUCCESS:
      return {
        ...state,
        deletedContact: true,
      };
    case CLEARDELETECONTACTSTATUS:
      return {
        ...state,
        deletedContact: null,
      };
    case FEEDBACKSTATUS:
      return {
        ...state,
        feedBack: action.payload,
      };
    case CLEARFEEDBACKSTATUS:
      return {
        ...state,
        feedBack: null,
      };
    case CAMPAIGNDOWNLOADSTATUS:
      return {
        ...state,
        campaignList: action.payload,
      };
    case CREATEREMINDERSTATUS:
      return {
        ...state,
        createReminder: true,
      };
    case CLEARCREATEREMINDERSTATUS:
      return {
        ...state,
        createReminder: null,
      };
    case DOWNLOADCAMPAIGNLIST:
      return {
        ...state,
        campaigndownloadlist: action.payload,
      };
    case CLEARDOWNLOADCAMPAIGNLIST:
      return {
        ...state,
        campaigndownloadlist: null,
      };
    default:
      return state;
  }
};

export default contactReducer;
