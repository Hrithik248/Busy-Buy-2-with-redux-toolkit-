import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { getDocs, collection, doc, updateDoc, increment, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../config/firebaseInit"; 
import { addOrderThunk, fetchOrdersThunk } from "./ordersSlice";
const cartAdapter=createEntityAdapter();

export const fetchCartItems=createAsyncThunk('cart/fetchCartItems',async(args,thunkAPI)=>{
    const currentUser=thunkAPI.getState().userAuthReducer.user;
    const allCartsRef = collection(db, 'usersCarts');
    const currentUserRef = doc(allCartsRef, currentUser);
    const cartRef = collection(currentUserRef, 'myCart');
    const unserializedData=await getDocs(cartRef);
    const serializedData=unserializedData.docs.map((doc)=>({id:doc.id,...doc.data()}));
    return serializedData;
})
export const handleAddToCart = createAsyncThunk('cart/handleAddToCart', async (args, thunkAPI) => {
    console.log('hand ad toc',args)
    const currentUser=thunkAPI.getState().userAuthReducer.user;
    console.log(currentUser);
    const allCartsRef = collection(db, 'usersCarts');
    const currentUserRef = doc(allCartsRef, currentUser);
    const cartRef = collection(currentUserRef, 'myCart');
  
    // Get current cart items using the selector
    const cart = thunkAPI.getState().cartReducer.entities;  
    // Check if the item with the given ID already exists in the cart
    const itemInCart = cart[args.id];
  
    // If item is already in cart, increase the quantity by 1
    if (itemInCart) {
        console.log('item in cart')
      const itemRef = doc(cartRef, args.id);
      const updatedItem = await updateDoc(itemRef, {
        qty: increment(1)
      });
    } else {
      // If the item is not in the cart, add the item with qty 1
      console.log('item not in cart');
      const itemRef = doc(cartRef, args.id);
      const addedItem = await setDoc(itemRef, { qty: 1 });
    }
    return args.id;
  });
  export const handleRemoveFromCart = createAsyncThunk('cart/handleRemoveFromCart', async (args, thunkAPI) => {
    const currentUser=thunkAPI.getState().userAuthReducer.user;
    const allCartsRef = collection(db, 'usersCarts');
    const currentUserRef = doc(allCartsRef, currentUser);
    const cartRef = collection(currentUserRef, 'myCart');
    const cart = thunkAPI.getState().cartReducer.entities;    
    const itemInCart = cart[args.id];
    const itemRef = doc(cartRef, args.id);
    const currentQty = itemInCart.qty;
    if (currentQty > 1) {
        // If the quantity is greater than 1, decrease the quantity
        const updatedItem = await updateDoc(itemRef, {
          qty: increment(-1)
        });
    } else {
        // If the quantity is 1, delete the document
        await deleteDoc(itemRef);
    }
    return args.id;
});
export const clearCart=createAsyncThunk('cart/clearCart',async(args,thunkAPI)=>{
    const currentUser=thunkAPI.getState().userAuthReducer.user;
    const cartItems = thunkAPI.getState().cartReducer.entities;    
    const allCartsRef = collection(db, 'usersCarts');
    const currentUserRef = doc(allCartsRef, currentUser);
    const cartRef = collection(currentUserRef, 'myCart');
    for (const itemId in cartItems) {
        const itemRef = doc(cartRef, itemId);
        await deleteDoc(itemRef);
    }
})
const cartSlice=createSlice({
    name:'cart',
    initialState:{
        ...cartAdapter.getInitialState(),
        isLoading:true,
        placingOrder:false
    },
    reducers:{
        clearCartState:(state,action)=>{
            cartAdapter.removeAll(state);
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchCartItems.fulfilled,(state,action)=>{
            cartAdapter.setAll(state,action.payload);
            state.isLoading=false;
        })
        .addCase(fetchCartItems.pending,(state,action)=>{
            state.isLoading=true;
        })
        .addCase(fetchCartItems.rejected,(state,action)=>{
            state.isLoading=false;
            console.log('error in fetching cart items',action.payload);
        })
        .addCase(handleAddToCart.fulfilled,(state,action)=>{
            console.log('case hac', action.payload);
            const id = action.payload;
            console.log(state);
            const existingItem = state.entities[id];

            if (existingItem) {
            // If the item exists in the cart, increase its quantity
                cartAdapter.updateOne(state, {
                    id: existingItem.id,
                    changes: { qty: existingItem.qty + 1 },
                });
            } else {
                // If the item is not in the cart, add it with quantity 1
                cartAdapter.addOne(state, { id, qty: 1 });
            }
        })
        .addCase(handleAddToCart.rejected,(state,action)=>{
            console.log('error in adding item to cart', action.payload);
        })
        .addCase(handleRemoveFromCart.fulfilled,(state,action)=>{
            const id= action.payload;
            const existingItem = state.entities[id];
            console.log(existingItem,id);
            if (existingItem.qty>1) {
                cartAdapter.updateOne(state, {
                id,
                changes: { qty: existingItem.qty - 1 },
            });
            } else {
                cartAdapter.removeOne(state,id);
            }
        })
        .addCase(handleRemoveFromCart.rejected,(state,action)=>{
            console.log('error in removeing item from cart');
        })
        .addCase(clearCart.pending,(state,action)=>{
            state.isLoading=true;
        })
        .addCase(clearCart.fulfilled,(state,action)=>{
            cartAdapter.removeAll(state);
            state.isLoading=false;
        })
        .addCase(clearCart.rejected,(state,action)=>{
            state.isLoading=false;
            console.log('unable to clear cart',action.payload);
        })
        .addCase(addOrderThunk.pending,(state,action)=>{
            state.placingOrder=true;
        })
        .addCase(fetchOrdersThunk.fulfilled,(state,action)=>{
            state.placingOrder=false;
        })
    }
})

export const cartReducer=cartSlice.reducer;
export const cartEntitiesSelector=(state)=>state.cartReducer.entities;
export const cartLoadingSelector=(state)=>state.cartReducer.isLoading;
export const placingOrderSelector=(state)=>state.cartReducer.placingOrder;
export const {clearCartState}=cartSlice.actions;