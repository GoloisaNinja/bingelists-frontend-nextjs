import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "@/rootReducer";

export type Alert = {
    id: string,
    type: string,
    message: string,
}
const initialState: Alert[] = [];

export const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        setAlert: (state, {payload}: PayloadAction<Alert>) => {
            state = [...state, payload];
            return state;
        },
        removeAlert: (state, {payload}:PayloadAction<string>) => {
            return state.filter((alert) => alert.id !== payload);
        }
    }
})

export const { setAlert, removeAlert } = alertSlice.actions;
export const alertSelector = (state: RootState) => state.alert;