import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';

const ordersAdapter=createEntityAdapter({});
export const fetchOrders=createAsyncThunk('orders/fetchOrders',async(args,thunkAPI)=>{
    try {
        
    } catch (error) {
        
    }
})
const ordersSlice=createSlice({
    name:'orders',
    initialState:{
        ...ordersAdapter.getInitialState(),
        loading:false
    },
    reducers:{
        setOrders:ordersAdapter.setAll,
        addOrder:ordersAdapter.addOne
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchOrders.pending,(state,action)=>{
            state.loading=true;
        })
        .addCase(fetchOrders.fulfilled,(state,action)=>{
            setOrders(state,action.payload);
            state.loading=false;
        })
        .addCase(fetchOrders.rejected,(state,action)=>{
            console.log('error in fetching orders',action.payload);
        })
    }
})

export const {setOrders,addOrder}=ordersSlice.actions;