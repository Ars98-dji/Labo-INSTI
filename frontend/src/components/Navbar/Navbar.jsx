// src/components/Navbar/Navbar.jsx
import React from 'react';
import './Navbar.css';

function Navbar() {
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
                <p>_________________________________________________________________________________</p>
            <div className="nav-links">
              <button type="button" className="nav-link" aria-label="Accès rapide">
                <i className="bi bi-person"></i> Accès rapide
              </button>
              
              <button type="button" className="nav-link" aria-label="Accès rapide">
                <i className="bi bi-person"></i> Accès rapide
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
              <a href="/presentation" className="main-nav-link">PRÉSENTATION</a>
              <a href="/formations" className="main-nav-link">FORMATIONS</a>
              <a href="/actualites" className="main-nav-link">ACTUALITÉS</a>
              <a href="/vie-academique" className="main-nav-link">VIE ACADÉMIQUE</a>
              <a href="/recherches" className="main-nav-link">RECHERCHES & COOPÉRATIONS</a>
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
