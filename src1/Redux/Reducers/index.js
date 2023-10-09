import { combineReducers } from "redux";
import authReducer from "./authReducer";
import profileReducer from "./profileReducer";
import contactReducer from "./contactReducer";
import appointmentReducer from "./appointmentReducer";
import errorReducer from "./errorReducer";

const rootReducer = combineReducers({
  auth:authReducer,
  error:errorReducer,
  profile:profileReducer,
  contact:contactReducer,
  appointment:appointmentReducer
});

export default rootReducer;
