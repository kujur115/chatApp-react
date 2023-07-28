import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { User } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  // Use useRef to get a reference to the DOM element of the message
  const ref = useRef();

  // Scroll the message into view when a new message is received or sent
  console.log(message);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const time = (sec) => {
    const currentTime = new Date().getTime() / 1000; // Convert current time to seconds
    const messageTime = sec; // Already in seconds, taken from message.date.seconds

    const timeDiff = Math.round(currentTime - messageTime);

    if (timeDiff < 60) {
      return "just now";
    } else if (timeDiff < 3600) {
      const minutes = Math.floor(timeDiff / 60);
      return `${minutes} min ago`;
    } else if (timeDiff < 86400) {
      const hours = Math.floor(timeDiff / 3600);
      return `${hours} hrs ago`;
    } else {
      const days = Math.floor(timeDiff / 86400);
      return `${days} days ago`;
    }
  };

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === User.uid && "owner"}`}
    >
      <div className="messageInfo">
        {/* Display the profile image of the message sender */}
        <img
          src={
            message.senderId === User.uid ? User.photoURL : data.user.photoURL
          }
          alt=""
        />
        <span>{time(message.date.seconds)}</span>
        {/* Replace this timestamp with the actual timestamp */}
      </div>
      <div className="messageContent">
        {/* Display the text message if available */}
        {message.text && <p>{message.text}</p>}

        {/* Display the image message if available */}
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
