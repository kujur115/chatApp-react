import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setErr(true);
      console.log("error", error);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="Logo">Messenger App</span>
        <span className="title"> </span>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" autoComplete="" />
          <input type="password" placeholder="Password" autoComplete="" />

          <button>Sign In</button>
          {err && <span>Something went wrong!</span>}
        </form>
        <p>
          Don't have an account?<Link to="/register">Register</Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default Login;
