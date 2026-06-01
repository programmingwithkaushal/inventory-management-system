import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserPlus } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ full_name: '', email: '', phone_number: '' });
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/customers', formData);
      setFormData({ full_name: '', email: '', phone_number: '' });
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this customer?")) {
      try {
        await api.delete(`/customers/${id}`);
        fetchCustomers();
      } catch (err) {
        setError(err.response?.data?.detail || "An error occurred while deleting.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="animate-reveal">
      <div className="header-actions">
        <h1 className="page-title" style={{margin: 0}}>Client Roster</h1>
      </div>

      <div className="card" style={{marginBottom: '3rem'}}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Add New Client</h3>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">Full Name</label>
            <input className="form-control" name="full_name" placeholder="John Doe" value={formData.full_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-control" type="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-control" name="phone_number" placeholder="+1 (555) 000-0000" value={formData.phone_number} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{gridColumn: '1 / -1', marginTop: '1rem'}}>
            <button type="submit" className="btn btn-primary" style={{ width: 'max-content' }}>
              <UserPlus size={18} />
              Register Client
            </button>
          </div>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Email Address</th>
              <th>Contact Number</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 500 }}>{c.full_name}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{c.email}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{c.phone_number}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleDelete(c.id)}>Remove</button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan="4" style={{textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)'}}>No clients registered yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
