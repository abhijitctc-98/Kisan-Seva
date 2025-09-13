import React, { useState } from 'react';
import Dashboard from './Dashboard';
import MakeRequest from './MakeRequest';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="admin-dashboard">
      <div className="dashboard-tabs">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={activeTab === 'makeRequest' ? 'active' : ''}
          onClick={() => setActiveTab('makeRequest')}
        >
          Make Request
        </button>
      </div>
      <div className="dashboard-content">
        {activeTab === 'dashboard' ? <Dashboard /> : <MakeRequest />}
      </div>
    </div>
  );
};

export default AdminDashboard;