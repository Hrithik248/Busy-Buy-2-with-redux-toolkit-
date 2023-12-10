import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, addDoc, collection, getDocs, serverTimestamp, getDoc, query, orderBy} from "firebase/firestore";
import { db } from '../../config/firebaseInit';
import { clearCart } from './cartSlice';
import { toast } from "react-toastify";

// Creating an entity adapter for managing orders
const ordersAdapter = createEntityAdapter({});

// Async thunk to fetch orders from Firebase
export const fetchOrdersThunk = createAsyncThunk('orders/fetchOrdersThunk', async (args, thunkAPI) => {
    const currentUser = thunkAPI.getState().userAuthReducer.user;
    const userOrdersRef = collection(db, 'userOrders');
    const currentUserRef = doc(userOrdersRef, currentUser);
    const ordersRef = collection(currentUserRef, 'orders');
    const q = query(ordersRef, orderBy('timestamp', 'desc'));
    const unserializedData = await getDocs(q);
    const serializedData = unserializedData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate().toLocaleDateString()
    }));
    return serializedData;
});

// Async thunk to add a new order to Firebase
export const addOrderThunk = createAsyncThunk('orders/addOrderThunk', async (args, thunkAPI) => {
    const currentUser = thunkAPI.getState().userAuthReducer.user;
    const userOrdersRef = collection(db, 'userOrders');
    const currentUserRef = doc(userOrdersRef, currentUser);
    const ordersRef = collection(currentUserRef, 'orders');
    const cartItems = thunkAPI.getState().cartReducer.entities;
    const addedOrderRef = await addDoc(ordersRef, { timestamp: serverTimestamp(), order: Object.values(cartItems) });
    const addedOrder = await getDoc(addedOrderRef);

    // Dispatching an action to clear the cart after placing an order
    thunkAPI.dispatch(clearCart());

    // Returning the added order details
    return { id: addedOrder.id, ...addedOrder.data(), timestamp: addedOrder.data().timestamp.toDate().toLocaleDateString() };
});

// Creating a slice for managing the orders state
const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        ...ordersAdapter.getInitialState(),
        loading: true
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrdersThunk.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
                ordersAdapter.setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(fetchOrdersThunk.rejected, (state, action) => {
                state.loading = false;
                console.log('error in fetching orders');
            })
            .addCase(addOrderThunk.fulfilled, (state, action) => {
                // Displaying a success toast when the order is placed successfully
                toast.success("Order placed successfully!", {
                    position: toast.POSITION.TOP_CENTER
                });
            })
            .addCase(addOrderThunk.rejected, (state, action) => {
                // Displaying an error toast when there's an issue placing the order
                toast.error("Something went wrong!", {
                    position: toast.POSITION.TOP_RIGHT
                });
                console.log('error in adding order');
            });
    }
});

// Exporting the orders reducer and selectors
export const ordersSelector = (state) => state.ordersReducer.entities;
export const ordersLoadingSelector = (state) => state.ordersReducer.loading;
export const ordersReducer = ordersSlice.reducer;
