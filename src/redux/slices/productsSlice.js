import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs} from "firebase/firestore";
import { db } from "../../config/firebaseInit";
import { createSelector } from 'reselect';
//entity adapter for state normalization
const productsAdapter=createEntityAdapter({
    selectId: (product) => product.id
})
export const fetchProducts=createAsyncThunk('products/fetchProducts',async(args,thunkAPI)=>{
    const querySnapshot = await getDocs(collection(db, 'products'));
    const serializedData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return serializedData; 
})
//products slice selector
const selectProducts = (state) => state.productsReducer;
const productsSlice=createSlice({
    name:'products',
    initialState:productsAdapter.getInitialState({ isLoading: false }),
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchProducts.pending,(state,action)=>{
            state.isLoading=true;
        })
        .addCase(fetchProducts.fulfilled,(state,action)=>{
            productsAdapter.setAll(state,action.payload);
            state.isLoading=false;
        })
        .addCase(fetchProducts.rejected,(state,action)=>{
            state.isLoading=false;
            console.log('error in fetching products',action.payload);
        })
    }
})
export const selectProductEntities=createSelector(
    [selectProducts],
    (products)=>products.entities
)
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
    (products) => products.entities[productId]||null
);
//export const productsstate=(state)=>state;
export const productsReducer=productsSlice.reducer;