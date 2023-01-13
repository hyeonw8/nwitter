import React, { useState } from "react";
import { HashRouter as Router, Redirect, Route, Switch  } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";


const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
    return ( //&&은 navigation이 존재하려면 isloggedin이 true여야 한다는 것
        <Router> 
            {isLoggedIn && <Navigation userObj={userObj} />} 
            <Switch>
                {isLoggedIn ? (
                    <>
                    <Route exact path="/">
                        <Home userObj={userObj} />
                    </Route>
                    <Route exact path="/profile">
                        <Profile userObj={userObj} refreshUser={refreshUser}/>
                    </Route>
                    </> 
                )  :  (
                    <>
                    <Route>
                        <Auth />
                    </Route>
                    </>
                )}
            </Switch>
        </Router>
    );
}

export default AppRouter;