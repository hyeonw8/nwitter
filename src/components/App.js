import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import {authService} from "fbase";
import { updateCurrentUser, updateProfile } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user) {
        setIsLoggedIn(true);
        setUserObj({
          displayName:user.displayName,
          uid: user.uid,
          updateProfile: (args) => updateProfile(user, 
            {displayName:user.displayName}),
        })
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = async() => {
    const user = authService.currentUser;
    // await updateCurrentUser(authService,authService.currentUser);
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  return (
    <>
    {init ? (
      <AppRouter 
        refreshUser={refreshUser}
        isLoggedIn={isLoggedIn} 
        userObj={userObj}/> )
      : ("Initializing...")}
    {/*<footer>&copy; {new Date().getFullYear()} Nwitter</footer> */}
    </>
  );
}

export default App;
