import React from "react";
import { Link, useNavigate } from "react-router-dom"; 

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");  
    navigate("/login");  
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center text-white">
        <div className="text-xl font-bold">Event Manager</div>
        <div className="space-x-4">
          <Link
            to="/organiser"
            className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
          >
            Organise Event
          </Link>
          <Link
            to="/your-events"
            className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
          >
            Your Events
          </Link>
          <button
  onClick={handleLogout}
  className="bg-red-700 px-3 py-2 rounded-md text-sm font-medium">
  Logout
</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
