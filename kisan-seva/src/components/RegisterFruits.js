import React, { useState } from 'react';
import { getFarmers, saveFarmers } from '../utils/localStorage';
import './RegisterFruits.css';

const RegisterFruits = () => {
  const [fruits, setFruits] = useState([{ category: '', price: '', quantity: '' }]);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const addFruit = () => {
    setFruits([...fruits, { category: '', price: '', quantity: '' }]);
  };

  const handleFruitChange = (index, field, value) => {
    const newFruits = [...fruits];
    newFruits[index][field] = value;
    setFruits(newFruits);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const farmers = getFarmers();
    const updatedFarmers = farmers.map(farmer => {
      if (farmer.userName === currentUser.userName) {
        return {
          ...farmer,
          fruits: [...farmer.fruits, ...fruits.map((fruit, index) => ({
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
    alert('Fruits registered successfully!');
    setFruits([{ category: '', price: '', quantity: '' }]);
  };

  return (
    <div className="register-fruits">
      <h3>Register Your Fruits</h3>
      <form onSubmit={handleSubmit}>
        {fruits.map((fruit, index) => (
          <div key={index} className="fruit-form">
            <select
              value={fruit.category}
              onChange={(e) => handleFruitChange(index, 'category', e.target.value)}
              required
            >
              <option value="">Select Fruit</option>
              <option value="Apple">Apple</option>
              <option value="Grapes">Grapes</option>
              <option value="Banana">Banana</option>
              <option value="Orange">Orange</option>
              <option value="Mango">Mango</option>
            </select>
            <input
              type="number"
              placeholder="Expected Price (₹)"
              value={fruit.price}
              onChange={(e) => handleFruitChange(index, 'price', e.target.value)}
              required
              min="1"
            />
            <input
              type="number"
              placeholder="Quantity (Kgs)"
              value={fruit.quantity}
              onChange={(e) => handleFruitChange(index, 'quantity', e.target.value)}
              required
              min="1"
            />
          </div>
        ))}
        <div className="button-group">
          <button type="button" onClick={addFruit} className="add-btn">
            + Add More Fruits
          </button>
          <button type="submit" className="submit-btn">
            Register Fruits
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterFruits;