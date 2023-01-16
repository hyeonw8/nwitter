import { async } from "@firebase/util";
import React, { useRef, useState } from "react";
import {Avatar} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default () => {
    const [image, setImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
    const fileInput = useRef(null);
    const onSubmit = async (event) => {
        if (image === "") {
            return;
        }
        event.preventDefault();

    }
    const onChange = (event) => {
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
    };

    return(
        <form onSubmit={onSubmit} className="profileUpdate">
            <>
            <Avatar
                className="avatar_img"
                src={image} 
                //style={{marginBlock: 'center'}} 
                size={200} 
                onClick={()=>{fileInput.current.click()}}/>
            
            <input 
                id="add-profimg"
                type="file"
                accept="image/*"
                name='profile_img'
                onChange={onChange}
                ref={fileInput}
                style={{
                    opacity: 0,
                }}/>
            
            </>
        </form>
    );
};