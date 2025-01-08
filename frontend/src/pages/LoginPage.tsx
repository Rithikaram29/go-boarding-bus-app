import React from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import NavBar from "../components/NavBar";
import "./loginPage.css"

const LoginPage: React.FC = () => {
  return (
    <div>
      <NavBar />
      <div className="content">
        <Signup />
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
