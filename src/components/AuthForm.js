import { authService } from "fbase";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import Auth from "routes/Auth";

const AuthForm = () => {
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
            console.log(error.message);
            setError(error.message.replace("Firebase:","").split("(")[0 ]);
        }
    };
    const toggleAccount = () => setNewAccount((prev) => !prev);
    return (
    <>
    <form onSubmit={onSubmit} className="container">
        <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            required value={email} 
            onChange={onchange} 
            className="authInput"
        />
        <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            required value={password} 
            className="authInput"
            onChange={onchange} 
        />
        <input 
            type="submit" 
            className="authInput authSubmit"
            value={newAccount ? "Create Account" : "Log In"} 
        />
        {error && <span className="authError">{error}</span>}  
    </form>
    <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign In" : "Create Account"}
    </span>
    </>
    );
};

export default AuthForm;