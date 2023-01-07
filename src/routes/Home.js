import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import {collection, addDoc, getDocs, query} from "firebase/firestore";
import { async } from "@firebase/util";

const Home = () => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const getNweets = async() => {
        const dbNweets = await getDocs(collection(dbService, "nweets"));
        dbNweets.forEach((document) => {
            const nweetObject = {
                ...document.data(),
                id: document.id,
            };
            setNweets((prev) => [nweetObject, ...prev]);
        });
    };
    useEffect(() => {
        getNweets();
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        await addDoc(collection(dbService,"nweets"),
        {nweet, createdAt:Date.now(),});
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
        <div>
            {nweets.map((nweet) => (
                <div key={nweet.id}>
                    <h4>{nweet.nweet}</h4>
                </div>
            ))};
        </div>
    </div>
    );
}
    
export default Home;