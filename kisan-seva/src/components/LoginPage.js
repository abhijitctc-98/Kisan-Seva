import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFarmers, getAdmins } from '../utils/localStorage';
import './LoginPage.css';

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    userName: '',
    password: '',
    userType: 'farmer'
  });
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const { userName, password, userType } = loginData;

    if (userType === 'farmer') {
      const farmers = getFarmers();
      const farmer = farmers.find(f => f.userName === userName && f.password === password);
      if (farmer) {
        localStorage.setItem('currentUser', JSON.stringify({ ...farmer, type: 'farmer' }));
        navigate('/farmer-dashboard');
      } else {
        alert('Invalid credentials');
      }
    } else {
      const admins = getAdmins();
      const admin = admins.find(a => a.userName === userName && a.password === password);
      if (admin) {
        localStorage.setItem('currentUser', JSON.stringify({ ...admin, type: 'admin' }));
        navigate('/admin-dashboard');
      } else {
        alert('Invalid credentials');
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        <select
          value={loginData.userType}
          onChange={(e) => setLoginData({ ...loginData, userType: e.target.value })}
        >
          <option value="farmer">Farmer</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="text"
          placeholder="Username"
          value={loginData.userName}
          onChange={(e) => setLoginData({ ...loginData, userName: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
        {loginData.userType === 'farmer' && (
          <p>
            New Farmer? <span onClick={() => navigate('/register')}>Register here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPage;