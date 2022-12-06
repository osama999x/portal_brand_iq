import { combineReducers } from "redux";
import authenticationSlice from "./slices/authenticationSlice";
import utilitySlice from './slices/utilitySlice'

export default combineReducers({
    authenticationSlice,
    utilitySlice,
});
