import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "@/rootReducer";

export interface IListAction {
    id: string,
    type: string,
    media_id: string,
}

interface MinifiedBingeList {
    id: string,
    name: string,
    movie: string[],
    tv: string[],
}

export interface BingeLists {
    lists: MinifiedBingeList[],
}

const initialState: BingeLists = {
    lists: [],
}

export const bingeSlice = createSlice({
    name: 'binge',
    initialState,
    reducers: {
        loadMinifiedBingeLists: (state, {payload}: PayloadAction<MinifiedBingeList[]>) => {
            state.lists = payload;
        },
        addToMinifiedBingeList: (state, {payload}: PayloadAction<IListAction>) => {
            const index = state.lists.findIndex((list) => list.id === payload.id);
            const listsCopy: MinifiedBingeList[] = [...state.lists];
            let itemsCopy: string[] = [];
            if (payload.type === "movie") {
                itemsCopy = listsCopy[index].movie;
                listsCopy[index].movie = [...itemsCopy, payload.media_id];
            } else {
                itemsCopy = listsCopy[index].tv;
                listsCopy[index].tv = [...itemsCopy, payload.media_id];
            }
            state.lists = listsCopy;
            return state;
        },
        removeFromMinifiedBingeList: (state, {payload}: PayloadAction<IListAction>) => {
            const index = state.lists.findIndex((list) => list.id === payload.id);
            const listsCopy = [...state.lists];
            if (payload.type === "movie") {
                listsCopy[index].movie = listsCopy[index].movie.filter((id) => id !== payload.media_id);
            } else {
                listsCopy[index].tv = listsCopy[index].tv.filter((id) => id !== payload.media_id);
            }
            state.lists = listsCopy;
            return state;
        }
    }
})

export const {
    loadMinifiedBingeLists,
    addToMinifiedBingeList,
    removeFromMinifiedBingeList
} = bingeSlice.actions;
export const bingeSelector = (state: RootState) => state.binge;