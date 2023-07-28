import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const AllUsers = (props) => {
  const [users, setUsers] = useState([]);
  const { User } = useContext(AuthContext);
  useEffect(() => {
    const getUsers = async () => {
      const allUsers = [];
      const docRef = collection(db, "users");
      const docSnap = await getDocs(docRef);
      docSnap.forEach((doc) => {
        if (User.uid !== doc.data().uid) allUsers.push(doc.data());
      });
      console.log("User", User);
      console.log("allUsers", allUsers);
      setUsers(allUsers);
    };
    getUsers();
  }, [User]);

  const handleSelect = async (userfound) => {
    const combinedId =
      User.uid > userfound.uid
        ? User.uid + userfound.uid
        : userfound.uid + User.uid;
    console.log("combinedId", combinedId);
    try {
      const resp = await getDoc(doc(db, "chats", combinedId));
      console.log("resp", resp);
      if (!resp.exists()) {
        await setDoc(doc(db, "chats", combinedId), {
          messages: [],
        });
        // console.log("chatsss", chatsss);
        await updateDoc(doc(db, "userChats", User.uid), {
          [combinedId + ".userInfo"]: {
            uid: userfound.uid,
            displayName: userfound.displayName,
            photoURL: userfound.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        // console.log("UserChatsss", UserChatsss);
        await updateDoc(doc(db, "userChats", userfound.uid), {
          [combinedId + ".userInfo"]: {
            uid: User.uid,
            displayName: User.displayName,
            photoURL: User.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        // console.log("chatsssUser", chatsssUser);
      }
      props.handleNewChat();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="AllUsers">
      {users.map((user, i) => (
        <div key={i} className="userChat" onClick={() => handleSelect(user)}>
          <img src={user.photoURL} alt={user.displayName} />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
            {user.lastMessage && <p>{user.lastMessage?.text}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};
export default AllUsers;
