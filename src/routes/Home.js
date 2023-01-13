import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import {collection, query, onSnapshot, orderBy} from "firebase/firestore";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

const Home = ({userObj}) => {
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

    
    return (
        <div>
            <NweetFactory userObj={userObj} />
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
};
    
export default Home;