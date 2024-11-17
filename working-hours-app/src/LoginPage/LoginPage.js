import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use navigate here

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error

    try {
      const response = await axios.post('http://localhost:5217/api/Auth/login', {
        Username: username,
        Password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle successful login (store JWT token)
      const token = response.data.token; 
      sessionStorage.setItem('jwt', token); // Store the token in sessionStorage.
      sessionStorage.setItem("ProfilePicture", response.data.profilePicturePath );
      sessionStorage.setItem("Username", username);
      sessionStorage.setItem("UserID", response.data.userID);

      navigate('/dashboard'); // Redirect to the dashboard
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="submit-button">Login</button>
        </form>

        {/* Error message display */}
        {error && <div className="error-message">{error}</div>}

        <div className="register-link">
          <span>Don't have an account? </span>
          <span className="register-text" onClick={() => window.location.href = '/register'}>
            Register here
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
