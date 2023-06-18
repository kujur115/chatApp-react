import AddAvatar from "../images/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.info("upload progress", progress);
        },
        (error) => {
          setErr(true);
          console.log("Upload Error", error);
        },
        () => {
          console.log("Upload Complete");
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const handleUpdate = async () => {
              await updateProfile(response.user, {
                displayName,
                photoURL: downloadURL,
              });

              await setDoc(doc(db, "users", response.user.uid), {
                uid: response.user.uid,
                displayName,
                email,
                photoURL: downloadURL,
              });
              await setDoc(doc(db, "userChats", response.user.uid), {});
              navigate("/");
            };
            handleUpdate();
          });
        }
      );
    } catch (error) {
      setErr(true);
      console.log("error", error);
    }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="Logo">Messenger App</span>
        <span className="title">Register </span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <input type="file" id="file" style={{ display: "none" }} />
          <label htmlFor="file">
            <img src={AddAvatar} alt="" />
            <span>Add an avatar</span>
          </label>
          <button>Sign Up</button>
          {err && <span>Something went wrong!</span>}
        </form>
        <p>
          Have aa account? <Link to="/login">Login</Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default Register;
