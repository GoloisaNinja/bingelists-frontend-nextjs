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
interface Token {
    _id: string,
    isExpired: boolean,
    isRevoked: boolean,
    token: string,
    user: string,
}
export interface User {
    _id: string,
    name: string,
    email: string,
    token: Token,
    invites: Invite[],
    createdAt: string,
    isAuthenticated: boolean,
}

const initialState: User = {
    _id: "",
    name: "",
    email: "",
    token: {
        _id: "",
        isExpired: true,
        isRevoked: true,
        token: "",
        user: "",
    },
    invites: [],
    createdAt: "",
    isAuthenticated: false,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authenticate: (state, {payload}: PayloadAction<User>) => {
            state._id = payload._id;
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