import { useContext, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [userfound, setUserFound] = useState(null);
  const [err, setErr] = useState(false);
  const { User } = useContext(AuthContext);
  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };
  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      // console.log("Query:", q); // Debug statement
      const querSnapshot = await getDocs(q);
      // console.log("Query Snapshot:", querSnapshot); // Debug statement

      querSnapshot.forEach((doc) => {
        console.log("Document Data:", doc.data()); // Debug statement
        setUserFound(doc.data());
      });
    } catch (error) {
      setErr(true);
      console.log("Error:", error);
    }
  };

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
    } catch (error) {
      console.log(error);
    }
    setUserFound(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="find a user"
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKey}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {userfound && (
        <div className="userChat" onClick={() => handleSelect(userfound)}>
          <img src={userfound.photoURL} alt={userfound.displayName} />
          <div className="userChatInfo">
            <span>{userfound.displayName}</span>
            <p>{userfound.lastMessage?.text}</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default Search;
