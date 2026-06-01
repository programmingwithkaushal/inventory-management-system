import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import { LayoutDashboard, Package, Users, ShoppingCart } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="app-container">
        <aside className="sidebar">
          <div className="sidebar-logo">
            📦 IO Manager
          </div>
          <nav>
            <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <LayoutDashboard size={20} />
              Dashboard
            </NavLink>
            <NavLink to="/products" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <Package size={20} />
              Products
            </NavLink>
            <NavLink to="/customers" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <Users size={20} />
              Customers
            </NavLink>
            <NavLink to="/orders" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <ShoppingCart size={20} />
              Orders
            </NavLink>
          </nav>
        </aside>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
