import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  dataList: [],
};

export const tourPlanSlice = createSlice({
    name: 'TourPlan',
    initialState: initialState,
    reducers: {
        // Define your custom reducer actions here
        // Example:
        addUserList: (state, action) => {
          state.dataList = action.payload;
        },
    
    },
});

export const { addUserList } = tourPlanSlice.actions;

export default tourPlanSlice.reducer;