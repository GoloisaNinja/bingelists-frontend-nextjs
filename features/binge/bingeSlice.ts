import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "@/rootReducer";

interface MinifiedBingeList {
    id: string,
    name: string,
    minifiedMediaItems: Map<string, number[]>
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

    }
})

export const { loadMinifiedBingeLists, } = bingeSlice.actions;
export const bingeSelector = (state: RootState) => state.binge;