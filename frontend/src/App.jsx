import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import { LayoutDashboard, Package, Users, ShoppingCart, Box } from 'lucide-react';

function App() {
  React.useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  }, []);

  return (
    <Router>
      <div className="app-container">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="brand-icon">
              <Box size={24} color="#F5F7FA" />
            </div>
            Nexus OS
          </div>
          <nav className="sidebar-nav">
            <NavLink replace to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
            <NavLink replace to="/products" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <Package size={18} />
              Products
            </NavLink>
            <NavLink replace to="/customers" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <Users size={18} />
              Customers
            </NavLink>
            <NavLink replace to="/orders" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <ShoppingCart size={18} />
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
