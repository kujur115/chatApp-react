import React, { useContext, useEffect, useState } from "react";
import { Message } from ".";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Messages = () => {
  const [messages, setMessages] = useState([]); // State to store chat messages
  const { data } = useContext(ChatContext); // Get chat data from the ChatContext

  // useEffect to subscribe to changes in the chat messages
  useEffect(() => {
    // Function to handle snapshot changes
    const handleSnapshot = (snapshot) => {
      if (snapshot.exists()) {
        // If the chat document exists, update the messages state with the new data
        setMessages(snapshot.data().messages);
      } else {
        // If the chat document doesn't exist, clear the messages state
        setMessages([]);
      }
    };

    // Subscribe to changes in the chat document
    const unsubscribe = onSnapshot(
      doc(db, "chats", data.chatId),
      handleSnapshot
    );

    // Clean up the subscription when the component is unmounted
    return () => {
      unsubscribe();
    };
  }, [data.chatId]);

  return (
    <div className="messages">
      {/* Iterate through the chat messages and render each message using the Message component */}
      {messages.map((msg, i) => (
        <Message message={msg} key={i} />
      ))}
    </div>
  );
};

export default Messages;
