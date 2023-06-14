import Add from "../images/addAvatar.png";
import Attach from "../images/attach.png";
const Input = () => {
  return (
    <div className="input">
      <input type="text" placeholder="Type something" />
      <div className="send">
        <img src={Attach} alt="" />
        <input type="file" style={{ display: "none" }} id="file2" />
        <label htmlFor="file2">
          <img src={Add} alt="" />
        </label>
        <button>Send</button>
      </div>
    </div>
  );
};
export default Input;
