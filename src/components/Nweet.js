import { async } from "@firebase/util";
import { dbService, storageService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { deleteObject,ref } from "@firebase/storage";


const Nweet = ({nweetObj, isOwner}) => {
    const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
    const [editing, setEditing] = useState(false); //edit mode or not 을 알려줌
    const [newNweet, setNewNweet] = useState(nweetObj.text); //input에 입력된 text update
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        console.log(ok);
        if (ok) {
            await deleteDoc(NweetTextRef);
            await deleteObject(ref(storageService,nweetObj.attachmentUrl));
         }
    };
    const toggleEditing = () => setEditing((prev) => !prev); 
    const onSubmit = async(event) => {
        event.preventDefault();
        console.log(nweetObj, newNweet);
        await updateDoc(NweetTextRef, {
            text:newNweet, //nweNweet은 input에 있는 text
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target : {value},
        } = event;
        setNewNweet(value);
    };
    return (
        <div>
           {editing ? (
            <>
            <form onSubmit={onSubmit}>
                <input 
                    type="text" 
                    placeholder="Edit your nweet" 
                    value={newNweet} 
                    onChange={onChange}
                    required />
                    <input type="submit" value="Update Nweet" />
            </form>
            <button onClick={toggleEditing}>Cancel</button>
            </>
            )  :  (
            <>
            <h4>{nweetObj.text}</h4>
            {nweetObj.attachmentUrl && (
                <img src={nweetObj.attachmentUrl} width="50px" height="50px" />
                )}
            {isOwner && ( //내가 isowner일때만 버튼의 fragment를 볼 수 있음
                <>
                    <button onClick={onDeleteClick}>Delete Nweet</button>
                    <button onClick={toggleEditing}>Edit Nweet</button>
     
                </>
            )}
            </>
           )}
        </div>
    );
    
};
export default Nweet;