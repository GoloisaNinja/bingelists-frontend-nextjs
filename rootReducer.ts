import { combineReducers } from '@reduxjs/toolkit';
import {authSlice} from "./features/auth/authSlice";
import {alertSlice} from "./features/alert/alertSlice";
import {bingeSlice} from "@/features/binge/bingeSlice";

const rootReducer = combineReducers({
    auth: authSlice.reducer,
    alert: alertSlice.reducer,
    binge: bingeSlice.reducer,
})

export type RootState = ReturnType<any>
export default rootReducer;