import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { X, AlertCircle, Package, Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

const COLORS = ['#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#374151', '#FFFFFF'];

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    orders: 0,
    lowStockCount: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  });

  const [productsData, setProductsData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [showLowStockModal, setShowLowStockModal] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [resProducts, resCustomers, resOrders] = await Promise.all([
          api.get('/products'),
          api.get('/customers'),
          api.get('/orders')
        ]);
        
        const products = resProducts.data;
        const orders = resOrders.data;
        const lowStock = products.filter(p => p.quantity < 10);
        
        const totalRev = orders.reduce((sum, order) => sum + order.total_amount, 0);
        const aov = orders.length > 0 ? totalRev / orders.length : 0;

        setStats({
          products: products.length,
          customers: resCustomers.data.length,
          orders: orders.length,
          lowStockCount: lowStock.length,
          totalRevenue: totalRev,
          averageOrderValue: aov
        });

        setLowStockItems(lowStock);

        // Inventory Health Chart Data (Top 10 highest stock items)
        const inventoryChartData = [...products]
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 10)
          .map(p => ({
            name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
            stock: p.quantity
          }));
        setProductsData(inventoryChartData);

        // Revenue Distribution Chart Data
        const revenueMap = {};
        orders.forEach(order => {
          const product = products.find(p => p.id === order.product_id);
          const productName = product ? product.name : 'Unknown';
          if (!revenueMap[productName]) {
            revenueMap[productName] = 0;
          }
          revenueMap[productName] += order.total_amount;
        });

        const revData = Object.keys(revenueMap).map(key => ({
          name: key.length > 15 ? key.substring(0, 15) + '...' : key,
          value: revenueMap[key]
        }));
        setRevenueData(revData.sort((a, b) => b.value - a.value).slice(0, 6)); // Top 6 revenue generators

      } catch (error) {
        console.error("Error fetching dashboard stats", error);
      }
    };
    fetchDashboardData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#171A21', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 15px', borderRadius: '8px', color: '#F5F7FA' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>{label || payload[0].name}</p>
          <p style={{ margin: 0, color: '#9CA3AF' }}>{payload[0].name === 'stock' ? 'Quantity' : 'Revenue'}: {payload[0].name === 'stock' ? '' : '$'}{payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-reveal" style={{ position: 'relative' }}>
      <h1 className="page-title">Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="card stat-card" style={{ animationDelay: '0.1s' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Package size={18} /> Total Products</h3>
          <p>{stats.products}</p>
        </div>
        <div className="card stat-card" style={{ animationDelay: '0.2s' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={18} /> Total Customers</h3>
          <p>{stats.customers}</p>
        </div>
        <div className="card stat-card" style={{ animationDelay: '0.3s' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShoppingCart size={18} /> Total Orders</h3>
          <p>{stats.orders}</p>
        </div>
        <div className="card stat-card" style={{ animationDelay: '0.4s' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success, #10B981)' }}><DollarSign size={18} /> Total Revenue</h3>
          <p style={{ color: 'var(--success, #10B981)' }}>${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="card stat-card" style={{ animationDelay: '0.5s' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp size={18} /> Avg Order Value</h3>
          <p>${stats.averageOrderValue.toFixed(2)}</p>
        </div>
        <div className="card stat-card" style={{ animationDelay: '0.6s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}><AlertCircle size={18} /> Low Stock</h3>
            <p style={{color: 'var(--danger)'}}>{stats.lowStockCount}</p>
          </div>
          {stats.lowStockCount > 0 && (
            <button 
              onClick={() => setShowLowStockModal(true)}
              className="btn" 
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)', width: 'max-content', marginTop: '1rem', padding: '0.5rem 1rem' }}
            >
              View Items
            </button>
          )}
        </div>
      </div>

      <div className="dashboard-charts" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', paddingBottom: '2rem' }}>
        <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Inventory Health</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productsData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} angle={-45} textAnchor="end" />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="stock" fill="#D1D5DB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Revenue by Product</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Low Stock Modal */}
      {showLowStockModal && (
        <div className="modal-overlay" onClick={() => setShowLowStockModal(false)}>
          <div className="modal-content animate-reveal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', margin: 0 }}>
                <AlertCircle size={24} /> Low Stock Items
              </h2>
              <button onClick={() => setShowLowStockModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <div className="table-container" style={{ boxShadow: 'none', border: '1px solid var(--border-color)', maxHeight: '400px', overflowY: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Product</th>
                    <th>Stock Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map(item => (
                    <tr key={item.id}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{item.sku}</td>
                      <td style={{ fontWeight: 500 }}>{item.name}</td>
                      <td style={{ color: 'var(--danger)', fontWeight: 600 }}>{item.quantity} units</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
