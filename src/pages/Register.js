import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import AddAvatar from "../images/addAvatar.png";

const Register = () => {
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    const form = e.target;
    const displayName = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const avatarFile = form.file.files[0];

    try {
      // Create a new user account with the provided email and password
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Upload the avatar image and get the download URL
      const avatarURL = await uploadAvatar(displayName, avatarFile);

      // Update the user's profile with the display name and avatar URL
      await updateUserProfile(response.user, displayName, avatarURL);

      // Create a new document in the 'users' collection with the user's information
      await createUserDocument(
        response.user.uid,
        displayName,
        email,
        avatarURL
      );

      // Create a new document in the 'userChats' collection for the user's chats
      await createUserChatsDocument(response.user.uid);

      setCreating(false);
      // Redirect the user to the home page after successful registration
      navigate("/");
    } catch (error) {
      setCreating(false);
      setError("Something went wrong. Please try again.");
      console.error("Error:", error);
    }
  };

  const uploadAvatar = async (displayName, file) => {
    if (!file) return null;

    // Create a reference to the storage location for the user's avatar image
    const storageRef = ref(storage, displayName);

    // Upload the avatar image and get the upload task snapshot
    const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);

    // Get the download URL of the uploaded avatar image
    return getDownloadURL(uploadTaskSnapshot.ref);
  };

  const updateUserProfile = async (user, displayName, avatarURL) => {
    // Update the user's profile with the display name and avatar URL
    await updateProfile(user, {
      displayName,
      photoURL: avatarURL,
    });
  };

  const createUserDocument = async (uid, displayName, email, avatarURL) => {
    // Create a new document in the 'users' collection with the user's information
    await setDoc(doc(db, "users", uid), {
      uid,
      displayName,
      email,
      photoURL: avatarURL,
    });
  };

  const createUserChatsDocument = async (uid) => {
    // Create a new document in the 'userChats' collection for the user's chats
    await setDoc(doc(db, "userChats", uid), {});
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="Logo">Messenger App</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" required />
          <input type="email" name="email" placeholder="Email" required />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <input
            type="file"
            id="file"
            name="file"
            style={{ display: "none" }}
          />
          <label htmlFor="file">
            <img src={AddAvatar} alt="" />
            <span>Add an avatar</span>
          </label>
          <button type="submit" disabled={creating}>
            {creating ? "Creating Account" : "Sign Up"}
          </button>
          {error && <span className="err">{error}</span>}
        </form>
        <p>
          Have an account? <Link to="/login">Login</Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default Register;
