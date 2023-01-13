import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {collection, getDocs, query, where, orderBy} from "@firebase/firestore";
import { updateProfile } from "firebase/auth";
import { async } from "@firebase/util";

export default ({ refreshUser,userObj}) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.newDisplayName);
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
    const onChange = (event) => {
      const {
        target : {value},
      } = event;
      setNewDisplayName(value);
    };
    
    const onSubmit = async(event) => {
      event.preventDefault();
      if(userObj.displayName !== newDisplayName){ //아무 변경사항 없으면 업데이트를 하지 않음
        await updateProfile(authService.currentUser,
         {displayName: newDisplayName}
          //console.log(userObj.updateProfile);
      )}; 
      refreshUser(); //react.js에 있는 profile 새로고침~
    }
    
    return (
      <div className="container">
        <form onSubmit={onSubmit} className="profileForm">
          <input 
            onChange={onChange}
            type="text" 
            autoFocus
            placeholder="Display name" 
            value={newDisplayName}
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

