import Cam from "../images/cam.png";
import Add from "../images/add.png";
import More from "../images/more.png";
import { Input, Messages } from ".";
const Chat = () => {
  return (
    <div className="chat">
      <div className="chatInfo">
        <span>James</span>
        <div className="chatIcons">
          <img src={Cam} alt="cam" />
          <img src={Add} alt="add" />
          <img src={More} alt="more" />
        </div>
      </div>
      <Messages />
      <Input/>
    </div>
  );
};
export default Chat;
