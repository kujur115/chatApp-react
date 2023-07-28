import Cam from "../images/cam.png";
import Add from "../images/add.png";
import More from "../images/more.png";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Input, Messages } from ".";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      {/* Display chat user's display name */}
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>

        {/* Render chat action icons */}
        <div className="chatIcons">
          <img src={Cam} alt="cam" />
          <img src={Add} alt="add" />
          <img src={More} alt="more" />
        </div>
      </div>

      {/* Render Messages component */}
      <Messages />

      {/* Render Input component */}
      <Input />
    </div>
  );
};

export default Chat;
