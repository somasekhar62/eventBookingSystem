
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import Organiser from './Organiser';
import YourEvents from './YourEvents'; 
import CustomerHome from "./CustomerHome";
import ProtectedRoutes from "./ProtectedRoutes";
import MyEvents from "./MyEvents";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginForm />  } />
                <Route path="/signup" element={<SignupForm />} />
                <Route 
  path="/organiser" 
  element={
    <ProtectedRoutes allowedRoles={['organizer']}>
      <Organiser />
    </ProtectedRoutes>
  } 
/>

<Route 
  path="/your-events" 
  element={
    <ProtectedRoutes allowedRoles={['organizer']}>
      <YourEvents />
    </ProtectedRoutes>
  } 
/>

<Route 
  path="/customer" 
  element={
    <ProtectedRoutes allowedRoles={['customer']}>
      <CustomerHome />
    </ProtectedRoutes>
  } 
/>

<Route 
  path="/my-events" 
  element={
    <ProtectedRoutes allowedRoles={['customer']}>
      <MyEvents/>
    </ProtectedRoutes>
  } 
/>
 
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
        </Router>
    );
}

export default App;
