// src/App.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Import des composants
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './components/Pages/Home';
import LaboDetails from './components/Pages/LaboDetails';
import AdminDashboard from './admin/AdminDashboard';
import { DataProvider } from './admin/DataContext'; 
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/labo/:id" element={<LaboDetails />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<ComingSoon />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </DataProvider>
  );
}

// Sections du site INSTI pas encore développées : évite une page blanche
const ComingSoon = () => (
  <div className="coming-soon">
    <h1>Page en construction</h1>
    <p>Cette section du site de l'INSTI n'est pas encore disponible.</p>
    <Link to="/" className="coming-soon-link">← Retour aux laboratoires</Link>
  </div>
);

export default App;
