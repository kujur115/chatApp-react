import { useContext } from "react";
import { Home, Login, Register } from "./pages";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { User } = useContext(AuthContext);
  const ProtectedRoute = ({ children }) => {
    if (!User) {
      return <Navigate to="/login" />;
    }

    return <>{children}</>;
  };
  return (
    <BrowserRouter>
      <Routes path="/">
        <Route
          index
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
