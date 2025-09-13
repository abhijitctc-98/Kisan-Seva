import React, { useState, useEffect } from 'react';
import { getRequests, saveRequests, getFarmers, saveFarmers } from '../utils/localStorage';
import './ApproveRequest.css';

const ApproveRequest = () => {
  const [requests, setRequests] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    const allRequests = getRequests();
    const userRequests = allRequests.filter(req => 
      req.farmerUserName === currentUser.userName && req.status === 'pending'
    );
    setRequests(userRequests);
  }, [currentUser.userName]);

  const handleApprove = (requestId) => {
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
    alert('Request approved successfully!');
  };

  const handleReject = (requestId) => {
    const allRequests = getRequests();
    const updatedRequests = allRequests.map(req => {
      if (req.id === requestId) {
        return { ...req, status: 'rejected' };
      }
      return req;
    });
    saveRequests(updatedRequests);
    setRequests(requests.filter(req => req.id !== requestId));
    alert('Request rejected!');
  };

  return (
    <div className="approve-requests">
      <h3>Pending Purchase Requests</h3>
      {requests.length === 0 ? (
        <div className="no-requests">
          <p>No pending requests at the moment</p>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map(request => (
            <div key={request.id} className="request-card">
              <div className="request-info">
                <h4>Fruit: {request.fruitCategory}</h4>
                <p><strong>Quantity:</strong> {request.quantity} Kgs</p>
                <p><strong>Requested by:</strong> Admin</p>
                <p><strong>Date:</strong> {new Date(request.timestamp).toLocaleDateString()}</p>
              </div>
              <div className="request-actions">
                <button 
                  onClick={() => handleApprove(request.id)} 
                  className="approve-btn"
                >
                  ✓ Approve
                </button>
                <button 
                  onClick={() => handleReject(request.id)} 
                  className="reject-btn"
                >
                  ✗ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApproveRequest;