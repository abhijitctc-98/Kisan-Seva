import React, { useState } from 'react';
import RegisterFruits from './RegisterFruits';
import ApproveRequest from './ApproveRequest';
import './FarmerDashboard.css';

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('register');

  return (
    <div className="farmer-dashboard">
      <div className="dashboard-tabs">
        <button
          className={activeTab === 'register' ? 'active' : ''}
          onClick={() => setActiveTab('register')}
        >
          Register Fruits
        </button>
        <button
          className={activeTab === 'approve' ? 'active' : ''}
          onClick={() => setActiveTab('approve')}
        >
          Approve Request
        </button>
      </div>
      <div className="dashboard-content">
        {activeTab === 'register' ? <RegisterFruits /> : <ApproveRequest />}
      </div>
    </div>
  );
};

export default FarmerDashboard;