import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getFarmers } from '../utils/localStorage';
import './Dashboard.css';

const Dashboard = () => {
  const [fruitData, setFruitData] = useState([]);
  const [totalFarmers, setTotalFarmers] = useState(0);
  const [totalFruits, setTotalFruits] = useState(0);

  useEffect(() => {
    const farmers = getFarmers();
    const fruitStats = {};
    let totalFruitsCount = 0;

    setTotalFarmers(farmers.length);

    farmers.forEach(farmer => {
      farmer.fruits.forEach(fruit => {
        if (!fruitStats[fruit.category]) {
          fruitStats[fruit.category] = {
            totalQuantity: 0,
            totalValue: 0,
            count: 0
          };
        }
        fruitStats[fruit.category].totalQuantity += fruit.quantity;
        fruitStats[fruit.category].totalValue += fruit.price * fruit.quantity;
        fruitStats[fruit.category].count += 1;
        totalFruitsCount += fruit.quantity;
      });
    });

    setTotalFruits(totalFruitsCount);

    const data = Object.keys(fruitStats).map(fruit => ({
      name: fruit,
      quantity: fruitStats[fruit].totalQuantity,
      averagePrice: Math.round(fruitStats[fruit].totalValue / fruitStats[fruit].totalQuantity)
    }));

    setFruitData(data);
  }, []);

  return (
    <div className="dashboard">
      <h3>Fruit Inventory Overview</h3>
      
      <div className="stats-overview">
        <div className="stat-card">
          <h4>Total Farmers</h4>
          <p className="stat-number">{totalFarmers}</p>
        </div>
        <div className="stat-card">
          <h4>Total Fruits Stock (Kgs)</h4>
          <p className="stat-number">{totalFruits} </p>
        </div>
        <div className="stat-card">
          <h4>Fruit Varieties</h4>
          <p className="stat-number">{fruitData.length}</p>
        </div>
      </div>

      <div className="chart-container">
        <h4>Fruit Quantity and Average Price</h4>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={fruitData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'quantity' ? `${value} Kgs` : `₹${value}`,
                name === 'quantity' ? 'Total Quantity' : 'Avg Price/Kg'
              ]}
            />
            <Legend />
            <Bar dataKey="quantity" fill="#8884d8" name="Total Quantity" />
            <Bar dataKey="averagePrice" fill="#82ca9d" name="Average Price" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="data-table">
        <h4>Detailed Fruit Statistics</h4>
        <table>
          <thead>
            <tr>
              <th>Fruit</th>
              <th>Total Quantity (Kgs)</th>
              <th>Average Price (₹/Kg)</th>
            </tr>
          </thead>
          <tbody>
            {fruitData.map((fruit, index) => (
              <tr key={index}>
                <td>{fruit.name}</td>
                <td>{fruit.quantity}</td>
                <td>₹{fruit.averagePrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;