// RegisterFruits.js
import React, { useState } from 'react';
import { getFarmers, saveFarmers } from '../utils/localStorage';
import './RegisterFruits.css';

const RegisterFruits = () => {
  const [fruits, setFruits] = useState([{ category: '', price: '', quantity: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const addFruit = () => {
    setFruits([...fruits, { category: '', price: '', quantity: '' }]);
  };

  const removeFruit = (index) => {
    if (fruits.length === 1) return;
    const newFruits = [...fruits];
    newFruits.splice(index, 1);
    setFruits(newFruits);
  };

  const handleFruitChange = (index, field, value) => {
    const newFruits = [...fruits];
    newFruits[index][field] = value;
    setFruits(newFruits);
    
    // Clear errors when user makes changes
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const validateForm = () => {
    const newErrors = [];
    
    fruits.forEach((fruit, index) => {
      if (!fruit.category) {
        newErrors.push({ index, field: 'category', message: 'Please select a fruit' });
      }
      if (!fruit.price || fruit.price < 1) {
        newErrors.push({ index, field: 'price', message: 'Price must be at least ₹1' });
      }
      if (!fruit.quantity || fruit.quantity < 1) {
        newErrors.push({ index, field: 'quantity', message: 'Quantity must be at least 1kg' });
      }
    });
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const farmers = getFarmers();
      const updatedFarmers = farmers.map(farmer => {
        if (farmer.userName === currentUser.userName) {
          return {
            ...farmer,
            fruits: [...(farmer.fruits || []), ...fruits.map((fruit, index) => ({
              id: Date.now() + index,
              ...fruit,
              price: parseInt(fruit.price),
              quantity: parseInt(fruit.quantity)
            }))]
          };
        }
        return farmer;
      });
      
      saveFarmers(updatedFarmers);
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFruits([{ category: '', price: '', quantity: '' }]);
        setShowSuccess(false);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="register-fruits-container">
      <div className="register-fruits">
        <div className="form-header">
          <h2>Register Your Fruits</h2>
          <p>Add the fruits you want to sell with their expected price and quantity</p>
        </div>
        
        {showSuccess && (
          <div className="success-message">
            <span className="success-icon">✓</span>
            Fruits registered successfully!
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {fruits.map((fruit, index) => {
            const fruitErrors = errors.filter(error => error.index === index);
            
            return (
              <div key={index} className={`fruit-form ${fruitErrors.length > 0 ? 'has-error' : ''}`}>
                {fruits.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-fruit-btn"
                    onClick={() => removeFruit(index)}
                    aria-label="Remove fruit"
                  >
                    ×
                  </button>
                )}
                
                <div className="form-group">
                  <select
                    value={fruit.category}
                    onChange={(e) => handleFruitChange(index, 'category', e.target.value)}
                    required
                    className={fruitErrors.some(e => e.field === 'category') ? 'error' : ''}
                  >
                    <option value="">Select Fruit</option>
                    <option value="Apple">Apple</option>
                    <option value="Grapes">Grapes</option>
                    <option value="Banana">Banana</option>
                    <option value="Orange">Orange</option>
                    <option value="Mango">Mango</option>
                  </select>
                  {fruitErrors.some(e => e.field === 'category') && (
                    <span className="error-message">
                      {fruitErrors.find(e => e.field === 'category')?.message}
                    </span>
                  )}
                </div>
                
                <div className="form-group">
                  <div className="input-with-symbol">
                    <input
                      type="number"
                      placeholder="Expected Price"
                      value={fruit.price}
                      onChange={(e) => handleFruitChange(index, 'price', e.target.value)}
                      required
                      min="1"
                      className={fruitErrors.some(e => e.field === 'price') ? 'error' : ''}
                    />
                    <span className="input-symbol">₹</span>
                  </div>
                  {fruitErrors.some(e => e.field === 'price') && (
                    <span className="error-message">
                      {fruitErrors.find(e => e.field === 'price')?.message}
                    </span>
                  )}
                </div>
                
                <div className="form-group">
                  <div className="input-with-symbol">
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={fruit.quantity}
                      onChange={(e) => handleFruitChange(index, 'quantity', e.target.value)}
                      required
                      min="1"
                      className={fruitErrors.some(e => e.field === 'quantity') ? 'error' : ''}
                    />
                    <span className="input-symbol">kg</span>
                  </div>
                  {fruitErrors.some(e => e.field === 'quantity') && (
                    <span className="error-message">
                      {fruitErrors.find(e => e.field === 'quantity')?.message}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          
          <div className="button-group">
            <button 
              type="button" 
              onClick={addFruit} 
              className="add-btn"
              disabled={isSubmitting}
            >
              <span className="btn-icon">+</span>
              Add More Fruits
            </button>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Registering...
                </>
              ) : (
                'Register Fruits'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterFruits;