import { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { AllUsers } from ".";

const Chats = () => {
  const [chats, setChats] = useState({});
  const [newConv, setNewConv] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { User } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  // Fetch user chats from Firestore when the component mounts or when the User changes.
  useEffect(() => {
    const getChats = () => {
      if (!User.uid) return; // Do not proceed if the user is not authenticated.

      // Subscribe to changes in the userChats document for the current user.
      const unsub = onSnapshot(doc(db, "userChats", User.uid), (doc) => {
        setChats(doc.data());
      });

      // Unsubscribe from the snapshot listener when the component unmounts or when User changes.
      return () => {
        unsub();
      };
    };
    getChats();
  }, [User.uid]);

  // Handle user selection and dispatch the selected user to the ChatContext.
  const handleSelect = (user) => {
    dispatch({ type: "USER_CHANGE", payload: user });
    setSelectedUser(user);
  };

  // Handle the state for showing/hiding the AllUsers component.
  const handleNewChat = () => {
    setNewConv(!newConv);
  };

  // console.log("chats:", chats);

  return (
    <div className="chats">
      <div className="conversations">
        <i className="fa-solid fa-comments"> Conversations</i>
        <i
          className={`fa-solid pointer ${
            newConv ? "xmark fa-rectangle-xmark" : "fa-plus"
          }`}
          onClick={handleNewChat}
        ></i>
      </div>

      {/* Conditionally render AllUsers component when the newConv state is true */}
      {newConv && <AllUsers handleNewChat={handleNewChat} />}

      {/* Display user chats if available, sorted by date */}
      {chats &&
        Object.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat, index) => (
            <div
              className={`userChat ${
                selectedUser === chat[1].userInfo && "selected"
              }`}
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
