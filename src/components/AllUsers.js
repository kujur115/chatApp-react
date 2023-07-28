import {
  collection,
  doc,
  getDocs,
  getDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const AllUsers = (props) => {
  const [users, setUsers] = useState([]);
  const { User } = useContext(AuthContext);

  useEffect(() => {
    // Fetch all users from Firestore except the current user
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

  // Handle user selection and chat creation
  const handleSelect = async (userfound) => {
    // Generate a unique chat ID based on user IDs for the current user and the selected user
    const combinedId =
      User.uid > userfound.uid
        ? User.uid + userfound.uid
        : userfound.uid + User.uid;
    console.log("combinedId", combinedId);

    try {
      // Check if the chat already exists
      const chatRef = doc(db, "chats", combinedId);
      const chatSnapshot = await getDoc(chatRef);

      if (!chatSnapshot.exists()) {
        // If the chat doesn't exist, create a new chat document and update userChats for both users
        const batch = writeBatch(db);

        // Create the chat document with an empty messages array
        batch.set(chatRef, { messages: [] });

        // Update the userChats for the current user
        batch.update(doc(db, "userChats", User.uid), {
          [combinedId]: {
            userInfo: {
              uid: userfound.uid,
              displayName: userfound.displayName,
              photoURL: userfound.photoURL,
            },
            date: serverTimestamp(),
          },
        });

        // Update the userChats for the selected user
        batch.update(doc(db, "userChats", userfound.uid), {
          [combinedId]: {
            userInfo: {
              uid: User.uid,
              displayName: User.displayName,
              photoURL: User.photoURL,
            },
            date: serverTimestamp(),
          },
        });

        // Commit all the batched writes together for atomicity
        await batch.commit();
      }
      props.handleNewChat();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="AllUsers">
      {/* Render all users */}
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
