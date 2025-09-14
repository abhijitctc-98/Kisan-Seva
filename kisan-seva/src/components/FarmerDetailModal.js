import React from 'react';
import './FarmerDetailModal.css';

const FarmerDetailModal = ({ farmer, onClose }) => {
  const totalFruits = farmer.fruits?.reduce((total, fruit) => total + fruit.quantity, 0) || 0;
  
  // Calculate percentage for each fruit for the chart
  const fruitsWithPercentage = farmer.fruits?.map(fruit => ({
    ...fruit,
    percentage: totalFruits > 0 ? (fruit.quantity / totalFruits) * 100 : 0
  })) || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Farmer Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="farmer-profile">
          <div className="profile-avatar">
            {farmer.fullName?.charAt(0) || farmer.userName?.charAt(0) || 'F'}
          </div>
          <div className="profile-info">
            <h3>{`${farmer.firstName} ${farmer.lastName}` || 'Unknown Farmer'}</h3>
            <p>@{farmer.userName}</p>
          </div>
        </div>
        
        <div className="fruits-summary">
          <div className="summary-card">
            <span className="summary-value">{farmer.fruits?.length || 0}</span>
            <span className="summary-label">Fruit Varieties</span>
          </div>
          <div className="summary-card">
            <span className="summary-value">{totalFruits} kg</span>
            <span className="summary-label">Total Quantity</span>
          </div>
          <div className="summary-card">
            <span className="summary-value">
              ₹{farmer.fruits?.reduce((max, fruit) => 
                Math.max(max, fruit.price), 0) || 0}
            </span>
            <span className="summary-label">Highest Price</span>
          </div>
        </div>
        
        <div className="fruits-section">
          <h3>Fruits Inventory</h3>
          
          {fruitsWithPercentage.length === 0 ? (
            <div className="no-fruits">
              <p>This farmer hasn't registered any fruits yet.</p>
            </div>
          ) : (
            <>
              <div className="distribution-chart">
                {fruitsWithPercentage.map(fruit => (
                  <div 
                    key={fruit.id} 
                    className="chart-bar"
                    style={{ width: `${fruit.percentage}%` }}
                    title={`${fruit.category}: ${fruit.quantity}kg (${fruit.percentage.toFixed(1)}%)`}
                  >
                    <span className="bar-label">{fruit.category}</span>
                  </div>
                ))}
              </div>
              
              <div className="fruits-list">
                {fruitsWithPercentage.map(fruit => (
                  <div key={fruit.id} className="fruit-item">
                    <span className="fruit-name">{fruit.category}</span>
                    <div className="fruit-details">
                      <span className="fruit-quantity">{fruit.quantity} kg</span>
                      <span className="fruit-price">₹{fruit.price}/kg</span>
                    </div>
                    <div className="fruit-percentage">
                      {fruit.percentage.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDetailModal;