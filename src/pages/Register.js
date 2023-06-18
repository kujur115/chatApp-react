import AddAvatar from "../images/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
// import { useState } from "react";

const Register = () => {
  // const [upload, setUpload] = useState(0);
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
        },
        (error) => {
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
            };
            handleUpdate();
          });
        }
      );
    } catch (error) {
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
        </form>
        <p>Have aa account? Login</p>
      </div>
    </div>
  );
};

export default Register;
