import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "@/rootReducer";

interface Invite {
    id: string,
    bingeListId: string,
    bingeListName: string,
    invitedByName: string,
    invitedById: string,
    invitedUserName: string,
    invitedUserId: string,
    message: string,
}
export interface User {
    id: string,
    name: string,
    email: string,
    token: string,
    invites: Invite[],
    createdAt: string,
    isAuthenticated: boolean,
}

const initialState: User = {
    id: "",
    name: "",
    email: "",
    token: "",
    invites: [],
    createdAt: "",
    isAuthenticated: false,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authenticate: (state, {payload}: PayloadAction<User>) => {
            state.id = payload.id;
            state.name = payload.name;
            state.email = payload.email;
            state.token = payload.token;
            state.invites = payload.invites;
            state.createdAt = payload.createdAt;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state = initialState;
            return state;
        }
    }
})

export const { authenticate, logout } = authSlice.actions;
export const authSelector = (state: RootState) => state.auth;