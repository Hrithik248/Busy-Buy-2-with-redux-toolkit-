import { useState } from "react"
import style from '../styles/SignInSignUp.module.css';
import { handleSignUp } from "../redux/slices/userAuthSlice";

export default function SignUp() {
    // States for recording user sign-up data
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <form className={style.formCon} onSubmit={(e) => { e.preventDefault(); handleSignUp(name, email, password) }}>
            {/* Sign Up form */}
            <input className={style.name} type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
            {/* Input for user email */}
            <input className={style.email} type="text" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {/* Input for user password */}
            <input className={style.password} type="password" minLength={6} required placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {/* Button to submit the form and trigger sign-up */}
            <button className={style.logInBtn}>Sign up</button>
        </form>
    )
}
