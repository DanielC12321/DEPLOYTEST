import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './account.css';

function Account() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    role: '',
    id: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
    
    if (!userId || !userRole) {
      navigate('/login');
      return;
    }

    if (userRole === 'customer') {
      setUserInfo({
        name: 'Customer',
        email: '',
        role: 'customer',
        id: ''
      });
      setIsLoading(false);
      return;
    }
    
    // Fetch user information
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Determine which endpoint to use based on role
        const isManager = userRole === 'manager';
        const endpoint = `${apiUrl}/employee_credentials?id=${userId}&isManager=${isManager}`;
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          const userData = data[0];
          
          setUserInfo({
            name: userData.name || 'User',
            email: userData.email || 'No email provided',
            role: userRole,
            id: userId
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [apiUrl, navigate]);
  
  const handleLogout = () => {
    // Clear all user data from storage
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userRole');
    
    // Redirect to login page
    navigate('/login');
  };
  
  const handleDashboard = () => {
    // Navigate to the appropriate dashboard based on user role
    switch (userInfo.role) {
      case 'manager':
        navigate('/manager');
        break;
      case 'cashier':
        navigate('/cashier');
        break;
      default:
        navigate('/customer');
    }
  };
  
  if (isLoading) {
    return <div className="account-loading">Loading user information...</div>;
  }

  return (
    <div className="account-container">
      <div className="account-header">
        <img 
          src="https://franchise.sharetea.com.au/wp-content/uploads/2021/08/cropped-Favicon.png" 
          alt="ShareTea Logo" 
          className="account-logo"
        />
        <h1>My Account</h1>
      </div>
      
      <div className="account-card">
        <div className="account-profile">
          <div className="profile-image">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}&background=random`} 
              alt="Profile" 
            />
          </div>
          <div className="profile-details">
            <h2>{userInfo.name}</h2>
            <span className={`role-badge ${userInfo.role}`}>{userInfo.role}</span>
          </div>
        </div>
        
        <div className="account-info">
          <div className="info-item">
            <label>Email:</label>
            <span>{userInfo.email}</span>
          </div>
          <div className="info-item">
            <label>ID:</label>
            <span>{userInfo.id}</span>
          </div>
        </div>
        
        <div className="account-actions">
          <button className="account-button dashboard" onClick={handleDashboard}>
            Return to Dashboard
          </button>
          <button className="account-button logout" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;