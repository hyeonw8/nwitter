import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, GoogleAuthProvider,signInWithPopup} from 'firebase/auth'
import { async } from "@firebase/util";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    const onchange = (event) => {
        const {
            target: {name, value},
        } = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };
    const onSubmit = async (event) => {
        event.preventDefault(); //기본 행위가 실행되는 걸 원치 않음, 내가 컨트롤 할 수 있게 함
        try {
            let data;
            const auth = getAuth();
            if(newAccount) {
                const data = await createUserWithEmailAndPassword(authService,email, password);
            } else {
                const data = await signInWithEmailAndPassword(authService,email, password);
            }
            console.log(data)
        } catch (error) {
            setError(error.message.replace("Firebase:",""));
        }
    };
    const toggleAccount = () => setNewAccount((prev) => !prev);
    const onSocialClick = async (event) => {
        const {
            target: {name},
        } = event;
        let provider;
        if(name === "google"){
            provider = new GoogleAuthProvider();
        } 
        const data = await signInWithPopup(authService, provider);
        console.log(data);
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name="email" type="email" placeholder="Email" required value={email} onChange={onchange} />
                <input name="password" type="password" placeholder="Password" required value={password} onChange={onchange} />
                <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
                {error}  
            </form>
            <span onClick={toggleAccount}>
                {newAccount ? "Sign In" : "Create Account"}
            </span>
            <div>
                <button onClick={onSocialClick} name="google">Continue with Google</button>
                <button>Continue with Github</button>
            </div>
        </div>
    );
}
    
export default Auth;