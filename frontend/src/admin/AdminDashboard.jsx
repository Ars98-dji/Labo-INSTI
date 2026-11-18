// src/admin/AdminDashboard.jsx 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { useData } from './DataContext';
import { LaboForm, EquipementForm, TPForm } from './AdminForms';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'labo', 'equipement', 'tp'
  const [editingItem, setEditingItem] = useState(null);

  // Données et actions depuis le DataContext
  const {
    labos,
    equipements,
    tps,
    loading,
    error,
    refresh,
    addLabo,
    updateLabo,
    deleteLabo,
    addEquipement,
    updateEquipement,
    deleteEquipement,
    addTP,
    updateTP,
    deleteTP,
    getStats
  } = useData();

  const handleLogout = () => {
    // Logique de déconnexion
    navigate('/');
  };

  const handleAddNew = (type) => {
    setModalType(type);
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item, type) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer cet élément (ID: ${id}) ?`)) {
      return;
    }
    
    console.log(`🗑️ Tentative de suppression: type=${type}, id=${id}`);
    
    try {
      if (type === 'labo') {
        console.log('Suppression du laboratoire...');
        await deleteLabo(id);
        console.log('✅ Laboratoire supprimé avec succès');
      } else if (type === 'equipement') {
        console.log('Suppression de l\'équipement...');
        await deleteEquipement(id);
        console.log('✅ Équipement supprimé avec succès');
      } else if (type === 'tp') {
        console.log('Suppression du TP...');
        await deleteTP(id);
        console.log('✅ TP supprimé avec succès');
      }
      
      // Rafraîchir les données
      await refresh();
      alert('Élément supprimé avec succès !');
      
    } catch (err) {
      console.error('❌ Erreur lors de la suppression:', err);
      alert(`Erreur lors de la suppression: ${err.message}`);
    }
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return <DashboardOverview labos={labos} equipements={equipements} tps={tps} />;
      case 'labos':
        return <LabosManagement labos={labos} equipements={equipements} tps={tps} onAdd={handleAddNew} onEdit={handleEdit} onDelete={handleDelete} />;
      case 'equipements':
        return <EquipementsManagement equipements={equipements} labos={labos} onAdd={handleAddNew} onEdit={handleEdit} onDelete={handleDelete} />;
      case 'tps':
        return <TPsManagement tps={tps} labos={labos} onAdd={handleAddNew} onEdit={handleEdit} onDelete={handleDelete} />;
      default:
        return <DashboardOverview labos={labos} equipements={equipements} tps={tps} />;
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>🎓 INSTI Admin</h2>
          <p className="admin-role">Administrateur</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            <span className="nav-icon">📊</span>
            Tableau de bord
          </button>
          <button
            className={`nav-item ${activeSection === 'labos' ? 'active' : ''}`}
            onClick={() => setActiveSection('labos')}
          >
            <span className="nav-icon">🏢</span>
            Laboratoires
          </button>
          <button
            className={`nav-item ${activeSection === 'equipements' ? 'active' : ''}`}
            onClick={() => setActiveSection('equipements')}
          >
            <span className="nav-icon">⚙️</span>
            Équipements
          </button>
          <button
            className={`nav-item ${activeSection === 'tps' ? 'active' : ''}`}
            onClick={() => setActiveSection('tps')}
          >
            <span className="nav-icon">🧪</span>
            TPs
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <span>🚪</span> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>Gestion des Laboratoires Pédagogiques</h1>
          <div className="header-actions">
            <button className="btn-preview" onClick={() => navigate('/')}>
              👁️ Aperçu du site
            </button>
            <button className="btn-refresh" onClick={refresh}>
              🔄 Actualiser
            </button>
          </div>
        </header>

        <div className="admin-content">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Chargement des données…</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p className="error">❌ Erreur: {error}</p>
              <button onClick={refresh} className="btn-retry">Réessayer</button>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </main>

      {/* Modal pour ajout/modification */}
      {showModal && (
        <FormModal
          type={modalType}
          item={editingItem}
          onClose={() => {
            setShowModal(false);
            setEditingItem(null);
          }}
          addLabo={addLabo}
          updateLabo={updateLabo}
          addEquipement={addEquipement}
          updateEquipement={updateEquipement}
          addTP={addTP}
          updateTP={updateTP}
          refresh={refresh}
        />
      )}
    </div>
  );
};

// DASHBOARD OVERVIEW
const DashboardOverview = ({ labos = [], equipements = [], tps = [] }) => {
  const totalEquipements = equipements.length;
  const totalTPs = tps.length;

  return (
    <div className="dashboard-overview">
      <div className="stats-cards">
        <div className="stat-card blue">
          <div className="stat-icon">🏢</div>
          <div className="stat-info">
            <h3>{labos.length}</h3>
            <p>Laboratoires</p>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">⚙️</div>
          <div className="stat-info">
            <h3>{totalEquipements}</h3>
            <p>Équipements</p>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">🧪</div>
          <div className="stat-info">
            <h3>{totalTPs}</h3>
            <p>TPs</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Laboratoires enregistrés</h2>
        <div className="activity-list">
          {labos.map(labo => (
            <div key={labo.id} className="activity-item">
              <div className="activity-icon">{labo.code}</div>
              <div className="activity-content">
                <h4>{labo.nom}</h4>
                <p>
                  {equipements.filter(eq => parseInt(eq.laboId) === parseInt(labo.id)).length} équipements • 
                  {tps.filter(tp => parseInt(tp.laboId) === parseInt(labo.id)).length} TPs
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// GESTION DES LABORATOIRES
const LabosManagement = ({ labos = [], equipements = [], tps = [], onAdd, onEdit, onDelete }) => {
  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Gestion des Laboratoires</h2>
        <button className="btn-add" onClick={() => onAdd('labo')}>
          ➕ Ajouter un laboratoire
        </button>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Nom</th>
              <th>Équipements</th>
              <th>TPs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {labos.map(labo => {
              const eqCount = equipements.filter(eq => parseInt(eq.laboId) === parseInt(labo.id)).length;
              const tpCount = tps.filter(tp => parseInt(tp.laboId) === parseInt(labo.id)).length;
              return (
                <tr key={labo.id}>
                  <td>{labo.id}</td>
                  <td><span className="badge">{labo.code}</span></td>
                  <td>{labo.nom}</td>
                  <td>{eqCount}</td>
                  <td>{tpCount}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit" 
                        onClick={() => onEdit(labo, 'labo')}
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => onDelete(labo.id, 'labo')}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// GESTION DES ÉQUIPEMENTS
const EquipementsManagement = ({ equipements = [], labos = [], onAdd, onEdit, onDelete }) => {
  const getLaboCode = (laboId) => {
    const lab = labos.find(l => parseInt(l.id) === parseInt(laboId));
    return lab ? lab.code : laboId;
  };

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Gestion des Équipements</h2>
        <button className="btn-add" onClick={() => onAdd('equipement')}>
          ➕ Ajouter un équipement
        </button>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Laboratoire</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipements.map(equip => (
              <tr key={equip.id}>
                <td>{equip.id}</td>
                <td>{equip.nom}</td>
                <td><span className="badge">{getLaboCode(equip.laboId)}</span></td>
                <td>{equip.description?.substring(0, 50)}...</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-edit" 
                      onClick={() => onEdit(equip, 'equipement')}
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => onDelete(equip.id, 'equipement')}
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// GESTION DES TPS
const TPsManagement = ({ tps = [], labos = [], onAdd, onEdit, onDelete }) => {
  const getLaboCode = (laboId) => {
    const lab = labos.find(l => parseInt(l.id) === parseInt(laboId));
    return lab ? lab.code : laboId;
  };

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Gestion des TPs</h2>
        <button className="btn-add" onClick={() => onAdd('tp')}>
          ➕ Ajouter un TP
        </button>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Laboratoire</th>
              <th>Durée</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tps.map(tp => (
              <tr key={tp.id}>
                <td>{tp.id}</td>
                <td>{tp.titre}</td>
                <td><span className="badge">{getLaboCode(tp.laboId)}</span></td>
                <td>{tp.duree || '—'}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-edit" 
                      onClick={() => onEdit(tp, 'tp')}
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => onDelete(tp.id, 'tp')}
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// MODAL DE FORMULAIRE
const FormModal = ({ type, item, onClose, addLabo, updateLabo, addEquipement, updateEquipement, addTP, updateTP, refresh }) => {
  // Save en fonction du type via les props passées
  const handleSave = async (data) => {
    console.log('💾 Sauvegarde des données:', { type, data, hasId: !!item?.id });
    
    try {
      if (type === 'labo') {
        if (item && item.id) {
          console.log('Mise à jour laboratoire:', item.id);
          await updateLabo(item.id, data);
        } else {
          console.log('Création laboratoire');
          await addLabo(data);
        }
      } else if (type === 'equipement') {
        if (item && item.id) {
          console.log('Mise à jour équipement:', item.id);
          await updateEquipement(item.id, data);
        } else {
          console.log('Création équipement');
          await addEquipement(data);
        }
      } else if (type === 'tp') {
        if (item && item.id) {
          console.log('Mise à jour TP:', item.id);
          await updateTP(item.id, data);
        } else {
          console.log('Création TP');
          await addTP(data);
        }
      }
      
      // Rafraîchir les données
      console.log('🔄 Rafraîchissement des données...');
      if (typeof refresh === 'function') {
        await refresh();
      }
      
      alert('Sauvegarde réussie !');
      onClose();
      
    } catch (err) {
      console.error('❌ Erreur lors de la sauvegarde:', err);
      alert(`Erreur lors de la sauvegarde: ${err.message}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item ? 'Modifier' : 'Ajouter'} {type === 'labo' ? 'un laboratoire' : type === 'equipement' ? 'un équipement' : 'un TP'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {type === 'labo' && <LaboForm item={item} onClose={onClose} onSave={handleSave} />}
          {type === 'equipement' && <EquipementForm item={item} onClose={onClose} onSave={handleSave} />}
          {type === 'tp' && <TPForm item={item} onClose={onClose} onSave={handleSave} />}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;