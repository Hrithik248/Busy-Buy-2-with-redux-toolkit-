import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseInit";
import { createSelector } from 'reselect';

// Entity adapter for state normalization
const productsAdapter = createEntityAdapter({
    selectId: (product) => product.id
});

// Async thunk to fetch products from Firebase
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (args, thunkAPI) => {
    // Fetching product data from the 'products' collection in Firebase
    const querySnapshot = await getDocs(collection(db, 'products'));
    // Serializing the data and adding IDs to each product
    const serializedData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return serializedData;
});

// Products slice selector
const selectProducts = (state) => state.productsReducer;

// Creating a slice for managing the products state
const productsSlice = createSlice({
    name: 'products',
    initialState: productsAdapter.getInitialState({ isLoading: false }),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state, action) => {
                // Setting loading state to true while fetching products
                state.isLoading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                // Setting product entities and updating loading state on successful fetch
                productsAdapter.setAll(state, action.payload);
                state.isLoading = false;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                // Updating loading state and logging an error message on fetch failure
                state.isLoading = false;
                console.log('error in fetching products', action.payload);
            });
    }
});

// Selector to get product entities
export const selectProductEntities = createSelector(
    [selectProducts],
    (products) => products.entities
);

// Create a selector for the products list
export const selectProductsList = createSelector(
    [selectProducts],
    (products) => products.ids.map((id) => products.entities[id])
);

// Create a selector for the loading state
export const selectProductsLoadingState = createSelector(
    [selectProducts],
    (products) => products.isLoading
);

// Create a selector for a specific product by ID
export const selectProductById = (productId) => createSelector(
    [selectProducts],
    (products) => products.entities[productId] || null
);

// Exporting the products reducer
export const productsReducer = productsSlice.reducer;
