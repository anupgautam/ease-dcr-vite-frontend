import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    dataList: [],
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState: initialState,
    reducers: {
        // Define your custom reducer actions here
        // Example:
        addData: (state, action) => {
            state.dataList = action.payload;
        },
        updateData: (state, action) => {
            const { id, newData } = action.payload;
            const index = state.dataList.findIndex(item => item.id === id);
            if (index !== -1) {
                state.dataList[index] = { ...state.dataList[index], ...newData };
            }
        },
        deleteData: (state, action) => {
            const id = action.payload;
            state.dataList = state.dataList.filter(item => item.id !== id);
        },

        addNewData: (state, action) => {

            const newData = action.payload;
            const isUnique = state.dataList.every(item => item.unique_id !== newData.unique_id);
            if (isUnique) {
                state.dataList.push(newData);
            }
        },
    },
});

export const { addData, removeData, updateData, addNewData } = chatSlice.actions;

export default chatSlice.reducer;