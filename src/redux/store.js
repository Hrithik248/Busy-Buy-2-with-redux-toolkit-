import { configureStore } from "@reduxjs/toolkit";
import { ordersReducer } from "./slices/ordersSlice";
import { userAuthReducer } from "./slices/userAuthSlice";
export const store = configureStore({
    reducer:{ordersReducer,userAuthReducer},
});
