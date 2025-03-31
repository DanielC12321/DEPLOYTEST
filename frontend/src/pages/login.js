import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // To decode the JWT token
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

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("Google Login Success:", decoded);
    // Redirect to a specific page after successful Google login
    navigate("/customer");
  };

  const handleGoogleFailure = () => {
    console.error("Google Login Failed");
    alert("Google Login Failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId="241279205661-q419d1qfof7thoo781vdd359575ctlkb.apps.googleusercontent.com">
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
            <button type="submit" className="login-button">
              LOGIN
            </button>
            <button onClick={handleCustomer} className="customer-button">
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
