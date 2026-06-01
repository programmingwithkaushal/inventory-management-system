import React, { useState, useEffect } from 'react';
import api from '../services/api';

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
    if (window.confirm("Are you sure?")) {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    }
  };

  return (
    <div>
      <div className="header-actions">
        <h1 className="page-title" style={{margin: 0}}>Manage Customers</h1>
      </div>

      <div className="card" style={{marginBottom: '2rem'}}>
        <h3>Add New Customer</h3>
        <br />
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-control" name="full_name" value={formData.full_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-control" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{gridColumn: '1 / -1'}}>
            <button type="submit" className="btn btn-primary">Save Customer</button>
          </div>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.full_name}</td>
                <td>{c.email}</td>
                <td>{c.phone_number}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan="5" style={{textAlign: 'center'}}>No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
