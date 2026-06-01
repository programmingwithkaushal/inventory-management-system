import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserPlus, Search, Mail, Phone, Hash } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ full_name: '', email: '', phone_number: '' });
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredCustomers = customers.filter(c => 
    c.id.toString().includes(searchQuery) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-reveal">
      <div className="header-actions">
        <h1 className="page-title" style={{margin: 0}}>Customers</h1>
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

      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 1rem', width: '300px' }}>
        <Search size={18} color="var(--text-secondary)" style={{ marginRight: '0.5rem' }} />
        <input 
          type="text" 
          placeholder="Search by ID, Name or Email..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%' }}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client Name</th>
              <th>Email Address</th>
              <th>Contact Number</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(c => (
              <tr key={c.id}>
                <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Hash size={14} /> {c.id}
                  </div>
                </td>
                <td style={{ fontWeight: 500 }}>{c.full_name}</td>
                <td style={{ color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={14} /> {c.email}
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={14} /> {c.phone_number}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleDelete(c.id)}>Remove</button>
                </td>
              </tr>
            ))}
            {filteredCustomers.length === 0 && (
              <tr><td colSpan="5" style={{textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)'}}>No clients match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
