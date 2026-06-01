import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  
  const [formData, setFormData] = useState({ customer_id: '', product_id: '', quantity: '' });
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [resOrders, resProducts, resCustomers] = await Promise.all([
        api.get('/orders'),
        api.get('/products'),
        api.get('/customers')
      ]);
      setOrders(resOrders.data);
      setProducts(resProducts.data);
      setCustomers(resCustomers.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/orders', {
        customer_id: parseInt(formData.customer_id),
        product_id: parseInt(formData.product_id),
        quantity: parseInt(formData.quantity)
      });
      setFormData({ customer_id: '', product_id: '', quantity: '' });
      fetchData(); // Refresh orders and product inventory
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      await api.delete(`/orders/${id}`);
      fetchData();
    }
  };

  return (
    <div>
      <div className="header-actions">
        <h1 className="page-title" style={{margin: 0}}>Manage Orders</h1>
      </div>

      <div className="card" style={{marginBottom: '2rem'}}>
        <h3>Create New Order</h3>
        <br />
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="form-label">Customer</label>
            <select className="form-control" name="customer_id" value={formData.customer_id} onChange={handleChange} required>
              <option value="">Select Customer</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Product</label>
            <select className="form-control" name="product_id" value={formData.product_id} onChange={handleChange} required>
              <option value="">Select Product</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity} - ${p.price})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input className="form-control" type="number" min="1" name="quantity" value={formData.quantity} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{gridColumn: '1 / -1'}}>
            <button type="submit" className="btn btn-primary">Place Order</button>
          </div>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customer_id}</td>
                <td>{o.product_id}</td>
                <td>{o.quantity}</td>
                <td>${o.total_amount.toFixed(2)}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(o.id)}>Cancel Order</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
