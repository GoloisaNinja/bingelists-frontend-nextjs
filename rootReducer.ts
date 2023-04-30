import { combineReducers } from '@reduxjs/toolkit';
import {authSlice} from "./features/auth/authSlice";
import {alertSlice} from "./features/alert/alertSlice";
import {bingeSlice} from "@/features/binge/bingeSlice";
import {favoriteSlice} from "@/features/favorite/favoriteSlice";

const rootReducer = combineReducers({
    auth: authSlice.reducer,
    alert: alertSlice.reducer,
    binge: bingeSlice.reducer,
    favorite: favoriteSlice.reducer,
})

export type RootState = ReturnType<any>
export default rootReducer;