// src/components/Pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { useData } from '../../admin/DataContext';

const Home = () => {
  const navigate = useNavigate();
  const { labos, loading, error } = useData();

  const handleLaboClick = (laboId) => {
    navigate(`/labo/${laboId}`);
  };

  return (
    <div className="homepage-container">
      {/* Header */}
      <div className="homepage-header text-center">
        <h1>Nos Laboratoires Pédagogiques</h1>
        <p>Découvrez nos plateformes de recherche de pointe</p>
      </div>

      {/* Grille des laboratoires */}
      <div className="labo-grid-container">
        <div className="labo-grid">
          {loading && (
            <div className="text-center">Chargement des laboratoires...</div>
          )}

          {error && (
            <div className="text-center text-danger">Erreur : {error}</div>
          )}

          {!loading && !error && (!labos || labos.length === 0) && (
            <div className="text-center">Aucun laboratoire disponible pour l'instant.</div>
          )}

          {!loading && labos && labos.map((labo) => {
            const image = labo.images?.[0] || labo.image || '';
            return (
              <div 
                key={labo.id} 
                className="labo-card"
                onClick={() => handleLaboClick(labo.id)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleLaboClick(labo.id);
                  }
                }}
              >
                <img 
                  src={image}
                  alt={labo.nom}
                  className="labo-card-image"
                />
                <div className="labo-card-overlay"></div>
                <div className="labo-card-content">
                  <h2 className="labo-card-title">Labo {labo.code || labo.id}</h2>
                  <p className="labo-card-subtitle">{labo.nom}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;


// const Home = () => {
//   const navigate = useNavigate();
  
//   return (
//     <div className="homepage-container">

//       {/* Grille des laboratoires */}
//       <div className="container py-4">
//         <div className="row g-4 justify-content-center">
//           {laboratoires.map((labo) => (
//             <div key={labo.id} className="col-md-5 col-lg-5">
//               <div 
//                 className="labo-card card h-100 border-0 shadow-lg"
//                 style={{ borderLeft: `6px solid ${labo.couleur}` }}
//                 onClick={() => navigate(`/labo/${labo.id}`)}
//               >
//                 <div className="card-body d-flex flex-column p-4">
//                   <div className="d-flex align-items-start mb-3">
//                     <div 
//                       className="labo-icon rounded-circle d-flex align-items-center justify-content-center me-3"
//                       style={{ backgroundColor: labo.couleur + '20' }}
//                     >
//                       <span 
//                         className="labo-code fw-bold"
//                         style={{ color: labo.couleur }}
//                       >
//                         {labo.code}
//                       </span>
//                     </div>
//                     <div>
//                       <h3 className="card-title fw-bold mb-1">
//                         Labo {labo.code}
//                       </h3>
//                       <h5 className="card-subtitle text-muted">
//                         {labo.nom}
//                       </h5>
//                     </div>
//                   </div>
//                   <p className="card-text flex-grow-1">
//                     {labo.description}
//                   </p>
//                   <div className="mt-3">
//                     <span className="text-primary fw-medium">
//                       Cliquer pour explorer →
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="homepage-footer mt-5 py-4 bg-light">
//         <div className="container text-center">
//           <p className="mb-0 text-muted">
//             INSTI - Institut des Sciences et Techniques de l'Ingénieur
//           </p>
//           <small className="text-muted">
//             Plateforme de présentation des laboratoires pédagogiques
//           </small>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Home;