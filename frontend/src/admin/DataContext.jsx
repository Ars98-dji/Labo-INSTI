// src/admin/DataContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { demoLabs } from '../data/demoLabs';

// Configuration de l'API
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000/api/v1';
const USE_DEMO_DATA = (process.env.REACT_APP_USE_DEMO_DATA || 'false').toLowerCase() === 'true';

// Création du contexte
const DataContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData doit être utilisé dans un DataProvider');
  }
  return context;
};

// Provider du contexte
export const DataProvider = ({ children }) => {
  // États principaux
  const [labos, setLabos] = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [tps, setTPs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper pour les requêtes vers l'API
  const apiRequest = async (path, opts = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(opts.headers || {})
    };

    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API error ${res.status}: ${text}`);
    }
    
    if (res.status === 204) return null;
    const data = await res.json();
    return data;
  };

  // Helper pour parser les spécifications JSON
  const safeParseSpecs = (spec) => {
    if (!spec) return {};
    if (typeof spec === 'object') return spec;
    if (typeof spec === 'string') {
      try {
        return JSON.parse(spec);
      } catch (e) {
        try {
          const fixed = spec.replace(/'/g, '"');
          return JSON.parse(fixed);
        } catch (e2) {
          console.warn('Failed to parse specs:', spec);
          return {};
        }
      }
    }
    return {};
  };

  // Normalisation des données API vers format frontend
  const normalizeLaboratory = (lab) => {
    // Extraire les images
    let normalizedImages = [];
    if (Array.isArray(lab.images)) {
      normalizedImages = lab.images.map(img => 
        typeof img === 'string' ? img : (img.image_url || img.url || '')
      ).filter(Boolean);
    }

    return {
      id: lab.id,
      code: lab.code || lab.department_code || null,
      nom: lab.name || lab.nom || '',
      titre: lab.title || lab.titre || lab.name || '',
      description: lab.description || '',
      location: lab.location || '',
      capacity: lab.capacity || lab.capacite || null,
      image: lab.image_url || lab.image || normalizedImages[0] || '',
      images: normalizedImages,
      chef: {
        nom: lab.chief_name || (lab.chef && lab.chef.nom) || null,
        email: lab.chief_email || (lab.chef && lab.chef.email) || null,
        telephone: lab.chief_phone || (lab.chef && lab.chef.telephone) || null,
        photo: lab.chief_photo || (lab.chef && lab.chef.photo) || null,
        titre: lab.chief_title || (lab.chef && lab.chef.titre) || null
      }
    };
  };

  const normalizeEquipment = (equip) => {
    const specsRaw = equip.specifications || equip.specs || equip.fiche_technique || equip.ficheTechnique || null;
    const specs = safeParseSpecs(specsRaw);
    
    return {
      id: equip.id,
      nom: equip.name || equip.nom || '',
      details: equip.description || equip.details || '',
      description: equip.description || equip.details || '',
      image: equip.image_url || equip.imageUrl || equip.image || '',
      specifications: specs,
      fiche_technique: specs,
      laboId: equip.laboratory_id || equip.laboratoryId || equip.laboId || equip.labo_id || null
    };
  };

  const normalizeTP = (tp) => ({
    id: tp.id,
    titre: tp.title || tp.titre || tp.nom || '',
    description: tp.description || tp.summary || '',
    videoUrl: tp.video_url || tp.videoUrl || tp.video || null,
    video: tp.video || tp.video_url || tp.videoUrl || null,
    duree: tp.duration || tp.duree || tp.length || null,
    dateRealisation: tp.realization_date || tp.date_realisation || tp.dateRealisation || tp.date || null,
    laboId: tp.laboratory_id || tp.laboratoryId || tp.laboId || tp.labo_id || null
  });

  // Chargement initial : récupérer les ressources principales
  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    
    console.log('🔄 Chargement des données depuis l\'API...');
    console.log('📍 API URL:', API_BASE);
    
    try {
      // Si mode démo activé
      if (USE_DEMO_DATA) {
        console.log('⚙️ Mode DEMO activé - Utilisation des données de démonstration');
        setLabos(demoLabs);
        
        // Normaliser équipements
        const allEquipements = demoLabs.flatMap(labo => 
          (labo.equipements || labo.equipments || []).map(eq => ({
            ...eq,
            laboId: labo.id,
            nom: eq.nom || eq.name,
            description: eq.description || eq.details,
            image: eq.image || eq.image_url
          }))
        );
        
        // Normaliser TPs
        const allTPs = demoLabs.flatMap(labo => 
          (labo.tps || []).map(tp => ({
            ...tp,
            laboId: labo.id
          }))
        );
        
        setEquipements(allEquipements);
        setTPs(allTPs);
        setLoading(false);
        return;
      }

      // Mode API - Récupérer les données du backend
      console.log('🌐 Connexion à l\'API backend...');
      
      const [labosRes, equipRes, tpsRes, deptRes, imagesRes] = await Promise.all([
        apiRequest('/laboratories').catch((err) => { 
          console.warn('⚠️ Labs API failed:', err.message); 
          return []; 
        }),
        apiRequest('/equipments').catch((err) => { 
          console.warn('⚠️ Equipment API failed:', err.message); 
          return []; 
        }),
        apiRequest('/tps').catch((err) => { 
          console.warn('⚠️ TPs API failed:', err.message); 
          return []; 
        }),
        apiRequest('/departments').catch((err) => { 
          console.warn('⚠️ Departments API failed:', err.message); 
          return []; 
        }),
        apiRequest('/laboratory-images').catch(() => 
          apiRequest('/laboratory_images')
        ).catch((err) => { 
          console.warn('⚠️ Images API failed:', err.message); 
          return []; 
        })
      ]);

      console.log('📦 Données reçues de l\'API:', {
        labs: labosRes?.length || 0,
        equipments: equipRes?.length || 0,
        tps: tpsRes?.length || 0,
        departments: deptRes?.length || 0,
        images: imagesRes?.length || 0
      });

      // Normaliser les laboratoires
      let normalizedLabs = [];
      if (Array.isArray(labosRes) && labosRes.length > 0) {
        normalizedLabs = labosRes.map(normalizeLaboratory);
        console.log('✅ Laboratoires normalisés:', normalizedLabs.length);
      } else {
        console.warn('⚠️ Aucun laboratoire depuis l\'API');
        normalizedLabs = demoLabs.map(normalizeLaboratory);
      }

      // Normaliser les équipements
      let normalizedEquip = [];
      if (Array.isArray(equipRes) && equipRes.length > 0) {
        normalizedEquip = equipRes.map(normalizeEquipment);
        console.log('✅ Équipements normalisés:', normalizedEquip.length);
      } else {
        console.warn('⚠️ Aucun équipement depuis l\'API - Utilisation données démo');
        normalizedEquip = demoLabs.flatMap(d => 
          (d.equipements || d.equipments || []).map(eq => 
            normalizeEquipment({ ...eq, laboId: d.id, laboratory_id: d.id })
          )
        );
      }

      // Normaliser les TPs
      let normalizedTPs = [];
      if (Array.isArray(tpsRes) && tpsRes.length > 0) {
        normalizedTPs = tpsRes.map(normalizeTP);
        console.log('✅ TPs normalisés:', normalizedTPs.length);
      } else {
        console.warn('⚠️ Aucun TP depuis l\'API - Utilisation données démo');
        normalizedTPs = demoLabs.flatMap(d => 
          (d.tps || []).map(tp => 
            normalizeTP({ ...tp, laboId: d.id, laboratory_id: d.id })
          )
        );
      }

      // Mettre à jour les états
      setLabos(normalizedLabs);
      setEquipements(normalizedEquip);
      setTPs(normalizedTPs);
      setDepartments(Array.isArray(deptRes) ? deptRes : []);
      setImages(Array.isArray(imagesRes) ? imagesRes : []);

      console.log('✅ Chargement terminé avec succès');
      console.log('📊 État final:', {
        labos: normalizedLabs.length,
        equipements: normalizedEquip.length,
        tps: normalizedTPs.length
      });
      
    } catch (err) {
      console.error('❌ Erreur lors du chargement des données:', err);
      setError(err.message || 'Erreur lors du chargement des données');
      
      // Fallback vers les données de démo
      console.log('🔄 Fallback vers les données de démo');
      setLabos(demoLabs);
      setEquipements(demoLabs.flatMap(d => 
        (d.equipements || d.equipments || []).map(eq => ({
          ...eq,
          laboId: d.id,
          laboratory_id: d.id,
          nom: eq.nom || eq.name,
          description: eq.description || eq.details
        }))
      ));
      setTPs(demoLabs.flatMap(d => 
        (d.tps || []).map(tp => ({
          ...tp,
          laboId: d.id,
          laboratory_id: d.id
        }))
      ));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Fonctions CRUD
  const refresh = () => fetchAll();

  const getLaboById = (id) => {
    const labo = labos.find(l => parseInt(l.id) === parseInt(id));
    if (labo) {
      console.log(`🔍 Laboratoire trouvé (ID ${id}):`, labo);
    } else {
      console.warn(`⚠️ Laboratoire non trouvé (ID ${id})`);
    }
    return labo;
  };

  const getEquipementsByLaboId = (laboId) => {
    const equips = equipements.filter(eq => parseInt(eq.laboId) === parseInt(laboId));
    console.log(`🔍 Équipements du labo ${laboId}:`, equips.length, equips);
    return equips;
  };

  const getTPsByLaboId = (laboId) => {
    const tpsFiltered = tps.filter(tp => parseInt(tp.laboId) === parseInt(laboId));
    console.log(`🔍 TPs du labo ${laboId}:`, tpsFiltered.length, tpsFiltered);
    return tpsFiltered;
  };

  // CRUD Laboratoires
  const addLabo = async (labo) => {
    try {
      const created = await apiRequest('/laboratories', { 
        method: 'POST', 
        body: JSON.stringify(labo) 
      });
      setLabos(prev => [...prev, normalizeLaboratory(created)]);
      return created;
    } catch (err) {
      console.error('Erreur création labo:', err);
      const newLabo = { ...labo, id: Date.now() };
      setLabos(prev => [...prev, newLabo]);
      return newLabo;
    }
  };

  const updateLabo = async (id, updatedLabo) => {
    try {
      const updated = await apiRequest(`/laboratories/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify(updatedLabo) 
      });
      setLabos(prev => prev.map(l => (l.id === id ? normalizeLaboratory(updated) : l)));
      return updated;
    } catch (err) {
      console.error('Erreur mise à jour labo:', err);
      setLabos(prev => prev.map(l => (l.id === id ? { ...l, ...updatedLabo } : l)));
      return { ...updatedLabo, id };
    }
  };

  const deleteLabo = async (id) => {
    try {
      await apiRequest(`/laboratories/${id}`, { method: 'DELETE' });
      setLabos(prev => prev.filter(l => l.id !== id));
      setEquipements(prev => prev.filter(eq => eq.laboId !== id));
      setTPs(prev => prev.filter(tp => tp.laboId !== id));
    } catch (err) {
      console.error('Erreur suppression labo:', err);
      setLabos(prev => prev.filter(l => l.id !== id));
    }
  };

  // CRUD Équipements
  const addEquipement = async (equipement) => {
    try {
      const created = await apiRequest('/equipments', { 
        method: 'POST', 
        body: JSON.stringify(equipement) 
      });
      setEquipements(prev => [...prev, normalizeEquipment(created)]);
      return created;
    } catch (err) {
      console.error('Erreur création équipement:', err);
      const newEq = { ...equipement, id: Date.now() };
      setEquipements(prev => [...prev, newEq]);
      return newEq;
    }
  };

  const updateEquipement = async (id, updatedEquipement) => {
    try {
      const updated = await apiRequest(`/equipments/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify(updatedEquipement) 
      });
      setEquipements(prev => prev.map(eq => (eq.id === id ? normalizeEquipment(updated) : eq)));
      return updated;
    } catch (err) {
      console.error('Erreur mise à jour équipement:', err);
      setEquipements(prev => prev.map(eq => (eq.id === id ? { ...eq, ...updatedEquipement } : eq)));
      return { ...updatedEquipement, id };
    }
  };

  const deleteEquipement = async (id) => {
    try {
      await apiRequest(`/equipments/${id}`, { method: 'DELETE' });
      setEquipements(prev => prev.filter(eq => eq.id !== id));
    } catch (err) {
      console.error('Erreur suppression équipement:', err);
      setEquipements(prev => prev.filter(eq => eq.id !== id));
    }
  };

  // CRUD TPs
  const addTP = async (tp) => {
    try {
      const created = await apiRequest('/tps', { 
        method: 'POST', 
        body: JSON.stringify(tp) 
      });
      setTPs(prev => [...prev, normalizeTP(created)]);
      return created;
    } catch (err) {
      console.error('Erreur création TP:', err);
      const newTp = { ...tp, id: Date.now() };
      setTPs(prev => [...prev, newTp]);
      return newTp;
    }
  };

  const updateTP = async (id, updatedTP) => {
    try {
      const updated = await apiRequest(`/tps/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify(updatedTP) 
      });
      setTPs(prev => prev.map(tp => (tp.id === id ? normalizeTP(updated) : tp)));
      return updated;
    } catch (err) {
      console.error('Erreur mise à jour TP:', err);
      setTPs(prev => prev.map(tp => (tp.id === id ? { ...tp, ...updatedTP } : tp)));
      return { ...updatedTP, id };
    }
  };

  const deleteTP = async (id) => {
    try {
      await apiRequest(`/tps/${id}`, { method: 'DELETE' });
      setTPs(prev => prev.filter(tp => tp.id !== id));
    } catch (err) {
      console.error('Erreur suppression TP:', err);
      setTPs(prev => prev.filter(tp => tp.id !== id));
    }
  };

  // Helpers
  const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const getStats = () => ({
    totalLabos: labos.length,
    totalEquipements: equipements.length,
    totalTPs: tps.length
  });

  const value = {
    labos,
    equipements,
    tps,
    departments,
    users,
    images,
    loading,
    error,
    refresh,
    addLabo,
    updateLabo,
    deleteLabo,
    getLaboById,
    addEquipement,
    updateEquipement,
    deleteEquipement,
    getEquipementsByLaboId,
    addTP,
    updateTP,
    deleteTP,
    getTPsByLaboId,
    uploadImage,
    getStats
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};