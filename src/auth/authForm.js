
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Ensure that react-router-dom is installed and properly configured
import "./signup/styles.css";
import { toast } from "react-toastify";
const AuthForm = () => {
  const [activeTab, setActiveTab] = useState("login");

  // Login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Signup form states
  const [signupEmail, setSignupEmail] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState("");

  const navigate = useNavigate();

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setLoginError("");
    setSignupError("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
       
      });
console.log("login successful");
      if (!response.ok) {
        throw new Error("Login failed");
      }

      const result = await response.json();
      localStorage.setItem("token", result.token); // Store token in localStorage
      toast.success("Login successful! Go ahead !!.");
      navigate('/dashboard'); //change heree properly redirect to ur dashboard
    } catch (error) {
      setLoginError("Invalid credentials. Please try again.");
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError("");

    try {
      const response = await fetch("http://localhost:5000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupEmail,
          name: signupName,
          password: signupPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

     toast.success("Signup successful! Please login to continue.");
      handleTabSwitch("login"); // Switch to login tab after successful signup
    } catch (error) {
      setSignupError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="form-wrap">
      <div className="tabs">
        <h3
          className={activeTab === "signup" ? "signup-tab active" : "signup-tab"}
          onClick={() => handleTabSwitch("signup")}
        >
          Sign Up
        </h3>
        <h3
          className={activeTab === "login" ? "login-tab active" : "login-tab"}
          onClick={() => handleTabSwitch("login")}
        >
          Login
        </h3>
      </div>

      <div className="tabs-content">
        {activeTab === "login" && (
          <div id="login-tab-content" className="active">
            <form onSubmit={handleLoginSubmit}>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="input"
                placeholder="Email"
                required
              />
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="input"
                placeholder="Password"
                required
              />
              {loginError && <p className="error-message">{loginError}</p>}
              <input type="submit" className="button" value="Login" />
            </form>
          </div>
        )}

        {activeTab === "signup" && (
          <div id="signup-tab-content" className="active">
            <form onSubmit={handleSignupSubmit}>
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="input"
                placeholder="Email"
                required
              />
              <input
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="input"
                placeholder="Username"
                required
              />
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="input"
                placeholder="Password"
                required
              />
              {signupError && <p className="error-message">{signupError}</p>}
              <input type="submit" className="button" value="Sign Up" />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
