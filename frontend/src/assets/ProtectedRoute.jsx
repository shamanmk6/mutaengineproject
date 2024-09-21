import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/check", { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate("/");
        }
      })
      .catch((error) => {
        console.log("Error in token validation:", error);
        setIsAuthenticated(false);
        navigate("/");
      });
  }, [navigate]);

  if (isAuthenticated === null) {
    // While waiting for authentication check
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
