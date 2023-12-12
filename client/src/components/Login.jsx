import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/login', {
        emailOrUsername,
        password,
      });
      console.log(response.data);
      if (response.data.token) {
        // Save token in local storage
        localStorage.setItem('token', response.data.token);
        console.log(response.data)
        if(response.data.role === 'admin'){
        // Navigate to home page
        navigate('/adminDashboard');}
        else if(response.data.role === 'user'){
          navigate('/Dashboard');
        }
        else{
          navigate('/OwnerDashboard');
        }
      }
    } catch (error) {
      console.error('Error logging in:', error.response.data);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label className="input-label">Email or Username:</label>
          <input type="text" value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} className="input-field" />
        </div>
        <div className="input-group">
          <label className="input-label">Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
        </div>
        <button type="submit" className="submit-button">Login</button>
      </form>

      <div className="signup-link">
        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </div>
      <div className="social-login">
        <a href="https://ubook.onrender.com/auth/google" className="google-login">Login with Google</a>
      </div>
      <div className="forgot-password">
        <a href="/forgot">Forgot password?</a>

      </div>
    </div>
  );
}

export default Login;
