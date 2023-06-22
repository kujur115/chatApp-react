// import profile from "../images/art.jpg";
import { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
const Chats = () => {
  const [chats, setChats] = useState({});
  const { User } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", User.uid), (doc) => {
        // console.log("current data", doc.data());
        setChats(doc.data());
      });
      return () => {
        unsub();
      };
    };
    User.uid && getChats();
  }, [User.uid]);
  const handleSelect = (u) => {
    dispatch({ type: "USER_CHANGE", payload: u });
  };
  console.log("chats:", chats);
  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat, index) => (
          <div
            className="userChat"
            key={index}
            onClick={() => handleSelect(chat[1].userInfo)}
          >
            <img src={chat[1].userInfo.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{chat[1].userInfo.displayName}</span>
              <p>{chat[1].lastMessage?.text}</p>
            </div>
          </div>
        ))}
    </div>
  );
};
export default Chats;
