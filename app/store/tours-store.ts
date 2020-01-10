import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export default createSlice({
    name: 'tours',
    initialState: 0,
    reducers: {
        increment: (state, action: PayloadAction<number>) => {
            return state + action.payload;
        },
    },
});
