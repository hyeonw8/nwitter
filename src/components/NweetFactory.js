import { dbService, storageService } from "fbase";
import React, { useRef, useState } from "react";
import {collection, addDoc} from "firebase/firestore";
import {getDownloadURL, ref, uploadString} from "@firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { async } from "@firebase/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit = async (event) => {
        if (nweet === "") {
            return;
          }
        event.preventDefault();
        let attachmentUrl = ""; //사진이 없다면 그냥 빈 스트링 , 있다면 업로드하고 아래 과정을 진행함
                                //그리고 난 다음 비어있는 string을 stroage에서 다운로드 받은 url로 업에이트함
        if(attachment !== "") {
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
    const fileInput = useRef();
    const onClearAttachment  = () => {
        setAttachment("");
        //fileInput.current.value = null;
    };
    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input 
                className="factoryInput__input"
                onChange={onChange} 
                value={nweet} 
                type="text" 
                placeholder="What's on your mind?" 
                maxLength={120} 
                />
                <input 
                    type="submit" 
                    value="&rarr;" 
                    className="factoryInput__arrow"
                />
            </div>
            <label 
                htmlFor="attach-file" 
                className="factoryInput__label">
                    <span>Add phothos</span>
                    <FontAwesomeIcon icon={faPlus} />
            </label>
            <input 
                id="attach-file"
                type="file" 
                accept="image/*" 
                onChange={onFileChange} 
                ef={fileInput}
                style={{
                    opacity: 0,
                }}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img 
                        src={attachment} 
                        style={{
                            backgroundImage: attachment,
                        }}
                    />
                    <div 
                        className="factoryForm__clear" 
                        onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}   
        </form>
    );
};

export default NweetFactory;