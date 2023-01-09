import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import {collection, addDoc, getDocs, query, onSnapshot, orderBy} from "firebase/firestore";
import { async } from "@firebase/util";
import Nweet from "components/Nweet";

const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    useEffect(() => {
        onSnapshot(
            query(collection(dbService, "nweets"), orderBy("createdAt", "desc")),
            (snapshot) => {
                const nweetArray = snapshot.docs.map(doc => 
                    ({id:doc.id,
                    ...doc.data(),
                }));
                setNweets(nweetArray);
            });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        await addDoc(collection(dbService,"nweets"),
        {text:nweet, 
        createdAt:Date.now(),
        creatorId : userObj.uid,});
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
                <Nweet 
                    key={nweet.id} 
                    nweetObj={nweet} //map을 실행하면서 id를 가지고 있는 nweetObj를 보내고 있음
                    isOwner={nweet.creatorId === userObj.uid}/>
            ))}
        </div>
    </div>
    );
}
    
export default Home;