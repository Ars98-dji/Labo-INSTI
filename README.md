# 🎓 Labo INSTI — Plateforme de gestion des laboratoires pédagogiques

Application web complète pour présenter et gérer les laboratoires pédagogiques de l'**INSTI** :
départements, laboratoires, équipements, travaux pratiques (TP) et galeries photos.

- **Frontend** : React 19 + React Router + Bootstrap 5
- **Backend** : FastAPI + SQLAlchemy + MySQL
- **Authentification** : JWT (bcrypt) — endpoints disponibles, CRUD public en mode développement

---

## 📑 Sommaire

- [Aperçu](#-aperçu)
- [Structure du projet](#-structure-du-projet)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
  - [1. Cloner le dépôt](#1-cloner-le-dépôt)
  - [2. Base de données MySQL](#2-base-de-données-mysql)
  - [3. Backend (API)](#3-backend-api)
  - [4. Frontend (interface)](#4-frontend-interface)
- [Variables d'environnement](#-variables-denvironnement)
- [Accès à l'application](#-accès-à-lapplication)
- [API — endpoints disponibles](#-api--endpoints-disponibles)
- [Dépannage](#-dépannage)
- [Sécurité et limites connues](#-sécurité-et-limites-connues)

---

## 🔎 Aperçu

| Page | URL | Description |
|------|-----|-------------|
| Accueil | `/` | Liste des laboratoires de l'INSTI |
| Détail d'un laboratoire | `/labo/:id` | Équipements, fiches techniques et vidéos de TP |
| Présentation | `/presentation` | Histoire, mission, statut UNSTIM, campus et coordonnées |
| Formations | `/formations` | Les 5 filières, leurs spécialités et débouchés |
| Actualités | `/actualites` | Étapes marquantes et lien vers les actualités officielles |
| Vie académique | `/vie-academique` | Clubs, calendrier, bourses, orientation |
| Recherches & coopérations | `/recherches` | LaPIT, laboratoires pédagogiques et partenariats |
| Administration | `/admin` | Connexion, tableau de bord et CRUD (laboratoires, équipements, TP) |

Le frontend peut fonctionner **sans backend** grâce aux données de démonstration locales
(`frontend/src/data/demoLabs.js`) : mettez `REACT_APP_USE_DEMO_DATA=true` dans `frontend/.env`.

---

## 📂 Structure du projet

```
Labo-INSTI/
├── backend/                  # API FastAPI
│   ├── main.py               # Application, routes et authentification
│   ├── models.py             # Modèles SQLAlchemy
│   ├── schemas.py            # Schémas Pydantic
│   ├── crud.py               # Accès aux données
│   ├── database.py           # Connexion MySQL (lit DATABASE_URL)
│   ├── init_db.py            # Création des tables + données de démo
│   ├── init_database.sql     # Script SQL équivalent (tables + jeu de données)
│   ├── requirements.txt      # Dépendances Python
│   ├── install.sh            # Installation automatique (Ubuntu)
│   ├── uploads/              # Fichiers uploadés (ignoré par git)
│   └── .env.example          # Modèle de configuration
├── frontend/                 # Application React
│   ├── public/               # Images, logos, index.html
│   ├── src/
│   │   ├── components/       # Navbar, Footer, pages publiques
│   │   ├── admin/            # Dashboard, formulaires, contexte API
│   │   └── data/             # Données de démonstration
│   ├── package.json
│   └── .env.example          # Modèle de configuration
├── TODO.md
└── README.md
```

> Les dossiers `node_modules/`, `venv/`, `build/`, `__pycache__/` et les fichiers `.env`
> ne sont **pas** versionnés : ils sont recréés à l'installation.

---

## ✅ Prérequis

| Outil | Version conseillée | Vérification |
|-------|--------------------|--------------|
| Node.js | 18 ou 20+ | `node -v` |
| npm | 9+ | `npm -v` |
| Python | 3.10+ | `python3 --version` |
| MySQL | 8+ (ou MariaDB 10.6+) | `mysql --version` |
| Git | — | `git --version` |

---

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/Ars98-dji/Labo-INSTI.git
cd Labo-INSTI
```

### 2. Base de données MySQL

Créez la base et un utilisateur dédié :

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE IF NOT EXISTS insti_labs
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'insti_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON insti_labs.* TO 'insti_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

> Vous pouvez aussi tout créer d'un coup avec le script fourni :
> `mysql -u root -p < backend/init_database.sql`

### 3. Backend (API)

```bash
cd backend

# Environnement virtuel Python
python3 -m venv venv
source venv/bin/activate        # Windows : venv\Scripts\activate

# Dépendances
pip install --upgrade pip
pip install -r requirements.txt

# Configuration
cp .env.example .env
# → éditez .env et renseignez DATABASE_URL :
#   mysql+pymysql://insti_user:votre_mot_de_passe@localhost:3306/insti_labs

# Création des tables + données de démonstration
python init_db.py

# Lancement du serveur (rechargement automatique)
python main.py
```

L'API répond sur **http://localhost:8000** et la documentation interactive sur
**http://localhost:8000/docs**.

> Le script `backend/install.sh` automatise l'installation complète sur Ubuntu
> (MySQL, Python, Node, `.env`), mais part du principe que le projet se trouve dans
> `~/insti-project`. Préférez les étapes manuelles ci-dessus pour un clone Git classique.

### 4. Frontend (interface)

Dans un **second terminal** :

```bash
cd frontend

npm ci              # installation reproductible (ou `npm install`)

cp .env.example .env
# → vérifiez REACT_APP_API_BASE=http://localhost:8000/api/v1

npm start
```

Le site s'ouvre sur **http://localhost:3000**.

Pour un build de production :

```bash
npm run build       # génère frontend/build/
```

---

## 🔐 Variables d'environnement

Les fichiers `.env` sont ignorés par Git. Utilisez les modèles `.env.example`.

### `backend/.env`

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `DATABASE_URL` | ✅ | Chaîne de connexion MySQL (`mysql+pymysql://user:pass@host:3306/insti_labs`) |
| `SECRET_KEY` | recommandé | Clé de signature JWT — à brancher dans `main.py` pour la production |
| `ALGORITHM` | non | Algorithme JWT (défaut `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | non | Durée de validité du token (défaut `30`) |
| `DEBUG` | non | Mode debug |
| `CORS_ORIGINS` | non | Origines autorisées, séparées par des virgules |

Générer une clé solide : `openssl rand -hex 32`

### `frontend/.env`

| Variable | Description |
|----------|-------------|
| `REACT_APP_API_BASE` | URL de base de l'API (défaut `http://localhost:8000/api/v1`) |
| `REACT_APP_USE_DEMO_DATA` | `true` pour utiliser les données locales sans backend |

> Après toute modification d'un `.env`, **redémarrez** le serveur (`npm start` / `python main.py`).

---

## 🌐 Accès à l'application

| Service | URL |
|---------|-----|
| Site public | http://localhost:3000 |
| Administration | http://localhost:3000/admin |
| API | http://localhost:8000 |
| Documentation API (Swagger) | http://localhost:8000/docs |

La page `/admin` demande ces identifiants. **Compte administrateur créé par `init_db.py` :**

```
Nom d'utilisateur : admin
Mot de passe      : admin123
```

> ⚠️ Changez ce mot de passe avant toute mise en ligne.

---

## 🔌 API — endpoints disponibles

Base : `/api/v1`

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/token` | Connexion (formulaire OAuth2), renvoie un JWT |
| `POST` | `/register` | Création d'un utilisateur |
| `GET` | `/departments` | Liste des départements |
| `POST` | `/departments` | Créer un département |
| `GET` | `/laboratories` | Liste des laboratoires |
| `GET` | `/laboratories/{id}` | Détail d'un laboratoire |
| `POST` | `/laboratories` | Créer un laboratoire |
| `PUT` | `/laboratories/{id}` | Modifier un laboratoire |
| `DELETE` | `/laboratories/{id}` | Supprimer un laboratoire |
| `GET` | `/equipments` | Liste des équipements |
| `GET` | `/equipments/{id}` | Détail d'un équipement |
| `POST` | `/equipments` | Créer un équipement |
| `PUT` | `/equipments/{id}` | Modifier un équipement |
| `DELETE` | `/equipments/{id}` | Supprimer un équipement |
| `GET` | `/tps` | Liste des TP |
| `GET` | `/tps/{id}` | Détail d'un TP |
| `POST` | `/tps` | Créer un TP |
| `PUT` | `/tps/{id}` | Modifier un TP |
| `DELETE` | `/tps/{id}` | Supprimer un TP |
| `GET` | `/laboratory-images` | Galerie d'images des laboratoires |
| `POST` | `/laboratory-images` | Ajouter une image |
| `POST` | `/upload` | Upload d'un fichier (retourne son URL) |
| `GET` | `/stats` | Compteurs (laboratoires, équipements, TP, départements) |

---

## 🛠️ Dépannage

| Symptôme | Cause probable / solution |
|----------|---------------------------|
| `Can't connect to MySQL server` | MySQL n'est pas démarré : `sudo systemctl start mysql` |
| `Access denied for user` | `DATABASE_URL` incorrect dans `backend/.env` |
| `Unknown database 'insti_labs'` | Créez la base (étape 2) puis relancez `python init_db.py` |
| Page blanche / données absentes | Backend non lancé, ou `REACT_APP_USE_DEMO_DATA=false` sans API disponible |
| Erreur CORS dans la console | Vérifiez que le frontend tourne sur `localhost:3000` et l'API sur `localhost:8000` |
| `Module not found` (Python) | Activez le venv : `source backend/venv/bin/activate` |
| Port déjà utilisé | Changez le port (`npm start` → `PORT=3001 npm start`, backend → `uvicorn main:app --port 8001`) |

---

## 🔒 Sécurité et limites connues

- Les routes d'écriture (`POST`, `PUT`, `DELETE`, y compris `/upload`) exigent un **token JWT**
  valide (`Authorization: Bearer <token>`). Les routes de lecture restent publiques.
- Pour obtenir un token, connectez-vous sur http://localhost:8000/docs (bouton **Authorize**)
  ou via `curl` :

  ```bash
  curl -X POST http://localhost:8000/api/v1/token \
    -d "username=admin&password=admin123"
  ```

  L'interface `/admin` affiche automatiquement un **écran de connexion** si aucun token
  n'est présent. Après connexion, le token est stocké dans `localStorage` (clé `token`)
  et ajouté à chaque requête ; le bouton **Déconnexion** le supprime.

- La `SECRET_KEY` JWT est **codée en dur** dans `main.py` : externalisez-la via `.env`.
- Le compte `admin` / `admin123` est un compte de démonstration.
- Les fichiers `.env` et d'uploads ne doivent jamais être commités (déjà couvert par `.gitignore`).

---

## 📝 Licence

Projet pédagogique réalisé pour l'INSTI. Ajoutez une licence explicite si le dépôt doit être réutilisé.
