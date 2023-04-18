import { combineReducers } from '@reduxjs/toolkit';
import {authSlice} from "./features/auth/authSlice";
import {alertSlice} from "./features/alert/alertSlice";

const rootReducer = combineReducers({
    auth: authSlice.reducer,
    alert: alertSlice.reducer,
})

export type RootState = ReturnType<any>
export default rootReducer;