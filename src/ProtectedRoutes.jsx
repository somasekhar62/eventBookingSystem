import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  console.log("token:", token);
console.log("user:", user);


  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not allowed → redirect to default page
    return <Navigate to={user.role === "organizer" ? "/organiser" : "/customer"} replace />;
  }

  return children;
};

export default ProtectedRoutes;
