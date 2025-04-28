import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const demoCredentials = {
    cashier: { username: "cashier", password: "cashier123" },
    manager: { username: "manager", password: "manager123" },
  };
  // Update the handleLogin function in your Login component
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Call your new login endpoint
      const response = await fetch(`${apiUrl}/api/loginDB/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: username, // Using username field as email
          password: password 
        }),
      });
  
      // Handle API response
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        
        // Store user information in localStorage
        localStorage.setItem('userId', data.user.cashierid || data.user.managerid);
        localStorage.setItem('userRole', data.user.role);
        
        // Navigate based on role
        if (data.user.role === "cashier") {
          navigate("/cashier");
        } else if (data.user.role === "manager") {
          navigate("/manager");
        } else {
          alert("Unknown role. Please contact support.");
        }
      } else {
        // Handle unsuccessful login
        const errorData = await response.json();
        console.error("Login failed:", errorData.error);
        
        // Fall back to demo credentials if API login fails
        if (
          username === demoCredentials.cashier.username &&
          password === demoCredentials.cashier.password
        ) {
          localStorage.setItem('userId', '1');
          localStorage.setItem('userRole', 'cashier');
          navigate("/cashier");
        } else if (
          username === demoCredentials.manager.username &&
          password === demoCredentials.manager.password
        ) {
          localStorage.setItem('userId', '1');
          localStorage.setItem('userRole', 'manager');
          navigate("/manager");
        } else {
          alert(errorData.error || "Invalid credentials. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      
      // Fall back to demo credentials if API call fails
      if (
        username === demoCredentials.cashier.username &&
        password === demoCredentials.cashier.password
      ) {
        localStorage.setItem('userId', '1');
        localStorage.setItem('userRole', 'cashier');
        navigate("/cashier");
      } else if (
        username === demoCredentials.manager.username &&
        password === demoCredentials.manager.password
      ) {
        localStorage.setItem('userId', '1');
        localStorage.setItem('userRole', 'manager');
        navigate("/manager");
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  // Update the handleGoogleSuccess function
  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      // Send the token to the backend for verification
      const response = await fetch(`${apiUrl}/api/loginDB/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User Info from Backend:", data);

        // Store user info in localStorage
        localStorage.setItem('userId', data.user.cashierid || data.user.managerid);
        localStorage.setItem('userRole', data.user.role);

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

    // Update the handleCustomer function
    const handleCustomer = () => {
      // Store customer role in localStorage (no ID needed for customers)
      localStorage.setItem('userRole', 'customer');
      navigate("/customer");
    };

    const handleGoogleFailure = () => {
      console.error("Google Login Failed");
      alert("Google Login Failed. Please try again.");
    };
    const handleMenuBoard = () => {
      navigate("/menuboard");
    };
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="outer-container">
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
              <button onClick={handleMenuBoard} className="button">
                MenuBoard
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
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
