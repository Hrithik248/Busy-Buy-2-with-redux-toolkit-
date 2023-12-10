import {createSlice } from "@reduxjs/toolkit";
import { auth } from "../../config/firebaseInit";
import { toast } from "react-toastify";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile, 
    onAuthStateChanged, 
    signOut 
} from "firebase/auth";
import { fetchCartItems ,clearCartState} from "./cartSlice";
import { fetchProducts } from "./productsSlice";
  export const listenToAuthChanges = () => (dispatch) => {
    onAuthStateChanged(auth,(user) => {
        dispatch(setLoading(true));
        if(user){
            dispatch(setUser(user.uid));
        }
        else{
            dispatch(setUser(null));
        }
        dispatch(fetchProducts());
        dispatch(setLoading(false));
        if(user){
            dispatch(fetchCartItems());
        }
        else{
            dispatch(clearCartState());
        }
    });
};
export const handleSignIn=async (email,password)=>{
    try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Signed In successfully !", {
            position: toast.POSITION.TOP_CENTER
        });
    } catch (error) {
        toast.error("Something went wrong !", {
            position: toast.POSITION.TOP_RIGHT
        });
        console.log('error in signing in',error);
    }
}
export const handleSignOut=async ()=>{
    try {
        await signOut(auth);
        toast.success("Signed out successfully !", {
            position: toast.POSITION.TOP_CENTER
        });
    } catch (error) {
        toast.error("Something went wrong !", {
            position: toast.POSITION.TOP_RIGHT
        });
        console.log('unable to logout',error);
    }
}
export const handleSignUp=async(name,email,password)=>{
    try {
        const userCredential=await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        toast.success("Signed Up successfully !", {
            position: toast.POSITION.TOP_CENTER
        });
    } catch (error) {
        toast.error("Something went wrong !", {
            position: toast.POSITION.TOP_RIGHT
        });
        console.log('error in creating user',error);
    }
}
const userAuthSlice=createSlice({
    name:'user',
    initialState:{user:null,isLoading:true},
    reducers:{
        setUser:(state,action)=>{
            state.user=action.payload;
        },
        setLoading:(state,action)=>{
            state.isLoading=action.payload;
        }
    }
})

export const {setUser,setLoading}=userAuthSlice.actions;
export const authSelector=(state)=>state.userAuthReducer;
export const userAuthReducer=userAuthSlice.reducer;