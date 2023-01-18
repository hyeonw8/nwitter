import { authService, dbService, storageService } from "fbase";
import React, { useEffect, useReducer, useState } from "react";
import { useHistory } from "react-router-dom";
import {collection, getDocs, query, where, orderBy} from "@firebase/firestore";
import { updateProfile } from "firebase/auth";
import { async } from "@firebase/util";
import { getDownloadURL } from "firebase/storage";

const Profile = ({ refreshUser,userObj}) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.newDisplayName);
    const [newPhoto, setNewPhoto] = useState(userObj.photoURL);
    const onLogOutClick = () => {
      authService.signOut();
      history.push("/");
    };
    /* const getMyNweets = async() => {
      //프로필 화면에게 우리가 누군지 알려줘야함 -> 이걸 위해 router.js(라우터는 우리에게 userObj를 주고있음)에
      //홈에 userObj를 prop을 준것처럼 동일하게 프로필에도 userObj를 prop을 줌
      //이제 어떤 유저의 Nweet을 불러와야 할 지에 대해 알게됨
      const nweets = query(collection(dbService, "nweets"),
      where("creatorId","==", `${userObj.uid}`),
      orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(nweets);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
    };
    useEffect(() => {
      getMyNweets();
    }, []) */
    const onChangName = (event) => {
      const {
        target : {value},
      } = event;
      setNewDisplayName(value);
    };
    
    const onChangePhoto = e => {
      const {target : {value}} = e;
      const photo = files[0];
      const reader = new FileReader();
      reader.onloadend = (finishedEvent) => {
        const {currentTarget : {result} }  = finishedEvent;
            setnewPhoto(result); //onloadend에 finishEvent의 result를 setAttachment로 설정
        }
        reader.readAsDataURL(photo);
      }
    
    const onSubmit = async(event) => {
      event.preventDefault();
      let photoURL = userObj.photoURL;
      if(newPhoto !== userObj.photoURL) {
        const photoRef = ref(storageService,`${userObj.uid}/profile/photo` );
        const response = await uploadString(photoRef, "data_url");
        photoURL = await getDownloadURL(response.ref);
      }
      if(userObj.displayName !== newDisplayName){ //아무 변경사항 없으면 업데이트를 하지 않음
        await updateProfile(authService.currentUser,
        {displayName: newDisplayName, }
          //console.log(userObj.updateProfile);
      )}; 
      refreshUser(); //react.js에 있는 profile 새로고침~
    }
    const onClearPhoto  = () => {
      setNewPhoto("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
    };
  
    
    return (
      <div className="container">
        <form onSubmit={onSubmit} className="profileForm">
        <>
        {upimage && (
                <div>
                    <Avatar 
                        className="avatar_img"
                        src={newPhoto} 
                        size={200} 
                        onClick={()=>{fileInput.current.click()}}/>
                    <div 
                        className="factoryForm__clear" 
                        onClick={onClearPhoto}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )} 
          </>
            <input 
                id="add-profimg"
                type="file"
                accept="image/*"
                name='profile_img'
                onChange={onChangePhoto}
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
          <input 
            onChange={onChangName}
            type="text" 
            autoFocus
            placeholder="Display name" 
            value={newDisplayName || ''}
            className="formInput"
          />
          <input 
            type="submit" 
            value="Update Profile"
            className="formBtn"
            style={{
              marignTop: 10,
            }} 
          />
        </form>
        <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
          Log Out
        </span>
      </div>
    );
  };

  export default Profile;
