import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth } from "../../config/firebaseInit";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile, 
    onAuthStateChanged, 
    signOut 
} from "firebase/auth";
export const signInAsyncThunk=createAsyncThunk('user/signIn',async(args,thunkAPI)=>{
   return signInWithEmailAndPassword(auth, email, password)
  /*.then((userCredential) => {
    // Signed in 
    thunkAPI.dispatch(userCredential.user)
  })
  .catch((error) => {
    console.log('error in signing in ',error);
  });*/
});
export const signOutAsyncThunk=createAsyncThunk('user/signOut',async(args,thunkAPI)=>{
    return signOut(auth);
    /*try {
        // Attempting to sign out the current user
        await signOut(auth);
        thunkAPI.dispatch()
        /*toast.success("Signed out successfully !", {
            position: toast.POSITION.TOP_CENTER
        });
    } catch (error) {
        console.log('unable to log out', error);
        /*toast.error("Something went wrong !", {
            position: toast.POSITION.TOP_RIGHT
        });
    }*/
});
export const createUserAsyncThunk=createAsyncThunk('user/createUser',async(args,thunkAPI)=>{

});
const userAuthSlice=createSlice({
    name:'user',
    initialState:{user:null,isAuthenticated:false},
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(signInAsyncThunk.fulfilled,(state,action)=>{
            state.user=action.payload.user;
            state.isAuthenticated=true;
        })
        .addCase(signInAsyncThunk.rejected,(state,action)=>{
            console.log('error in signing in user', action.payload);
        })
        .addCase(signOutAsyncThunk.fulfilled,(state,action)=>{
            state.user=null;
            state.isAuthenticated=false;
        })
        .addCase(signOutAsyncThunk.rejected,(state,action)=>{
            console.log('unable to logout')
        })
    }
})

export const {setUser,removeUser}=userAuthSlice.actions;
export const userAuthReducer=userAuthSlice.reducer;