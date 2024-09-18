import {createSlice} from "@reduxjs/toolkit";

export type RootState = {
    global: {
        name: "string";
        user: object;
    };
}

export const globalSlice = createSlice({
    name: "global",
    initialState: {
        name: "global",
        user: {},
    },
    reducers: {
        setName: (state, {payload}) => {
            state.name = payload;
        },
        setUserData: (state, {payload}) => {
            state.user = payload;
        },
    },
});

export const {setName, setUserData} = globalSlice.actions;

export default globalSlice.reducer;
