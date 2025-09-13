// ApproveRequest.js
import React, { useState, useEffect } from 'react';
import { getRequests, saveRequests, getFarmers, saveFarmers } from '../utils/localStorage';
import './ApproveRequest.css';

const ApproveRequest = () => {
  const [requests, setRequests] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionResult, setActionResult] = useState({ show: false, message: '', type: '' });
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    const allRequests = getRequests();
    const userRequests = allRequests.filter(req => 
      req.farmerUserName === currentUser.userName && req.status === 'pending'
    );
    setRequests(userRequests);
  }, [currentUser.userName]);

  const showNotification = (message, type) => {
    setActionResult({ show: true, message, type });
    setTimeout(() => {
      setActionResult({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleApprove = async (requestId) => {
    setIsProcessing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const allRequests = getRequests();
      const farmers = getFarmers();
      
      const updatedRequests = allRequests.map(req => {
        if (req.id === requestId) {
          return { ...req, status: 'approved' };
        }
        return req;
      });

      const updatedFarmers = farmers.map(farmer => {
        if (farmer.userName === currentUser.userName) {
          const request = allRequests.find(req => req.id === requestId);
          const updatedFruits = farmer.fruits.map(fruit => {
            if (fruit.category === request.fruitCategory) {
              return {
                ...fruit,
                quantity: fruit.quantity - request.quantity
              };
            }
            return fruit;
          });
          return { ...farmer, fruits: updatedFruits };
        }
        return farmer;
      });

      saveRequests(updatedRequests);
      saveFarmers(updatedFarmers);
      setRequests(requests.filter(req => req.id !== requestId));
      setIsProcessing(false);
      showNotification('Request approved successfully!', 'success');
    }, 800);
  };

  const handleReject = async (requestId) => {
    setIsProcessing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const allRequests = getRequests();
      const updatedRequests = allRequests.map(req => {
        if (req.id === requestId) {
          return { ...req, status: 'rejected' };
        }
        return req;
      });
      saveRequests(updatedRequests);
      setRequests(requests.filter(req => req.id !== requestId));
      setIsProcessing(false);
      showNotification('Request rejected!', 'info');
    }, 800);
  };

  const getFruitIcon = (fruitName) => {
    const fruitIcons = {
      'Apple': '🍎',
      'Grapes': '🍇',
      'Banana': '🍌',
      'Orange': '🍊',
      'Mango': '🥭'
    };
    return fruitIcons[fruitName] || '🍊';
  };

  return (
    <div className="approve-requests-container">
      <div className="approve-requests">
        <div className="requests-header">
          <h2>Purchase Requests</h2>
          <p>Review and manage purchase requests for your fruits</p>
        </div>

        {actionResult.show && (
          <div className={`action-notification ${actionResult.type}`}>
            <span className="notification-icon">
              {actionResult.type === 'success' ? '✓' : 'ℹ'}
            </span>
            {actionResult.message}
          </div>
        )}

        {requests.length === 0 ? (
          <div className="no-requests">
            <div className="no-requests-icon">📋</div>
            <h3>No pending requests</h3>
            <p>You're all caught up! Check back later for new purchase requests.</p>
          </div>
        ) : (
          <div className="requests-grid">
            {requests.map(request => (
              <div key={request.id} className="request-card">
                <div className="card-header">
                  <span className="fruit-icon">{getFruitIcon(request.fruitCategory)}</span>
                  <h3>{request.fruitCategory}</h3>
                  <span className="request-badge pending">Pending</span>
                </div>
                
                <div className="request-details">
                  <div className="detail-item">
                    <span className="detail-label">Quantity:</span>
                    <span className="detail-value">{request.quantity} Kgs</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Requested by:</span>
                    <span className="detail-value">Admin</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">
                      {new Date(request.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="request-actions">
                  <button 
                    onClick={() => handleApprove(request.id)} 
                    className="approve-btn"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="btn-spinner"></span>
                    ) : (
                      <>
                        <span className="btn-icon">✓</span>
                        Approve
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => handleReject(request.id)} 
                    className="reject-btn"
                    disabled={isProcessing}
                  >
                    <span className="btn-icon">✗</span>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveRequest;