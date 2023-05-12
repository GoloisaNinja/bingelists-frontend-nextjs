import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "@/rootReducer";

export interface IFavoriteAction {
    type: string,
    favoriteId: string,
}
export interface Favorites {
    owner: string,
    movie: string[],
    tv: string[],
}

const initialState: Favorites = {
    owner: "",
    movie: [],
    tv: [],
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
                state.movie = [...state.movie, payload.favoriteId];
            } else {
                state.tv = [...state.tv, payload.favoriteId];
            }
            return state;
        },
        removeFromFavorites: (state, {payload}: PayloadAction<IFavoriteAction>) => {
            if (payload.type === "movie") {
                state.movie = state.movie.filter((id) => id !== payload.favoriteId);
            } else {
                state.tv = state.tv.filter((id) => id !== payload.favoriteId);
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