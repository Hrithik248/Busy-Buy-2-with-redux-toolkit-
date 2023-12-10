import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../../config/firebaseInit";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { fetchCartItems, clearCartState } from "./cartSlice";
import { fetchProducts } from "./productsSlice";

// Async action to listen to authentication state changes
export const listenToAuthChanges = () => (dispatch) => {
  // Firebase listener for authentication state changes
  onAuthStateChanged(auth, (user) => {
    // Dispatching loading state while handling auth changes
    dispatch(setLoading(true));

    if (user) {
      // If user is authenticated, set user ID in the state
      dispatch(setUser(user.uid));
    } else {
      // If no user is authenticated, set user to null
      dispatch(setUser(null));
    }

    // Fetching products data from Firebase
    dispatch(fetchProducts());

    // Dispatching loading state after handling auth changes
    dispatch(setLoading(false));

    if (user) {
      // If user is authenticated, fetch cart items
      dispatch(fetchCartItems());
    } else {
      // If no user is authenticated, clear cart state
      dispatch(clearCartState());
    }
  });
};

// Async action to handle user sign in
export const handleSignIn = async (email, password) => {
  try {
    // Firebase sign in with email and password
    await signInWithEmailAndPassword(auth, email, password);

    // Display success toast on successful sign in
    toast.success("Signed In successfully!", {
      position: toast.POSITION.TOP_CENTER
    });
  } catch (error) {
    // Display error toast and log error message on sign in failure
    toast.error("Invalid email/password !", {
      position: toast.POSITION.TOP_RIGHT
    });
    console.log('error in signing in', error);
  }
};

// Async action to handle user sign out
export const handleSignOut = async () => {
  try {
    // Firebase sign out
    await signOut(auth);

    // Display success toast on successful sign out
    toast.success("Signed out successfully!", {
      position: toast.POSITION.TOP_CENTER
    });
  } catch (error) {
    // Display error toast and log error message on sign out failure
    toast.error("Something went wrong!", {
      position: toast.POSITION.TOP_RIGHT
    });
    console.log('unable to logout', error);
  }
};

// Async action to handle user sign up
export const handleSignUp = async (name, email, password) => {
  try {
    // Firebase create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Firebase update user profile with display name
    await updateProfile(userCredential.user, { displayName: name });

    // Display success toast on successful sign up
    toast.success("Signed Up successfully!", {
      position: toast.POSITION.TOP_CENTER
    });
  } catch (error) {
    // Display error toast and log error message on sign up failure
    toast.error("Invalid email/password !", {
      position: toast.POSITION.TOP_RIGHT
    });
    console.log('error in creating user', error);
  }
};

// Creating a slice for managing user authentication state
const userAuthSlice = createSlice({
  name: 'user',
  initialState: { user: null, isLoading: true },
  reducers: {
    setUser: (state, action) => {
      // Reducer to set user ID in the state
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      // Reducer to set loading state in the state
      state.isLoading = action.payload;
    }
  }
});

// Exporting actions and reducer from userAuthSlice
export const { setUser, setLoading } = userAuthSlice.actions;
export const authSelector = (state) => state.userAuthReducer;
export const userAuthReducer = userAuthSlice.reducer;
