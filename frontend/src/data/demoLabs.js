// src/data/demoLabs.js
// Données de démonstration pour les 5 laboratoires de l'INSTI

export const demoLabs = [
  {
    id: 1,
    code: 'GC',
    nom: 'Génie Civil',
    titre: 'Laboratoire de Génie Civil – INSTI',
    description: '...',
    images: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e'
    ],
    chef: {
      nom: 'M. YESSOUFOU Joslin',
      titre: 'Responsable du Département'
    },
    equipements: [
      {
        id: 1,
        nom: 'Presse hydraulique',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837',
        description: 'Capacité 3000 kN',
        specifications: {
          marque: 'Controls Group',
          capacite: '3000 kN'
        }
      }
    ],
    tps: [
      {
        id: 1,
        titre: 'Essai de compression',
        description: 'Essai béton',
        videoUrl: 'https://www.youtube.com/embed/0MdbFcplyWA'
      }
    ]
  },

  {
    id: 2,
    code: 'GEI',
    nom: 'Génie Électrique et Informatique',
    titre: 'Laboratoire GEI – INSTI',
    description: '...',
    images: [],
    chef: {},
    equipements: [
      {
        id: 2,
        nom: 'Oscilloscope',
        image: '',
        description: 'Analyse signaux'
      }
    ],
    tps: []
  }
];

export default demoLabs;
