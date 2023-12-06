import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, addDoc, collection, getDocs} from "firebase/firestore";
import { db } from '../../config/firebaseInit';
const ordersAdapter=createEntityAdapter({});
export const fetchOrdersThunk=createAsyncThunk('orders/fetchOrdersThunk',async(args,thunkAPI)=>{
    const userOrdersRef=collection(db,'userOrders');
    const currentUserRef=doc(userOrdersRef,args.user.uid);
    const ordersRef=collection(currentUserRef,'orders');
    return getDocs(ordersRef);
})
export const addOrderThunk=createAsyncThunk('orders/addOrderThunk',async(args,thunkAPI)=>{
    const userOrdersRef=collection(db,'userOrders');
    const currentUserRef=doc(userOrdersRef,args.user.uid);
    const ordersRef=collection(currentUserRef,'orders');
    return addDoc(ordersRef,args);
})
const ordersSlice=createSlice({
    name:'orders',
    initialState:{
        ...ordersAdapter.getInitialState(),
        loading:false
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchOrdersThunk.pending,(state,action)=>{
            state.loading=true;
        })
        .addCase(fetchOrdersThunk.fulfilled,(state,action)=>{
            ordersAdapter.setAll(state,action.payload);
            state.loading=false;
        })
        .addCase(fetchOrdersThunk.rejected,(state,action)=>{
            state.loading=false;
            console.log('error in fetching orders',action.payload);
        })
        .addCase(addOrderThunk.pending,(state,action)=>{
            state.loading=true;
        })
        .addCase(addOrderThunk.fulfilled,(state,action)=>{
            ordersAdapter.addOne(action.payload);
            state.loading=false;
        })
        .addCase(addOrderThunk.rejected,(state,action)=>{
            state.loading=false;
            console.log('error in adding order',action.payload)
        })
    }
})
export const ordersSelector=(state)=>state.orders;
export const ordersReducer=ordersSlice.reducer;