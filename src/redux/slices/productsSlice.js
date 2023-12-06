import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs} from "firebase/firestore";
import { db } from "../../config/firebaseInit";
import { createSelector } from 'reselect';
//entity adapter for state normalization
const productsAdapter=createEntityAdapter({
    selectId: (product) => product.id
})
export const fetchProducts=createAsyncThunk('products/fetchProducts',async(args,thunkAPI)=>{
    return getDocs(collection(db,'products'));
})
//products slice selector
console.log(productsAdapter.getInitialState());
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
            const fetchedProducts=action.payload.docs.map((doc)=>({...doc.data(),id:doc.id}));
            productsAdapter.setAll(state,fetchedProducts);
            state.isLoading=false;
        })
        .addCase(fetchProducts.rejected,(state,action)=>{
            state.isLoading=false;
            console.log('error in fetching products',action.payload);
        })
    }
})
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
export const productsstate=(state)=>state;
export const productsReducer=productsSlice.reducer;