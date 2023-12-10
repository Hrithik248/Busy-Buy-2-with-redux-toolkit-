import { useState } from "react"
import style from '../styles/SignInSignUp.module.css';
import { Link } from "react-router-dom";
import { handleSignIn } from "../redux/slices/userAuthSlice";

export default function SignIn() {
    // States for recording user sign-in details
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <form className={style.formCon} onSubmit={(e) => { e.preventDefault(); handleSignIn(email, password) }}>
            {/* Sign In form */}
            <h2>Sign In</h2>
            {/* Input for user email */}
            <input className={style.email} type="email" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {/* Input for user password */}
            <input className={style.password} type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {/* Button to submit the form and trigger sign-in */}
            <button className={style.logInBtn}>Log In</button>
            {/* Link to navigate to the Sign Up page */}
            <span>Don't have an account yet? </span><Link to='/sign_up'>Sign up</Link>
        </form>
    )
}
