import { useState } from "react"
import style from '../styles/SignInSignUp.module.css';
import { Link } from "react-router-dom";
import { handleSignIn } from "../redux/slices/userAuthSlice";
export default function SignIn(){
    //states for recording user sign in details
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    return(
        <form className={style.formCon} onSubmit={(e)=>{e.preventDefault();handleSignIn(email,password)}} >
            <h2>Sign In</h2>
            <input className={style.email} type="email" placeholder="Enter you Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input className={style.password} type="password" placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button className={style.logInBtn} >Log In</button>
            <span>Dont have an account yet ? </span><Link to='/sign_up' >Sign up</Link>
        </form>
    )
}