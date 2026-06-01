import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, X, Search } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', sku: '', price: '', quantity: '' });
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      const payload = {
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      
      setEditingId(null);
      setFormData({ name: '', sku: '', price: '', quantity: '' });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred while saving.");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price.toString(),
      quantity: product.quantity.toString()
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', sku: '', price: '', quantity: '' });
    setError(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        setError(err.response?.data?.detail || "An error occurred while deleting.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-reveal">
      <div className="header-actions">
        <h1 className="page-title" style={{margin: 0}}>Products Inventory</h1>
      </div>

      <div className="card" style={{marginBottom: '3rem'}}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          {editingId ? 'Update Product' : 'Register New Product'}
        </h3>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input className="form-control" name="name" placeholder="e.g. MacBook Pro M3" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">SKU Code</label>
            <input className="form-control" name="sku" placeholder="e.g. MAC-PRO-M3" value={formData.sku} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Price (USD)</label>
            <input className="form-control" type="number" step="0.01" name="price" placeholder="1999.00" value={formData.price} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Inventory Stock</label>
            <input className="form-control" type="number" name="quantity" placeholder="0" value={formData.quantity} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', gap: '1rem'}}>
            <button type="submit" className="btn btn-primary" style={{ width: 'max-content' }}>
              {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
            {editingId && (
              <button type="button" className="btn" onClick={cancelEdit} style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                <X size={18} /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 1rem', width: '300px' }}>
        <Search size={18} color="var(--text-secondary)" style={{ marginRight: '0.5rem' }} />
        <input 
          type="text" 
          placeholder="Search by SKU..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%' }}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Stock Level</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p.id}>
                <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{p.sku}</td>
                <td style={{ fontWeight: 500 }}>{p.name}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>
                  <span style={{ color: p.quantity < 10 ? 'var(--danger)' : 'var(--text-primary)' }}>
                    {p.quantity} units
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', marginRight: '0.5rem', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} onClick={() => handleEdit(p)}>Edit</button>
                  <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleDelete(p.id)}>Remove</button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr><td colSpan="5" style={{textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)'}}>No products match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
