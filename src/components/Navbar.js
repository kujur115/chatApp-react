import { auth } from "../firebase";
import profile from "../images/art.jpg";
import { signOut } from "firebase/auth";
const Navbar = () => {
  return (
    <div className="navbar">
      <span className="logo">Messanger App</span>
      <div className="user">
        <img src={profile} alt="" />
        <span>Pratik</span>
        <button onClick={() => signOut(auth)}>logout</button>
      </div>
    </div>
  );
};
export default Navbar;
