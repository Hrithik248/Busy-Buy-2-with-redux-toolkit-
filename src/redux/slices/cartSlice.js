import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
  } from "@reduxjs/toolkit";
  import {
    getDocs,
    collection,
    doc,
    updateDoc,
    increment,
    setDoc,
    deleteDoc,
  } from "firebase/firestore";
  import { toast } from "react-toastify";
  import { db } from "../../config/firebaseInit";
  import { addOrderThunk, fetchOrdersThunk } from "./ordersSlice";
  
  // Creating an entity adapter for managing cart items
  const cartAdapter = createEntityAdapter();
  
  // Async thunk to fetch cart items from Firebase
  export const fetchCartItems = createAsyncThunk(
    "cart/fetchCartItems",
    async (args, thunkAPI) => {
      // Fetching the current user from the Redux state
      const currentUser = thunkAPI.getState().userAuthReducer.user;
  
      // Firebase references
      const allCartsRef = collection(db, "usersCarts");
      const currentUserRef = doc(allCartsRef, currentUser);
      const cartRef = collection(currentUserRef, "myCart");
  
      // Fetching cart items and serializing the data
      const unserializedData = await getDocs(cartRef);
      const serializedData = unserializedData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      return serializedData;
    }
  );
  
  // Async thunk to handle adding an item to the cart
  export const handleAddToCart = createAsyncThunk(
    "cart/handleAddToCart",
    async (args, thunkAPI) => {
      // Fetching the current user from the Redux state
      const currentUser = thunkAPI.getState().userAuthReducer.user;
  
      // Firebase references
      const allCartsRef = collection(db, "usersCarts");
      const currentUserRef = doc(allCartsRef, currentUser);
      const cartRef = collection(currentUserRef, "myCart");
  
      // Fetching the current cart items using the selector
      const cart = thunkAPI.getState().cartReducer.entities;
  
      // Checking if the item with the given ID already exists in the cart
      const itemInCart = cart[args.id];
  
      // Handling the addition of the item to the cart
      if (itemInCart) {
        const itemRef = doc(cartRef, args.id);
        await updateDoc(itemRef, {
          qty: increment(1),
        });
      } else {
        const itemRef = doc(cartRef, args.id);
        await setDoc(itemRef, { qty: 1 });
      }
  
      return args.id;
    }
  );
  
  // Async thunk to handle removing an item from the cart
  export const handleRemoveFromCart = createAsyncThunk(
    "cart/handleRemoveFromCart",
    async (args, thunkAPI) => {
      // Fetching the current user from the Redux state
      const currentUser = thunkAPI.getState().userAuthReducer.user;
  
      // Firebase references
      const allCartsRef = collection(db, "usersCarts");
      const currentUserRef = doc(allCartsRef, currentUser);
      const cartRef = collection(currentUserRef, "myCart");
  
      // Fetching the current cart items using the selector
      const cart = thunkAPI.getState().cartReducer.entities;
  
      // Fetching the item to be removed
      const itemInCart = cart[args.id];
      const itemRef = doc(cartRef, args.id);
      const currentQty = itemInCart.qty;
  
      // Handling the removal of the item from the cart
      if (currentQty > 1) {
        await updateDoc(itemRef, {
          qty: increment(-1),
        });
      } else {
        await deleteDoc(itemRef);
      }
  
      return args.id;
    }
  );
  
  // Async thunk to clear the entire cart
  export const clearCart = createAsyncThunk("cart/clearCart", async (args, thunkAPI) => {
    // Fetching the current user from the Redux state
    const currentUser = thunkAPI.getState().userAuthReducer.user;
  
    // Fetching the current cart items using the selector
    const cartItems = thunkAPI.getState().cartReducer.entities;
  
    // Firebase references
    const allCartsRef = collection(db, "usersCarts");
    const currentUserRef = doc(allCartsRef, currentUser);
    const cartRef = collection(currentUserRef, "myCart");
  
    // Iterating through each cart item and deleting them
    for (const itemId in cartItems) {
      const itemRef = doc(cartRef, itemId);
      await deleteDoc(itemRef);
    }
  });
  
  // Creating a slice for managing the cart state
  const cartSlice = createSlice({
    name: "cart",
    initialState: {
      ...cartAdapter.getInitialState(),
      isLoading: true,
      placingOrder: false,
    },
    reducers: {
      // Custom reducer to clear the entire cart state
      clearCartState: (state, action) => {
        cartAdapter.removeAll(state);
      },
    },
    extraReducers: (builder) => {
      // Handling async actions with extraReducers
      builder
        .addCase(fetchCartItems.fulfilled, (state, action) => {
          cartAdapter.setAll(state, action.payload);
          state.isLoading = false;
        })
        .addCase(fetchCartItems.pending, (state, action) => {
          state.isLoading = true;
        })
        .addCase(fetchCartItems.rejected, (state, action) => {
          state.isLoading = false;
          toast.error("Something went wrong !", {
            position: toast.POSITION.TOP_RIGHT
          });
          console.log("error in fetching cart items");
        })
        .addCase(handleAddToCart.fulfilled, (state, action) => {
          const id = action.payload;
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
        .addCase(handleAddToCart.rejected, (state, action) => {
            toast.error("Something went wrong !", {
                position: toast.POSITION.TOP_RIGHT
            });
          console.log("error in adding item to cart");
        })
        .addCase(handleRemoveFromCart.fulfilled, (state, action) => {
          const id = action.payload;
          const existingItem = state.entities[id];
  
          if (existingItem.qty > 1) {
            // If the quantity is greater than 1, decrease the quantity
            cartAdapter.updateOne(state, {
              id,
              changes: { qty: existingItem.qty - 1 },
            });
          } else {
            // If the quantity is 1, remove the item from the cart
            cartAdapter.removeOne(state, id);
          }
        })
        .addCase(handleRemoveFromCart.rejected, (state, action) => {
            toast.error("Something went wrong !", {
                position: toast.POSITION.TOP_RIGHT
            });
          console.log("error in removing item from cart");
        })
        .addCase(clearCart.pending, (state, action) => {
          state.isLoading = true;
        })
        .addCase(clearCart.fulfilled, (state, action) => {
          cartAdapter.removeAll(state);
          state.isLoading = false;
        })
        .addCase(clearCart.rejected, (state, action) => {
          state.isLoading = false;
          toast.error("Something went wrong !", {
            position: toast.POSITION.TOP_RIGHT
        });
          console.log("unable to clear cart");
        })
        .addCase(addOrderThunk.pending, (state, action) => {
          state.placingOrder = true;
        })
        .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
          state.placingOrder = false;
        });
    },
  });
  
  // Exporting the cart reducer and selectors
  export const cartReducer = cartSlice.reducer;
  export const cartEntitiesSelector = (state) => state.cartReducer.entities;
  export const cartLoadingSelector = (state) => state.cartReducer.isLoading;
  export const placingOrderSelector = (state) => state.cartReducer.placingOrder;
  export const { clearCartState } = cartSlice.actions;
  