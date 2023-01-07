import { dbService } from "fbase";
import React, { useState } from "react";
import {collection, addDoc} from "firebase/firestore";
import { async } from "@firebase/util";

const Home = () => {
    const [nweet, setNweet] = useState("");
    const onSubmit = async (event) => {
        event.preventDefault();
        await addDoc(collection(dbService,"nweets"),
        {nweet, createAt:Date.now(),});
        setNweet("");
    };
    const onChange = (event) => {
        const {target:{value}} = event; //event안에 있는 target 안에 있는 value를 달라고 하는 것
     setNweet(value);
    };
    return (
        <div>
        <form onSubmit={onSubmit}>
            <input onChange={onChange} value={nweet} type="text" placeholder="What's on your mind?" maxLength={120} />
            <input type="submit" value="Nweet" /> 
        </form>
    </div>
    );
}
    
export default Home;