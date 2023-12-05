import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
const productsAdapter=createEntityAdapter({
    selectId: (product) => product.id
})
const fetchProducts=createAsyncThunk('products/fetchProducts',async(args,thunkAPI)=>{
    return getDocs(collection(db,'products'));
})
const productsSlice=createSlice({
    name:'products',
    initialState:{...productsAdapter.getInitialState(),isLoading:false},
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchProducts.pending,(state,action)=>{
            state.isLoading=true;
        })
        .addCase(fetchProducts.fulfilled,(state,action)=>{
            productsAdapter.setAll(action.payload.docs);
            state.isLoading=false;
        })
        .addCase(fetchProducts.rejected,(state,action)=>{
            state.isLoading=false;
            console.log('error in fetching products',action.payload);
        })
    }
})