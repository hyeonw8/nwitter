import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import {collection, addDoc, getDocs, query, onSnapshot, orderBy} from "firebase/firestore";
import { async } from "@firebase/util";
import Nweet from "components/Nweet";
import { v4 as uuidv4 } from 'uuid';
import {getDownloadURL, ref, uploadString} from "@firebase/storage";

const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState();
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
        let attachmentUrl = ""; //사진이 없다면 그냥 빈 스트링 , 있다면 업로드하고 아래 과정을 진행함
                                //그리고 난 다음 비어있는 string을 stroage에서 다운로드 받은 url로 업에이트함
        if(attachment != "") {
        const attachmentRef = ref(storageService,`${userObj.uid}/${uuidv4()}`);
        const response = await uploadString(attachmentRef,attachment, "data_url");
        attachmentUrl = await getDownloadURL(response.ref);
        }
        const nweetObj = {
            text : nweet, 
            createdAt : Date.now(),
            creatorId : userObj.uid,
            attachmentUrl,
        };
        await addDoc(collection(dbService,"nweets"), nweetObj);
        setNweet(""); 
        setAttachment("");
    };
    const onChange = (event) => {
        const {target:{value}} = event; //event안에 있는 target 안에 있는 value를 달라고 하는 것
     setNweet(value);
    };
    const onFileChange = (event) => {
        const {target:{files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader(); //file api
        reader.onloadend = (finishedEvent) => {
            const {currentTarget : {result},
            }  = finishedEvent;
            setAttachment(result); //onloadend에 finishEvent의 result를 setAttachment로 설정
        };
        reader.readAsDataURL(theFile);
    };
    const onClearAttachment  = () => setAttachment(null);
    return (
        <div>
        <form onSubmit={onSubmit}>
            <input 
                onChange={onChange} 
                value={nweet} 
                type="text" 
                placeholder="What's on your mind?" 
                maxLength={120} 
            />
            <input type="file" accept="image/*" onChange={onFileChange} />
            <input type="submit" value="Nweet"/>
            {attachment && (
                <div>
                <img src={attachment} width="50px" height="50px" /> 
                <button onClick={onClearAttachment}>Clear</button>   
            </div>
            )}   
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
};
    
export default Home;