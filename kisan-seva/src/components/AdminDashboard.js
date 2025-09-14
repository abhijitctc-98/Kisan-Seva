import React, { useState } from 'react';
import Dashboard from './Dashboard';
import MakeRequest from './MakeRequest';
import RegisteredFarmers from './RegisteredFarmers';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage farmers, requests, and monitor system activity</p>
      </div>
      
      <div className="dashboard-tabs">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="tab-icon">📊</span>
          Dashboard
        </button>
        <button
          className={activeTab === 'makeRequest' ? 'active' : ''}
          onClick={() => setActiveTab('makeRequest')}
        >
          <span className="tab-icon">📝</span>
          Make Request
        </button>
        <button
          className={activeTab === 'registeredFarmers' ? 'active' : ''}
          onClick={() => setActiveTab('registeredFarmers')}
        >
          <span className="tab-icon">👨‍🌾</span>
          Registered Farmers
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'dashboard' ? <Dashboard /> : 
         activeTab === 'makeRequest' ? <MakeRequest /> : 
         <RegisteredFarmers />}
      </div>
    </div>
  );
};

export default AdminDashboard;