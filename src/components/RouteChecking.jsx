import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children, isLoggedIn }) => {
  return isLoggedIn ? children : <Navigate to="/" />;
};

export const PublicRoute = ({ children, isLoggedIn }) => {
  return !isLoggedIn ? children : <Navigate to="/home" />;
};
