import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { chatSlice } from "./reducer/chatReducer";
import { DCRSelectDataSlice } from "./reducers/dcrSelectData";
import { cookieSlice } from "./reducers/cookieReducer";

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    chat: chatSlice.reducer,
    dcrData: DCRSelectDataSlice.reducer,
    cookie: cookieSlice.reducer
    // Add more reducers as needed
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})
