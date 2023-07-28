import { useContext } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { User } = useContext(AuthContext); // Get the authenticated user's data from AuthContext

  return (
    <div className="navbar">
      {/* App Logo */}
      <span className="logo">
        <i className="fa-solid fa-comment-dots"> Messenger App</i>
      </span>

      {/* User Profile */}
      <div className="user">
        {/* Display the user's profile image */}
        <img src={User.photoURL} alt="" />

        {/* Display the user's display name */}
        <span>{User.displayName}</span>

        {/* Sign-out button */}
        <button onClick={() => signOut(auth)}>
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
