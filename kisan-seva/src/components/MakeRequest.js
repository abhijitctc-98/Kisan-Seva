import React, { useState, useEffect } from 'react';
import { getFarmers, getRequests, saveRequests } from '../utils/localStorage';
import './MakeRequest.css';

const MakeRequest = () => {
  const [formData, setFormData] = useState({
    fruitCategory: '',
    farmerUserName: '',
    quantity: ''
  });
  const [farmers, setFarmers] = useState([]);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [farmerDetails, setFarmerDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const farmersData = getFarmers();
    setFarmers(farmersData);
  }, []);

  const handleFruitChange = (e) => {
    const category = e.target.value;
    setFormData({ ...formData, fruitCategory: category, farmerUserName: '', quantity: '' });
    setAvailableQuantity(0);
    setFarmerDetails(null);
  };

  const handleFarmerChange = (e) => {
    const userName = e.target.value;
    const selectedFarmer = farmers.find(f => f.userName === userName);
    
    if (selectedFarmer && formData.fruitCategory) {
      const fruit = selectedFarmer.fruits.find(f => f.category === formData.fruitCategory);
      setAvailableQuantity(fruit ? fruit.quantity : 0);
      setFarmerDetails(selectedFarmer);
    } else {
      setFarmerDetails(null);
    }
    setFormData({ ...formData, farmerUserName: userName, quantity: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const quantity = parseInt(formData.quantity);
    
    if (quantity > availableQuantity) {
      alert(`Requested quantity exceeds available quantity (${availableQuantity} Kgs)`);
      setLoading(false);
      return;
    }

    if (quantity <= 0) {
      alert('Please enter a valid quantity');
      setLoading(false);
      return;
    }

    const requests = getRequests();
    const newRequest = {
      id: Date.now(),
      ...formData,
      quantity: quantity,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    requests.push(newRequest);
    saveRequests(requests);

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({ fruitCategory: '', farmerUserName: '', quantity: '' });
        setAvailableQuantity(0);
        setFarmerDetails(null);
        setShowSuccess(false);
      }, 2000);
    }, 2000);
  };

  const availableFarmers = farmers.filter(farmer => 
    farmer.fruits.some(fruit => fruit.category === formData.fruitCategory && fruit.quantity > 0)
  );

  return (
    <div className="make-request">
      <h3>Make Purchase Request</h3>
      
      {showSuccess && (
        <div className="success-message" style={{
          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
          color: 'white',
          padding: '1rem',
          borderRadius: '12px',
          textAlign: 'center',
          marginBottom: '1.5rem',
          fontWeight: '600',
          boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
        }}>
          ✅ Request submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-group">
          <label>Fruit Category</label>
          <select
            value={formData.fruitCategory}
            onChange={handleFruitChange}
            required
            style={{ animationDelay: '0.1s' }}
          >
            <option value="">Select Fruit Category</option>
            <option value="Apple">🍎 Apple</option>
            <option value="Grapes">🍇 Grapes</option>
            <option value="Banana">🍌 Banana</option>
            <option value="Orange">🍊 Orange</option>
            <option value="Mango">🥭 Mango</option>
          </select>
        </div>

        <div className="form-group">
          <label>Available Farmers</label>
          <select
            value={formData.farmerUserName}
            onChange={handleFarmerChange}
            required
            disabled={!formData.fruitCategory || availableFarmers.length === 0}
            style={{ animationDelay: '0.2s' }}
          >
            <option value="">Select Farmer</option>
            {availableFarmers.map((farmer, index) => (
              <option key={farmer.userName} value={farmer.userName}>
                👨‍🌾 {farmer.userName} ({farmer.firstName} {farmer.lastName})
              </option>
            ))}
          </select>
          {formData.fruitCategory && availableFarmers.length === 0 && (
            <p className="warning">
              ⚠️ No farmers available for {formData.fruitCategory}
            </p>
          )}
        </div>

        {farmerDetails && (
          <div className="farmer-info" style={{ animationDelay: '0.3s' }}>
            <h4>👨‍🌾 Farmer Details</h4>
            <p><strong>Name:</strong> {farmerDetails.firstName} {farmerDetails.lastName}</p>
            <p><strong>Mobile:</strong> {farmerDetails.mobile}</p>
            <p><strong>Country:</strong> {farmerDetails.country}</p>
            <p><strong>Available {formData.fruitCategory}:</strong> {availableQuantity} Kgs</p>
          </div>
        )}

        <div className="form-group">
          <label>Request Quantity (Kgs)</label>
          <input
            type="number"
            placeholder={`Enter quantity (Max: ${availableQuantity} Kgs)`}
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
            min="1"
            max={availableQuantity}
            disabled={!formData.farmerUserName}
            style={{ animationDelay: '0.4s' }}
          />
          {availableQuantity > 0 && (
            <p className="available-quantity">
              📦 Available: {availableQuantity} Kgs (Max: {availableQuantity} Kgs)
            </p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading || !formData.farmerUserName || !formData.quantity}
          className="submit-btn"
          style={{ animationDelay: '0.5s' }}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Processing Request...
            </>
          ) : (
            '🚀 Make Request'
          )}
        </button>

        {loading && (
          <div className="progress-bar">
            <div className="progress"></div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MakeRequest;