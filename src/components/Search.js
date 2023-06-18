import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const Search = () => {
  const [username, setUsername] = useState("");
  const [userfound, setUserFound] = useState(null);
  const [err, setErr] = useState(false);
  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };
  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      // console.log("Query:", q); // Debug statement
      const querSnapshot = await getDocs(q);
      // console.log("Query Snapshot:", querSnapshot); // Debug statement

      querSnapshot.forEach((doc) => {
        // console.log("Document Data:", doc.data()); // Debug statement
        setUserFound(doc.data());
      });
    } catch (error) {
      setErr(true);
      console.log("Error:", error);
    }
  };

  const handleSelect = () => {};

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="find a user"
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKey}
        />
      </div>
      {err && <span>User not found!</span>}
      {userfound && (
        <div className="userChat" onClick={handleSelect}>
          <img src={userfound.photoURL} alt={userfound.displayName} />
          <div className="userChatInfo">
            <span>{userfound.displayName}</span>
            <p>Hello</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default Search;
