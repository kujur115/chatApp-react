import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";

// Context
export const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    const unsub=onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log(user);
    });

    return ()=>{
        unsub();
    }
  });

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
