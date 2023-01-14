import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, GoogleAuthProvider,signInWithPopup} from 'firebase/auth'
import { async } from "@firebase/util";
import AuthForm from "components/AuthForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faCloudMoon } from "@fortawesome/free-solid-svg-icons";

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
        <div className="authContainer">
            <FontAwesomeIcon
            icon={faCloudMoon}
            color={"#806dbf"}
            size="3x"
            style={{ marginBottom: 30 }}
            />
            <AuthForm />
            <div className="authBtns">
                <button 
                    onClick={onSocialClick} 
                    name="google"
                    className="authBtn" >
                    Continue with Google_
                    <FontAwesomeIcon icon={faGoogle} />
                </button>
                <button  
                    onClick={onSocialClick} 
                    name="github" 
                    className="authBtn">
                    Continue with Github_ 
                    <FontAwesomeIcon icon={faGithub} />
                </button>
            </div>
        </div>
    );
}
    
export default Auth;