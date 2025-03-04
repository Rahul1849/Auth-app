import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import OtpVerification from "./components/OTPVerification";
import RegistrationForm from "./components/RegistrationForm";

import ResetPassword from "./components/ResetPassword";
import NewPassword from "./components/NewPassword";
import Home from "./components/Home"; // Import Home component

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/sign" element={<SignUp />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/register" element={<RegistrationForm />} />
        
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/newpassword" element={<NewPassword />} />
        <Route path="/home" element={<Home />} /> {/* Added Home Page Route */}
      </Routes>
    </Router>
  );
}

export default App;
