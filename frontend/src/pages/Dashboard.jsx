import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    orders: 0,
    lowStock: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resProducts, resCustomers, resOrders] = await Promise.all([
          api.get('/products'),
          api.get('/customers'),
          api.get('/orders')
        ]);
        
        const products = resProducts.data;
        const lowStock = products.filter(p => p.quantity < 10).length;

        setStats({
          products: products.length,
          customers: resCustomers.data.length,
          orders: resOrders.data.length,
          lowStock
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="page-title">Dashboard Summary</h1>
      
      <div className="dashboard-grid">
        <div className="card stat-card">
          <h3>Total Products</h3>
          <p>{stats.products}</p>
        </div>
        <div className="card stat-card">
          <h3>Total Customers</h3>
          <p>{stats.customers}</p>
        </div>
        <div className="card stat-card">
          <h3>Total Orders</h3>
          <p>{stats.orders}</p>
        </div>
        <div className="card stat-card">
          <h3 style={{color: 'var(--danger-color)'}}>Low Stock Items</h3>
          <p style={{color: 'var(--danger-color)'}}>{stats.lowStock}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
