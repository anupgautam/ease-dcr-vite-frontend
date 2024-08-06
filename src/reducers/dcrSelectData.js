import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  visited_doctors: [],
  company_areas: [],
  company_products: [],
  rewards: [],
  company_roles: [],
  shifts: [],
  selected_user: 0,
  visited_stockist: [],
  visited_chemist: [],
};

export const DCRSelectDataSlice = createSlice({
    name: 'DCRSelectData',
    initialState: initialState,
    reducers: {
        // Define your custom reducer actions here
        // Example:
        addVisitedDoctors: (state, action) => {  
          state.visited_doctors = action.payload;
        },
        addCompanyAreas: (state, action) => {
            state.company_areas = action.payload;
          },
        addCompanyProducts: (state, action) => {
            state.company_products = action.payload;
          },
        addRewards: (state, action) => {
            state.rewards = action.payload;
          },
        addCompanyRoles: (state, action) => {
            state.company_roles = action.payload;
          },
        addShifts: (state, action) => {
            state.shifts = action.payload;
          },
        addSelectedUser: (state, action) =>{
            state.selected_user = action.payload;
        },
        addStockist: (state, action) =>{
          state.visited_stockist = action.payload;
        },
        addChemist: (state, action) =>{
          state.visited_chemist = action.payload;
        }
    
    },
});

export const {
    addVisitedDoctors,
    addCompanyAreas,
    addCompanyProducts,
    addRewards,
    addCompanyRoles,
    addShifts,
    addSelectedUser,
    addStockist,
    addChemist } = DCRSelectDataSlice.actions;

export default DCRSelectDataSlice.reducer;