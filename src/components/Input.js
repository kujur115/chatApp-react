import { useContext, useState } from "react";
import Add from "../images/addAvatar.png";
import Attach from "../images/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { User } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  // Function to handle sending messages
  const handleSend = async () => {
    if (img) {
      // Upload the image to Firebase Storage
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.info("upload progress", progress);
        },
        (error) => {
          console.log("Upload Error", error);
        },
        () => {
          // Image upload completed, get the download URL
          console.log("Upload Complete");
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            // Update the chat document in Firestore with the new image message
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: User.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      // If it's a text message, update the chat document in Firestore with the new message
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: User.uid,
          date: Timestamp.now(),
        }),
      });
    }

    // Update the userChats documents for both users with the last message and date
    await updateDoc(doc(db, "userChats", User.uid), {
      [data.chatId + ".lastMessage"]: {
        text: img ? "sent photo" : text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text: img ? "received photo" : text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    // Reset the input fields after sending the message
    setText("");
    setImg(null);
  };

  return (
    <div className="input">
      {/* Input field for typing the message */}
      <input
        type="text"
        placeholder="Type something"
        onChange={(e) => setText(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
        value={text}
      />
      <div className="send">
        {/* Attach image icon */}
        <img src={Attach} alt="" />

        {/* Input field for selecting image */}
        <input
          type="file"
          style={{ display: "none" }}
          id="file2"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file2">
          {/* Add image icon */}
          <img src={Add} alt="" />
        </label>

        {/* Button to send the message */}
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
