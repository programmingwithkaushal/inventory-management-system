import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', sku: '', price: '', quantity: '' });
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/products', {
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      });
      setFormData({ name: '', sku: '', price: '', quantity: '' });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred while saving.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await api.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  return (
    <div>
      <div className="header-actions">
        <h1 className="page-title" style={{margin: 0}}>Manage Products</h1>
      </div>

      <div className="card" style={{marginBottom: '2rem'}}>
        <h3>Add New Product</h3>
        <br />
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">SKU</label>
            <input className="form-control" name="sku" value={formData.sku} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Price</label>
            <input className="form-control" type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Quantity in Stock</label>
            <input className="form-control" type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{gridColumn: '1 / -1'}}>
            <button type="submit" className="btn btn-primary">Save Product</button>
          </div>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.quantity}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
