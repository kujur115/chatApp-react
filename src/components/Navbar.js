import { useContext } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { User } = useContext(AuthContext);
  return (
    <div className="navbar">
      <span className="logo">Messanger App</span>
      <div className="user">
        <img src={User.photoURL} alt="" />
        <span>{User.displayName}</span>
        <button onClick={() => signOut(auth)}>logout</button>
      </div>
    </div>
  );
};
export default Navbar;
