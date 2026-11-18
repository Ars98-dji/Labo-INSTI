// src/components/Navbar/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const NAV_ITEMS = [
  { to: '/presentation', label: 'PRÉSENTATION' },
  { to: '/formations', label: 'FORMATIONS' },
  { to: '/actualites', label: 'ACTUALITÉS' },
  { to: '/vie-academique', label: 'VIE ACADÉMIQUE' },
  { to: '/recherches', label: 'RECHERCHES & COOPÉRATIONS' }
];

function Navbar() {
  const navigate = useNavigate();

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <div className="container-fluid">
          <div className="nav-content">
            <div className="header-text">
              <h1 className="header-title">INSTI</h1>
            </div>
            <p className="header-subtitle">
              Institut National Supérieur<br />
              de Technologie Industrielle de<br />
              Lokossa
            </p>
            <div className="nav-links">
              <button
                type="button"
                className="nav-link"
                onClick={() => navigate('/admin')}
              >
                <i className="bi bi-person"></i> Espace admin
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Header */}
      <header className="main-header">
        <div className="container-fluid">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-circle">
                <img src="/Logo/logo_final.png" alt="INSTI Logo" className="logo-img" />
              </div>
            </div>
            <nav className="main-nav">
              {NAV_ITEMS.map((item) => (
                <Link key={item.to} to={item.to} className="main-nav-link">
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="header-logo-right">
              <img src="/Logo/logounstim.png" alt="University Logo" className="right-logo" />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
