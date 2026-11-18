import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="row">
          {/* Left Column - Logos */}
          <div className="col-md-3">
            <div className="footer-logos">
              <div className="footer-logo-item">
                <img src="/Logo/logounstim.png" alt="UNSTIM" className="footer-logo" />
                <span className="footer-logo-text">UNSTIM</span>
              </div>
              <div className="footer-logo-item">
                <img src="/Logo/logo_final.png" alt="INSTI" className="footer-logo" />
                <span className="footer-logo-text">INSTI</span>
              </div>
              <div className="footer-contact">
                <p><i className="bi bi-geo-alt"></i> Lokossa, Agnivelji</p>
                <p><i className="bi bi-telephone"></i> (+229) 21 81 68 68</p>
                <p className="footer-motto">"Science et technologie au service de l'homme"</p>
                <p><i className="bi bi-envelope"></i> (+229) 21 81 68 68</p>
                <div className="footer-social">
                  <a href="#" className="social-link"><i className="bi bi-facebook"></i></a>
                  <a href="#" className="social-link"><i className="bi bi-youtube"></i></a>
                </div>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="col-md-3">
            <h4 className="footer-heading">Nos Ressources</h4>
            <ul className="footer-list">
              <li><a href="#">Incubateur de startups</a></li>
              <li><a href="#">Unité d'application de l'INSTI</a></li>
              <li><a href="#">Plateforme E-learning</a></li>
              <li><a href="#">Blog officiel de l'INSTI</a></li>
            </ul>
          </div>

          {/* Useful Links */}
          <div className="col-md-3">
            <h4 className="footer-heading">Liens utiles</h4>
            <ul className="footer-list">
              <li><a href="#">Ministère de l'Enseignement Supérieur et de la Recherche Scientifique</a></li>
              <li><a href="#">Unité d'application de l'INSTI</a></li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="col-md-3">
            <h4 className="footer-heading">Navigations</h4>
            <ul className="footer-list">
              <li><a href="#">Accueil</a></li>
              <li><a href="#">Formation</a></li>
              <li><a href="#">Vie estudiantine</a></li>
              <li><a href="#">Mediatheque</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>INSTI-UNSTIM © 2025</p>
      </div>
    </footer>
  );
}

export default Footer;