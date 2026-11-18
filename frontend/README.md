cd insti-site
npm install
cp .env.example .env && éditer (REACT_APP_API_BASE=http://localhost:8000/api/v1)

# Optionnel : utiliser des données de démonstration locales (dev)
# Définir `REACT_APP_USE_DEMO_DATA=true` dans `.env` pour forcer l'application à
# utiliser les données statiques fournies dans `src/data/demoLabs.js` (utile lors du
# développement sans backend disponible).

npm run start (ou npm run build + serve -s build en prod)