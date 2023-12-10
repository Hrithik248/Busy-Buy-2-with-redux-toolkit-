import { configureStore } from "@reduxjs/toolkit";
import { ordersReducer } from "./slices/ordersSlice";
import { userAuthReducer } from "./slices/userAuthSlice";
import { productsReducer } from "./slices/productsSlice";
import { cartReducer } from "./slices/cartSlice";

// Configuring the Redux store with combineReducers
export const store = configureStore({
  // Defining the root reducer by combining individual slice reducers
  reducer: {
    ordersReducer,      // Reducer for managing orders state
    userAuthReducer,    // Reducer for managing user authentication state
    productsReducer,    // Reducer for managing products state
    cartReducer         // Reducer for managing shopping cart state
  },
});
