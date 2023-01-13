import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, GoogleAuthProvider,signInWithPopup} from 'firebase/auth'
import { async } from "@firebase/util";
import AuthForm from "components/AuthForm";

const Auth = () => {
    const onSocialClick = async (event) => {
        const {
            target: {name},
        } = event;
        let provider;
        if(name === "google"){
            provider = new GoogleAuthProvider();
        } 
        await signInWithPopup(authService, provider);
    };
    return (
        <div>
            <AuthForm />
            <div>
                <button onClick={onSocialClick} name="google">
                    Continue with Google
                </button>
                <button>Continue with Github</button>
            </div>
        </div>
    );
}
    
export default Auth;