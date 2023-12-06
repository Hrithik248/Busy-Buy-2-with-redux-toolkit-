import {createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../../config/firebaseInit";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile, 
    onAuthStateChanged, 
    signOut 
} from "firebase/auth";
/*export const listenToAuthChanges = createAsyncThunk(
    'user/listenToAuthChanges',
    async (args, thunkAPI) => {
      try {
        onAuthStateChanged(auth, (user) => {
          thunkAPI.dispatch(setLoading(true));
          thunkAPI.dispatch(setUser(user));
          thunkAPI.dispatch(setLoading(false));
        });
      } catch (error) {
        console.log('Error in listenToAuthChanges:', error);
      }
    }
  );*/
  export const listenToAuthChanges = () => (dispatch) => {
    console.log('came')
    onAuthStateChanged(auth,(user) => {
        dispatch(setLoading(true));
        dispatch(setUser(user));
        dispatch(setLoading(false));
    });
};
export const handleSignIn=async (email,password)=>{
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log('error in signing in',error);
    }
}
export const handleSignOut=async ()=>{
    try {
        await signOut(auth);
    } catch (error) {
        console.log('unable to logout',error);
    }
}
export const createUser=async(name,email,password)=>{
    try {
        const userCredential=await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
    } catch (error) {
        console.log('error in creating user',error);
    }
}
/*export const signInAsyncThunk=createAsyncThunk('user/signIn',async(args,thunkAPI)=>{
   return signInWithEmailAndPassword(auth, email, password)
  /*.then((userCredential) => {
    // Signed in 
    thunkAPI.dispatch(userCredential.user)
  })
  .catch((error) => {
    console.log('error in signing in ',error);
  });
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
    }
});
export const createUserAsyncThunk=createAsyncThunk('user/createUser',async(args,thunkAPI)=>{

});*/
const userAuthSlice=createSlice({
    name:'user',
    initialState:{user:null,isLoading:true},
    reducers:{
        setUser:(state,action)=>{
            console.log(action.payload)
            state.user=action.payload;
        },
        setLoading:(state,action)=>{
            state.isLoading=action.payload;
        }
    },
    /*extraReducers:(builder)=>{
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
    }*/
})

export const {setUser,setLoading}=userAuthSlice.actions;
export const authSelector=(state)=>state.userAuthReducer;
export const userAuthReducer=userAuthSlice.reducer;