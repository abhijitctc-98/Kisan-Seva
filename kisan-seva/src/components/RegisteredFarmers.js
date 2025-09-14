import React, { useState, useEffect } from 'react';
import { getFarmers } from '../utils/localStorage';
import FarmerDetailModal from './FarmerDetailModal';
import './RegisteredFarmers.css';

const RegisteredFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const farmersData = getFarmers();
      setFarmers(farmersData);
      setFilteredFarmers(farmersData);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let results = farmers;
    if (searchTerm) {
      results = farmers.filter(farmer => 
        farmer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.fruits?.some(fruit => 
          fruit.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      results.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredFarmers(results);
  }, [searchTerm, farmers, sortConfig]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleFarmerClick = (farmer) => {
    setSelectedFarmer(farmer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFarmer(null);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  const getTotalFruits = (farmer) => {
    return farmer.fruits?.reduce((total, fruit) => total + fruit.quantity, 0) || 0;
  };

  const getFruitVarieties = (farmer) => {
    return farmer.fruits?.length || 0;
  };

  if (isLoading) {
    return (
      <div className="farmers-loading">
        <div className="loading-spinner"></div>
        <p>Loading farmers data...</p>
      </div>
    );
  }

  return (
    <div className="registered-farmers">
      <div className="farmers-header">
        <h2>Registered Farmers</h2>
        <p>Manage and view details of all registered farmers</p>
      </div>

      <div className="farmers-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search farmers or fruits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="results-count">
          {filteredFarmers.length} {filteredFarmers.length === 1 ? 'farmer' : 'farmers'} found
        </div>
      </div>

      {filteredFarmers.length === 0 ? (
        <div className="no-farmers">
          <div className="no-farmers-icon">👨‍🌾</div>
          <h3>No farmers found</h3>
          <p>Try adjusting your search or check back later</p>
        </div>
      ) : (
        <div className="farmers-table-container">
          <table className="farmers-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('fullName')}>
                  Farmer {getSortIndicator('fullName')}
                </th>
                <th onClick={() => handleSort('userName')}>
                  Username {getSortIndicator('userName')}
                </th>
                <th onClick={() => handleSort('fruits')}>
                  Fruit Varieties {getSortIndicator('fruits')}
                </th>
                <th>Total Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFarmers.map(farmer => (
                <tr 
                  key={farmer.userName} 
                  className="farmer-row"
                  onClick={() => handleFarmerClick(farmer)}
                >
                  <td>
                    <div className="farmer-info">
                      <span className="farmer-avatar">
                        {farmer.fullName?.charAt(0) || farmer.userName?.charAt(0) || 'F'}
                      </span>
                      <span className="farmer-name">
                        {`${farmer.firstName} ${farmer.lastName}` || 'Unknown Farmer'}
                      </span>
                    </div>
                  </td>
                  <td>@{farmer.userName}</td>
                  <td>
                    <span className="fruit-varieties">
                      {getFruitVarieties(farmer)} varieties
                    </span>
                  </td>
                  <td>
                    <span className="total-quantity">
                      {getTotalFruits(farmer)} kg
                    </span>
                  </td>
                  <td>
                    <button 
                      className="view-details-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFarmerClick(farmer);
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selectedFarmer && (
        <FarmerDetailModal 
          farmer={selectedFarmer} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default RegisteredFarmers;