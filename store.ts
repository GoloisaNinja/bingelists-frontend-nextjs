import {configureStore, Action, ThunkAction} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import rootReducer, {RootState} from "@/rootReducer";

export const store = configureStore({
    reducer: rootReducer,
})

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch();
export type AppThunk = ThunkAction<void, RootState, unknown, Action>

export default store;