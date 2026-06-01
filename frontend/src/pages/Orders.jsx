import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShoppingBag } from 'lucide-react';

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

  const getCustomerName = (id) => customers.find(c => c.id === id)?.full_name || 'Unknown';
  const getProductName = (id) => products.find(p => p.id === id)?.name || 'Unknown';

  return (
    <div className="animate-reveal">
      <div className="header-actions">
        <h1 className="page-title" style={{margin: 0}}>Order Management</h1>
      </div>

      <div className="card" style={{marginBottom: '3rem'}}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Create Fulfillment Order</h3>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="form-label">Client</label>
            <select className="form-control" name="customer_id" value={formData.customer_id} onChange={handleChange} required>
              <option value="" disabled>Select Client...</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Product</label>
            <select className="form-control" name="product_id" value={formData.product_id} onChange={handleChange} required>
              <option value="" disabled>Select Product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity} - ${p.price})</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">Quantity</label>
            <input className="form-control" type="number" min="1" name="quantity" placeholder="1" value={formData.quantity} onChange={handleChange} required style={{ width: '50%' }} />
          </div>
          <div className="form-group" style={{gridColumn: '1 / -1', marginTop: '1rem'}}>
            <button type="submit" className="btn btn-primary" style={{ width: 'max-content' }}>
              <ShoppingBag size={18} />
              Process Order
            </button>
          </div>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Client</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Total Amount</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>ORD-{o.id.toString().padStart(4, '0')}</td>
                <td style={{ fontWeight: 500 }}>{getCustomerName(o.customer_id)}</td>
                <td>{getProductName(o.product_id)}</td>
                <td>{o.quantity}</td>
                <td style={{ fontWeight: 600 }}>${o.total_amount.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleDelete(o.id)}>Cancel</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)'}}>No active orders.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
