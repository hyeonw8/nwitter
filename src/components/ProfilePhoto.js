import { async } from "@firebase/util";
import React, { useRef, useState } from "react";
import {Avatar} from "antd";
import { authService, dbService, storageService } from "fbase";
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { upload } from "@testing-library/user-event/dist/upload";
import { addDoc, collection } from "firebase/firestore";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default ({refreshUser,userObj}) => {
    const [image, setImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
   // const [imgupdate, setImgupdate] = useState("");
    //const fileInput = useRef(null);
    const onSubmit = async (event) => {
        let imageUrl = "";
        if (image !== "") {
            const imgRef = ref(storageService,`${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(imgRef, image, "data_url");
            imageUrl = await getDownloadURL(response.ref);
        };
        const imgObj = {
            createdAt : Date.now(),
            creatorId : userObj.uid,
            imageUrl,
        };
        await addDoc(collection(dbService, "nweets"), imgObj);
        setImage("");
        refreshUser();
    };
    const onChange = () => {

    }
    const onFileChange = (event) => {
        const {target:{files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader(); //file api
        reader.onloadend = (finishedEvent) => {
            const {currentTarget : {result},
            }  = finishedEvent;
            setImage(result); //onloadend에 finishEvent의 result를 setAttachment로 설정
        };
        reader.readAsDataURL(theFile);
    };
    const fileInput = useRef();
    const onClearImage  = () => {
        setImage("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
        //fileInput.current.value = null;
    };
   /*  const onChange = (event) => {
        if(event.target.files[0]) {
            setImage(event.target.files[0])
        } else { // upload cancel
            setImage("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
        }
        const reader = new FileReader();
        reader.onload = () => {
            if(reader.readyState === 2){
                setImage(reader.result);
            }
        }
        reader.readAsDataURL(event.target.files[0]);
    }; */

    return(
        <form onSubmit={onSubmit} className="profileUpdate">
            <>
            {image && (
                <div>
                    <Avatar 
                        className="avatar_img"
                        src={image} 
                        size={200} 
                        onClick={()=>{fileInput.current.click()}}/>
                    <div 
                        className="factoryForm__clear" 
                        onClick={onClearImage}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )} 
            
            <input 
                id="add-profimg"
                type="file"
                accept="image/*"
                name='profile_img'
                onChange={onFileChange}
                ref={fileInput}
                style={{
                    opacity: 0,
                }}/>
            <input 
                type="submit" 
                value="Update Image"
                className="formBtn"
                style={{
                marginBottom: 10,
                }} 
            />
            </>
        </form>
    );
};