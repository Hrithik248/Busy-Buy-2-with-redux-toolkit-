import { configureStore } from "@reduxjs/toolkit";
import { ordersReducer } from "./slices/ordersSlice";
import { userAuthReducer } from "./slices/userAuthSlice";
import { productsReducer } from "./slices/productsSlice";
import { cartReducer } from "./slices/cartSlice";
export const store = configureStore({
    reducer:{ordersReducer,userAuthReducer,productsReducer,cartReducer},
});
