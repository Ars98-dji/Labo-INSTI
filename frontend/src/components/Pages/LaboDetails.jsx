// insti-site/src/components/Pages/LaboDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './LaboDetails.css';
import { useData } from '../../admin/DataContext';
import { demoLabs } from '../../data/demoLabs';

const LaboDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [selectedEquipement, setSelectedEquipement] = useState(null);
  const [selectedTP, setSelectedTP] = useState(null);

  // Utiliser DataContext (API centralisée)
  const { getLaboById, getEquipementsByLaboId, getTPsByLaboId, loading, error } = useData();

  // Récupérer les données
  let laboData = getLaboById(id);
  let laboEquipements = getEquipementsByLaboId(id);
  let laboTPs = getTPsByLaboId(id);

  // Fallback to demo data if API/context doesn't provide the labo
  if (!laboData) {
    const numericId = Number(id);
    const demo = demoLabs.find((d) => d.id === numericId || String(d.id) === id);
    if (demo) {
      console.log('📦 Utilisation des données de démo pour le labo:', id);
      laboData = demo;
      laboEquipements = demo.equipements || [];
      laboTPs = demo.tps || [];
    }
  }

  // Log pour debug
  useEffect(() => {
    console.log('='.repeat(60));
    console.log('🔍 LaboDetails - État actuel:');
    console.log('  ID du labo:', id);
    console.log('  Labo trouvé:', laboData ? laboData.nom : 'NON TROUVÉ');
    console.log('  Nombre d\'équipements:', laboEquipements?.length || 0);
    console.log('  Nombre de TPs:', laboTPs?.length || 0);
    console.log('  Loading:', loading);
    console.log('  Error:', error);
    console.log('='.repeat(60));
    
    if (laboEquipements && laboEquipements.length > 0) {
      console.log('📦 Premier équipement:', laboEquipements[0]);
    }
    if (laboTPs && laboTPs.length > 0) {
      console.log('🎥 Premier TP:', laboTPs[0]);
    }
  }, [id, laboData, laboEquipements, laboTPs, loading, error]);

  if (loading) {
    return (
      <div className="labo-detail-container">
        <div className="container text-center">
          <div className="spinner">⏳</div>
          <p>Chargement des détails du laboratoire...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="labo-detail-container">
        <div className="container">
          <div className="alert alert-danger">
            <h4>❌ Erreur</h4>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary mt-2">
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!laboData) {
    return (
      <div className="labo-detail-container">
        <div className="container text-center">
          <h3>⚠️ Laboratoire introuvable</h3>
          <p>Le laboratoire avec l'ID {id} n'existe pas.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary mt-3">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'info':
        return <InfoTab data={laboData} />;
      case 'equipements':
        return <EquipementsTab 
          equipements={laboEquipements} 
          labo={laboData} 
          onEquipementClick={setSelectedEquipement} 
        />;
      case 'tps':
        return <TPsTab 
          tps={laboTPs} 
          labo={laboData} 
          onTPClick={setSelectedTP} 
        />;
      default:
        return <InfoTab data={laboData} />;
    }
  };

  return (
    <div className="labo-detail-container">
      {/* Header */}
      <div className="labo-header">
        <div className="container">
          <button 
            className="btn-retour"
            onClick={() => navigate('/')}
          >
            ← Retour aux laboratoires
          </button>
          <h1 className="labo-main-title">
            Labo {laboData.code} - {laboData.nom}
          </h1>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="container">
        <div className="tabs-navigation">
          <button
            className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <span className="tab-icon">📋</span>
            Info. générale
          </button>
          <button
            className={`tab-btn ${activeTab === 'equipements' ? 'active' : ''}`}
            onClick={() => setActiveTab('equipements')}
          >
            <span className="tab-icon">⚙️</span>
            Équipements ({laboEquipements?.length || 0})
          </button>
          <button
            className={`tab-btn ${activeTab === 'tps' ? 'active' : ''}`}
            onClick={() => setActiveTab('tps')}
          >
            <span className="tab-icon">🧪</span>
            TPs ({laboTPs?.length || 0})
          </button>
        </div>

        {/* Contenu dynamique */}
        <div className="tab-content-container">
          {renderTabContent()}
        </div>
      </div>

      {/* Modal Popup pour les détails d'équipement */}
      {selectedEquipement && (
        <EquipementModal 
          equipement={selectedEquipement} 
          onClose={() => setSelectedEquipement(null)} 
        />
      )}

      {/* Modal Vidéo pour les TPs */}
      {selectedTP && (
        <TPVideoModal 
          tp={selectedTP} 
          onClose={() => setSelectedTP(null)} 
        />
      )}
    </div>
  );
};

// ONGLET INFO GÉNÉRALE
const InfoTab = ({ data }) => (
  <div className="info-tab">
    <div className="info-left-section">
      <div className="labo-title-section">
        <h2>{data.titre || data.nom}</h2>
        <p className="labo-description">{data.description || ''}</p>
      </div>
      <div className="labo-images">
        {Array.isArray(data.images) && data.images.filter(Boolean).length > 0 ? (
          data.images.filter(Boolean).map((img, index) => (
            <div key={index} className="labo-image">
              <img src={img} alt={`${data.nom || ''} ${index + 1}`} />
            </div>
          ))
        ) : (
          <div className="no-images">Aucune image disponible.</div>
        )}
      </div>
    </div>

    {/* Carte Chef de Département */}
    <div className="chef-card">
      <div className="chef-card-header">
        <h3>Chef Département</h3>
        {data.chef && data.chef.photo ? (
          <img src={data.chef.photo} alt={data.chef.nom || 'Chef'} className="chef-photo" />
        ) : (
          <div className="chef-photo placeholder">👤</div>
        )}
      </div>
      <div className="chef-info">
        <p className="chef-name">{data.chef?.nom || '—'}</p>
        <p className="chef-title">{data.chef?.titre || 'Chef de Département'}</p>
        <div className="chef-separator"></div>
        <div className="chef-contact">
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <span>{data.chef?.telephone || '—'}</span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">✉️</span>
            <span>{data.chef?.email || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ONGLET EQUIPEMENTS
const EquipementsTab = ({ equipements = [], labo = {}, onEquipementClick }) => {
  console.log('🎯 EquipementsTab render:', equipements.length, 'équipements');
  
  return (
    <div className="equipements-tab">
      <h3>Principaux Équipements du Labo {labo.code || ''}</h3>
      {equipements && equipements.length > 0 ? (
        <div className="equipements-grid">
          {equipements.map((equip) => (
            <div key={equip.id} className="equipement-card" onClick={() => onEquipementClick(equip)}>
              <div className="equipement-image">
                <img src={equip.image} alt={equip.nom} />
              </div>
              <div className="equipement-content">
                <h4 className="equipement-name">{equip.nom}</h4>
                <p className="equipement-desc">{equip.description || equip.details}</p>
                <button 
                  type="button" 
                  className="equipement-link" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onEquipementClick(equip); 
                  }}
                >
                  Plus de détails
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data-message">
          <p>📦 Aucun équipement disponible pour ce laboratoire.</p>
        </div>
      )}
    </div>
  );
};

// ONGLET TPS
const TPsTab = ({ tps = [], labo = {}, onTPClick }) => {
  console.log('🎯 TPsTab render:', tps.length, 'TPs');
  
  return (
    <div className="tps-tab">
      <h3>Travaux Pratiques réalisés</h3>
      {tps && tps.length > 0 ? (
        <div className="tps-list">
          {tps.map((tp) => (
            <div key={tp.id} className="tp-card" onClick={() => onTPClick(tp)}>
              <div className="tp-video-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <div className="tp-content">
                <h4 className="tp-title">{tp.titre}</h4>
                <p className="tp-description">{tp.description}</p>
                {tp.duree && <span className="tp-duration">⏱️ {tp.duree}</span>}
              </div>
              <button 
                className="tp-button" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onTPClick(tp); 
                }}
              >
                Voir la vidéo
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data-message">
          <p>🎥 Aucun TP disponible pour ce laboratoire.</p>
        </div>
      )}
    </div>
  );
};

// MODAL POPUP POUR LES DÉTAILS D'ÉQUIPEMENT
const EquipementModal = ({ equipement, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>{equipement.nom}</h2>
        </div>

        <div className="modal-body">
          <div className="modal-image">
            <img src={equipement.image} alt={equipement.nom} />
          </div>

          <div className="modal-description">
            <p>{equipement.details || equipement.description}</p>
          </div>

          <div className="modal-specifications">
            <h3>Spécifications Techniques</h3>
            <div className="specs-grid">
              {equipmentHasSpecs(equipement) ? (
                Object.entries(equipement.specifications).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <span className="spec-label">{formatLabel(key)} :</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))
              ) : (
                <div>Aucune spécification disponible.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fonction pour formater les labels
const formatLabel = (key) => {
  const labels = {
    marque: 'Marque',
    modele: 'Modèle',
    capacite: 'Capacité',
    precision: 'Précision',
    vitesse: 'Vitesse',
    dimensions: 'Dimensions',
    poids: 'Poids',
    alimentation: 'Alimentation',
    certification: 'Certification',
    anneeMiseEnService: 'Année de mise en service',
    puissanceMax: 'Puissance maximale',
    tension: 'Tension',
    courant: 'Courant',
    rendement: 'Rendement',
    nombreBoulets: 'Nombre de boulets',
    capaciteTamis: 'Capacité tamis',
    amplitude: 'Amplitude',
    frequence: 'Fréquence',
    timer: 'Minuterie',
    energie: 'Énergie',
    plageIndice: 'Plage d\'indice',
    temperatureMax: 'Température maximale',
    volume: 'Volume',
    uniformite: 'Uniformité',
    porteeMax: 'Portée maximale',
    lisibilite: 'Lisibilité',
    reproductibilite: 'Reproductibilité',
    linearite: 'Linéarité',
    vitesseVentMin: 'Vitesse vent min.',
    vitesseVentMax: 'Vitesse vent max.',
    diametreRotor: 'Diamètre rotor',
    hauteurMat: 'Hauteur du mât',
    bandePassante: 'Bande passante',
    puissance: 'Puissance'
  };
  return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
};

// Helper pour vérifier la présence de spécifications
const equipmentHasSpecs = (equip) => {
  return equip && typeof equip.specifications === 'object' && Object.keys(equip.specifications || {}).length > 0;
};

// MODAL VIDÉO POUR LES TPs
const TPVideoModal = ({ tp, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-video" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>{tp.titre}</h2>
        </div>

        <div className="modal-body">
          {/* Vidéo YouTube */}
          <div className="video-container">
            <iframe
              src={tp.videoUrl || tp.video}
              title={tp.titre}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Informations du TP */}
          <div className="tp-info-section">
            <div className="tp-meta">
              {tp.duree && (
                <div className="tp-meta-item">
                  <span className="meta-icon">⏱️</span>
                  <span>Durée : {tp.duree}</span>
                </div>
              )}
              {tp.dateRealisation && (
                <div className="tp-meta-item">
                  <span className="meta-icon">📅</span>
                  <span>Réalisé le : {tp.dateRealisation}</span>
                </div>
              )}
            </div>

            <div className="tp-description-full">
              <h3>Description</h3>
              <p>{tp.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaboDetails;