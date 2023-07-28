import { useContext } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { User } = useContext(AuthContext);
  return (
    <div className="navbar">
      <span className="logo">
        <i className="fa-solid fa-comment-dots"> Messanger App</i>
      </span>
      <div className="user">
        <img src={User.photoURL} alt="" />
        <span>{User.displayName}</span>
        <button onClick={() => signOut(auth)}>
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </div>
  );
};
export default Navbar;
