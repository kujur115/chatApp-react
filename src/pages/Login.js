import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  // Function to handle the login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Get the email and password from the form inputs
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      // Sign in the user using Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);

      // If login is successful, navigate to the home page
      navigate("/");
    } catch (error) {
      // If there's an error during login, display an error message
      setErr(true);
      console.log("Error:", error);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        {/* App logo */}
        <span className="Logo">Messenger App</span>
        <span className="title"> </span>

        {/* Login form */}
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" autoComplete="email" />
          <input type="password" placeholder="Password" autoComplete="current-password" />

          {/* Sign in button */}
          <button>Sign In</button>

          {/* Display error message if login fails */}
          {err && <span className="err">Something went wrong!</span>}
        </form>

        {/* Option to register if the user doesn't have an account */}
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
