import {  useState } from "react"
import style from '../styles/SignInSignUp.module.css';
import {  handleSignUp } from "../redux/slices/userAuthSlice";
export default function SignUp(){
    //const navigate=useNavigate();
    //states for recording user sign up data
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    //importing sign up handler and user status from auth Context
    return(
        <form className={style.formCon} onSubmit={(e)=>{e.preventDefault();handleSignUp(name,email,password)}} >
            <input className={style.name} type="text" placeholder="Enter Name" value={name} onChange={(e)=>setName(e.target.value)} />
            <input className={style.email} type="text" placeholder="Enter you Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input className={style.password} type="password" placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button className={style.logInBtn} >Sign up</button>
        </form>
    )
}