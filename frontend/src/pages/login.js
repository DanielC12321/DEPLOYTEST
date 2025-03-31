import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const demoCredentials = {
    cashier: { username: "cashier", password: "cashier123" },
    manager: { username: "manager", password: "manager123" },
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      username === demoCredentials.cashier.username &&
      password === demoCredentials.cashier.password
    ) {
      navigate("/cashier");
    } else if (
      username === demoCredentials.manager.username &&
      password === demoCredentials.manager.password
    ) {
      navigate("/manager");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  const handleCustomer = () => {
    navigate("/customer");
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
  
    try {
      // Send the token to the backend for verification
      const response = await fetch("http://localhost:8001/api/loginDB/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("User Info from Backend:", data);
  
        // Redirect the user based on their role
        if (data.user.role === "cashier") {
          navigate("/cashier");
        } else if (data.user.role === "manager") {
          navigate("/manager");
        } else {
          alert("Unknown role. Please contact support.");
        }
      } else {
        const errorData = await response.json();
        console.error("Error from backend:", errorData.error);
        alert("Login failed: " + errorData.error);
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  const handleGoogleFailure = () => {
    console.error("Google Login Failed");
    alert("Google Login Failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="container">
        <h1 className="title">ShareTea</h1>
        <div className="login-box">
          <h2 className="login-header">LOGIN</h2>
          <form onSubmit={handleLogin}>
            <div className="input-container">
              <input
                type="text"
                placeholder="Username"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <input
                type="password"
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="button">
              Login
            </button>
            <button onClick={handleCustomer} className="button">
              Continue as Customer
            </button>
          </form>
          <div className="google-login">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
            />
          </div>
          <p className="forgot-password">Forgot password?</p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
