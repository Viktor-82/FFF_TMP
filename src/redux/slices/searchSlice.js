// src/redux/slices/searchSlice.js
import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
    name: "search",
    initialState: {
        query: "", // Хранит текущий поисковый запрос
    },
    reducers: {
        setSearchQuery(state, action) {
            state.query = action.payload;
        },
    },
});

export const { setSearchQuery } = searchSlice.actions;
export default searchSlice.reducer;
