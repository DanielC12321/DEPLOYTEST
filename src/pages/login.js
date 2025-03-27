import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const demoCredentials = {
    cashier: { username: "cashier", password: "cashier123" },
    customer: { username: "customer", password: "customer123" },
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
      username === demoCredentials.customer.username &&
      password === demoCredentials.customer.password
    ) {
      navigate("/customer");
    } else if (
      username === demoCredentials.manager.username &&
      password === demoCredentials.manager.password
    ) {
      navigate("/manager");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
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
        </form>
        <p className="forgot-password">Forgot password?</p>
      </div>
    </div>
  );
}

export default Login;
