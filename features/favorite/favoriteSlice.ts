import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "@/rootReducer";

export interface IFavoriteAction {
    type: string,
    favoriteId: string,
}
export interface Favorites {
    ownerId: string,
    movieIds: string[],
    tvIds: string[],
}

const initialState: Favorites = {
    ownerId: "",
    movieIds: [],
    tvIds: [],
}

export const favoriteSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        loadMinifiedFavorites: (state, {payload}: PayloadAction<Favorites>) => {
            state = {...payload};
            return state;
        },
        addToFavorites: (state, {payload}: PayloadAction<IFavoriteAction>) => {
            if (payload.type === "movie") {
                state.movieIds = [...state.movieIds, payload.favoriteId];
            } else {
                state.tvIds = [...state.tvIds, payload.favoriteId];
            }
            return state;
        },
        removeFromFavorites: (state, {payload}: PayloadAction<IFavoriteAction>) => {
            if (payload.type === "movie") {
                state.movieIds = state.movieIds.filter((id) => id !== payload.favoriteId);
            } else {
                state.tvIds = state.tvIds.filter((id) => id !== payload.favoriteId);
            }
        }
    }
})

export const {
    loadMinifiedFavorites,
    addToFavorites,
    removeFromFavorites
} = favoriteSlice.actions;
export const favoriteSelector = (state: RootState) => state.favorite;