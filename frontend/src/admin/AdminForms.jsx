// src/admin/AdminForms.jsx
import React, { useState } from 'react';
import { useData } from './DataContext';
import './AdminForms.css';

// ============================================================================
// FORMULAIRE LABORATOIRE
// ============================================================================
export const LaboForm = ({ item, onClose, onSave }) => {
  const { uploadImage } = useData();
  
  const [formData, setFormData] = useState(item ? {
    code: item.code || '',
    name: item.nom || item.name || '',
    title: item.titre || item.title || '',
    description: item.description || '',
    location: item.location || '',
    capacity: item.capacity || '',
    image_url: item.image || item.image_url || '',
    chief_name: item.chef?.nom || item.chief_name || '',
    chief_title: item.chef?.titre || item.chief_title || '',
    chief_photo: item.chef?.photo || item.chief_photo || '',
    chief_phone: item.chef?.telephone || item.chief_phone || '',
    chief_email: item.chef?.email || item.chief_email || '',
  } : {
    code: '',
    name: '',
    title: '',
    description: '',
    location: '',
    capacity: '',
    image_url: '',
    chief_name: '',
    chief_title: '',
    chief_photo: '',
    chief_phone: '',
    chief_email: '',
  });

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const imageUrl = await uploadImage(file);
        setFormData({ ...formData, image_url: imageUrl });
      } catch (error) {
        console.error('Erreur upload image:', error);
        alert('Erreur lors de l\'upload de l\'image');
      }
      setUploading(false);
    }
  };

  const handleChefPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const photoUrl = await uploadImage(file);
        setFormData({ ...formData, chief_photo: photoUrl });
      } catch (error) {
        console.error('Erreur upload photo chef:', error);
        alert('Erreur lors de l\'upload de la photo');
      }
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('📤 Envoi données laboratoire:', formData);
    
    // Validation
    if (!formData.code || !formData.name) {
      alert('Le code et le nom sont obligatoires');
      return;
    }

    // Convertir capacity en nombre si nécessaire
    const dataToSend = {
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity) : null
    };

    onSave(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-body">
        <div className="form-section">
          <h3>Informations générales</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                placeholder="Ex: GC"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Nom *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Génie Civil"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Titre complet</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Laboratoire de Génie Civil – INSTI"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="4"
              placeholder="Description du laboratoire..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Localisation</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Ex: Bâtiment A - Étage 2"
              />
            </div>

            <div className="form-group">
              <label>Capacité</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                placeholder="Ex: 30"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image principale (URL)</label>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              placeholder="https://images.unsplash.com/..."
            />
            <small className="form-hint">Ou uploadez une image ci-dessous</small>
            <div className="image-upload-simple">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="lab-image"
                style={{ display: 'none' }}
              />
              <label htmlFor="lab-image" className="btn-upload">
                📷 Choisir une image
              </label>
              {formData.image_url && (
                <img src={formData.image_url} alt="Preview" className="image-preview-small" />
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Chef de département</h3>
          
          <div className="form-group">
            <label>Photo du responsable (URL)</label>
            <input
              type="text"
              value={formData.chief_photo}
              onChange={(e) => setFormData({...formData, chief_photo: e.target.value})}
              placeholder="https://i.pravatar.cc/150?img=12"
            />
            <small className="form-hint">Ou uploadez une photo ci-dessous</small>
            <div className="image-upload-simple">
              <input
                type="file"
                accept="image/*"
                onChange={handleChefPhotoUpload}
                id="chef-photo"
                style={{ display: 'none' }}
              />
              <label htmlFor="chef-photo" className="btn-upload">
                👤 Choisir une photo
              </label>
              {formData.chief_photo && (
                <img src={formData.chief_photo} alt="Chef" className="image-preview-small round" />
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Nom complet</label>
            <input
              type="text"
              value={formData.chief_name}
              onChange={(e) => setFormData({...formData, chief_name: e.target.value})}
              placeholder="Ex: M. KOUDONGNON Patrice"
            />
          </div>

          <div className="form-group">
            <label>Titre/Fonction</label>
            <input
              type="text"
              value={formData.chief_title}
              onChange={(e) => setFormData({...formData, chief_title: e.target.value})}
              placeholder="Ex: Responsable du Département"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Téléphone</label>
              <input
                type="tel"
                value={formData.chief_phone}
                onChange={(e) => setFormData({...formData, chief_phone: e.target.value})}
                placeholder="+229 01XXXXXXXX"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.chief_email}
                onChange={(e) => setFormData({...formData, chief_email: e.target.value})}
                placeholder="exemple@insti.edu"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn-cancel" onClick={onClose}>
          Annuler
        </button>
        <button type="submit" className="btn-save" disabled={uploading}>
          {uploading ? 'Upload en cours...' : item ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
};

// ============================================================================
// FORMULAIRE ÉQUIPEMENT
// ============================================================================
export const EquipementForm = ({ item, onClose, onSave }) => {
  const { labos, uploadImage } = useData();
  
  const [formData, setFormData] = useState(item ? {
    laboratory_id: item.laboId || item.laboratory_id || '',
    name: item.nom || item.name || '',
    description: item.description || item.details || '',
    image_url: item.image || item.image_url || '',
    specifications: item.specifications || {},
  } : {
    laboratory_id: '',
    name: '',
    description: '',
    image_url: '',
    specifications: {},
  });

  const [uploading, setUploading] = useState(false);
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const imageUrl = await uploadImage(file);
        setFormData({ ...formData, image_url: imageUrl });
      } catch (error) {
        console.error('Erreur upload image:', error);
        alert('Erreur lors de l\'upload de l\'image');
      }
      setUploading(false);
    }
  };

  const addSpecification = () => {
    if (specKey && specValue) {
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [specKey]: specValue
        }
      });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData({ ...formData, specifications: newSpecs });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('📤 Envoi données équipement:', formData);
    
    // Validation
    if (!formData.laboratory_id || !formData.name) {
      alert('Le laboratoire et le nom sont obligatoires');
      return;
    }

    // Convertir laboratory_id en nombre
    const dataToSend = {
      ...formData,
      laboratory_id: parseInt(formData.laboratory_id)
    };

    onSave(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-body">
        <div className="form-group">
          <label>Laboratoire *</label>
          <select
            value={formData.laboratory_id}
            onChange={(e) => setFormData({...formData, laboratory_id: e.target.value})}
            required
          >
            <option value="">Sélectionner un laboratoire</option>
            {labos.map(labo => (
              <option key={labo.id} value={labo.id}>
                {labo.code} - {labo.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Nom de l'équipement *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Ex: Presse hydraulique"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="3"
            placeholder="Description de l'équipement..."
          />
        </div>

        <div className="form-group">
          <label>Image (URL)</label>
          <input
            type="text"
            value={formData.image_url}
            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            placeholder="https://images.unsplash.com/..."
          />
          <small className="form-hint">Ou uploadez une image ci-dessous</small>
          <div className="image-upload-simple">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              id="equip-image"
              style={{ display: 'none' }}
            />
            <label htmlFor="equip-image" className="btn-upload">
              📷 Choisir une image
            </label>
            {formData.image_url && (
              <img src={formData.image_url} alt="Preview" className="image-preview-small" />
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Spécifications techniques</label>
          <div className="spec-input-group">
            <input
              type="text"
              value={specKey}
              onChange={(e) => setSpecKey(e.target.value)}
              placeholder="Nom (ex: marque)"
              className="spec-key"
            />
            <input
              type="text"
              value={specValue}
              onChange={(e) => setSpecValue(e.target.value)}
              placeholder="Valeur (ex: Siemens)"
              className="spec-value"
            />
            <button type="button" onClick={addSpecification} className="btn-add-spec">
              ➕
            </button>
          </div>
          
          {Object.keys(formData.specifications).length > 0 && (
            <div className="specs-list">
              {Object.entries(formData.specifications).map(([key, value]) => (
                <div key={key} className="spec-item">
                  <strong>{key}:</strong> {value}
                  <button
                    type="button"
                    onClick={() => removeSpecification(key)}
                    className="btn-remove-spec"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn-cancel" onClick={onClose}>
          Annuler
        </button>
        <button type="submit" className="btn-save" disabled={uploading}>
          {uploading ? 'Upload...' : item ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
};

// ============================================================================
// FORMULAIRE TP
// ============================================================================
export const TPForm = ({ item, onClose, onSave }) => {
  const { labos } = useData();
  
  const [formData, setFormData] = useState(item ? {
    laboratory_id: item.laboId || item.laboratory_id || '',
    title: item.titre || item.title || '',
    description: item.description || '',
    video_url: item.videoUrl || item.video_url || item.video || '',
    duration: item.duree || item.duration || '',
    realization_date: item.dateRealisation || item.realization_date || '',
  } : {
    laboratory_id: '',
    title: '',
    description: '',
    video_url: '',
    duration: '',
    realization_date: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('📤 Envoi données TP:', formData);
    
    // Validation
    if (!formData.laboratory_id || !formData.title) {
      alert('Le laboratoire et le titre sont obligatoires');
      return;
    }

    // Convertir laboratory_id en nombre
    const dataToSend = {
      ...formData,
      laboratory_id: parseInt(formData.laboratory_id),
      // Convertir la date si elle existe
      realization_date: formData.realization_date || null
    };

    onSave(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-body">
        <div className="form-group">
          <label>Laboratoire *</label>
          <select
            value={formData.laboratory_id}
            onChange={(e) => setFormData({...formData, laboratory_id: e.target.value})}
            required
          >
            <option value="">Sélectionner un laboratoire</option>
            {labos.map(labo => (
              <option key={labo.id} value={labo.id}>
                {labo.code} - {labo.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Titre du TP *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Ex: Essai de compression sur béton"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="3"
            placeholder="Description du TP..."
          />
        </div>

        <div className="form-group">
          <label>URL de la vidéo YouTube</label>
          <input
            type="text"
            value={formData.video_url}
            onChange={(e) => setFormData({...formData, video_url: e.target.value})}
            placeholder="https://www.youtube.com/embed/..."
          />
          <small className="form-hint">
            Format: https://www.youtube.com/embed/VIDEO_ID
          </small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Durée</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              placeholder="Ex: 5:23"
            />
          </div>

          <div className="form-group">
            <label>Date de réalisation</label>
            <input
              type="date"
              value={formData.realization_date}
              onChange={(e) => setFormData({...formData, realization_date: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn-cancel" onClick={onClose}>
          Annuler
        </button>
        <button type="submit" className="btn-save">
          {item ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
};