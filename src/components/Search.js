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

  // Function to handle pressing the Enter key in the search input
  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  // Function to handle the user search
  const handleSearch = async () => {
    // Create a query to find the user by display name
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);

      // If the user is found, update the state with the found user data
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setUserFound(userDoc.data());
        setErr(false);
      } else {
        // If the user is not found, display an error message
        setUserFound(null);
        setErr(true);
      }
    } catch (error) {
      setErr(true);
      console.log("Error:", error);
    }
  };

  // Function to handle selecting the found user and initiating a chat
  const handleSelect = async (userfound) => {
    const combinedId =
      User.uid > userfound.uid
        ? User.uid + userfound.uid
        : userfound.uid + User.uid;

    try {
      // Check if the chat already exists
      const chatDoc = await getDoc(doc(db, "chats", combinedId));

      if (!chatDoc.exists()) {
        // If the chat does not exist, create it with empty messages
        await setDoc(doc(db, "chats", combinedId), {
          messages: [],
        });

        // Update the userChats document for the authenticated user with the new chat
        await updateDoc(doc(db, "userChats", User.uid), {
          [combinedId + ".userInfo"]: {
            uid: userfound.uid,
            displayName: userfound.displayName,
            photoURL: userfound.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        // Update the userChats document for the found user with the new chat
        await updateDoc(doc(db, "userChats", userfound.uid), {
          [combinedId + ".userInfo"]: {
            uid: User.uid,
            displayName: User.displayName,
            photoURL: User.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error);
    }

    // Clear the search input and reset the found user state
    setUserFound(null);
    setUsername("");
  };

  return (
    <div className="search">
      {/* Search input */}
      <div className="searchForm">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input
          type="text"
          placeholder="find a user"
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKey}
          value={username}
        />
      </div>

      {/* Error message when the user is not found */}
      {err && <span>User not found!</span>}

      {/* Display the found user if available */}
      {userfound && (
        <div className="searchedUser">
          <div className="userChat" onClick={() => handleSelect(userfound)}>
            <img src={userfound.photoURL} alt={userfound.displayName} />
            <div className="userChatInfo">
              <span>{userfound.displayName}</span>
              <p>{userfound.lastMessage?.text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
