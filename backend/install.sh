#!/bin/bash

# Script d'installation automatique pour le projet INSTI
# Usage: chmod +x install.sh && ./install.sh

set -e  # Arrêter en cas d'erreur

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

# Vérifier si le script est exécuté avec sudo pour certaines commandes
check_sudo() {
    if [ "$EUID" -eq 0 ]; then 
        print_warning "Ne lancez pas ce script avec sudo. Il demandera les permissions quand nécessaire."
        exit 1
    fi
}

# Vérifier la distribution
check_distribution() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        if [ "$ID" != "ubuntu" ]; then
            print_warning "Ce script est conçu pour Ubuntu. Votre distribution: $ID"
            read -p "Voulez-vous continuer quand même? (y/n) " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        fi
    fi
}

# Installation de MySQL
install_mysql() {
    print_header "Installation de MySQL"
    
    if command -v mysql &> /dev/null; then
        print_success "MySQL est déjà installé"
        mysql --version
    else
        print_info "Installation de MySQL Server..."
        sudo apt update
        sudo apt install -y mysql-server
        sudo systemctl start mysql
        sudo systemctl enable mysql
        print_success "MySQL installé et démarré"
    fi
}

# Configuration de la base de données
setup_database() {
    print_header "Configuration de la base de données"
    
    read -p "Nom d'utilisateur MySQL (défaut: insti_user): " DB_USER
    DB_USER=${DB_USER:-insti_user}
    
    read -sp "Mot de passe MySQL pour $DB_USER: " DB_PASSWORD
    echo
    
    if [ -z "$DB_PASSWORD" ]; then
        print_error "Le mot de passe ne peut pas être vide"
        exit 1
    fi
    
    print_info "Création de la base de données et de l'utilisateur..."
    
    sudo mysql -u root <<EOF
CREATE DATABASE IF NOT EXISTS insti_labs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON insti_labs.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF
    
    if [ $? -eq 0 ]; then
        print_success "Base de données créée avec succès"
    else
        print_error "Erreur lors de la création de la base de données"
        exit 1
    fi
}

# Installation de Python et dépendances
install_python() {
    print_header "Installation de Python et pip"
    
    if command -v python3 &> /dev/null; then
        print_success "Python3 est déjà installé"
        python3 --version
    else
        print_info "Installation de Python3..."
        sudo apt install -y python3 python3-pip python3-venv
        print_success "Python3 installé"
    fi
}

# Configuration du backend
setup_backend() {
    print_header "Configuration du Backend"
    
    BACKEND_DIR="$HOME/insti-project/backend"
    
    print_info "Création du dossier backend: $BACKEND_DIR"
    mkdir -p "$BACKEND_DIR"
    cd "$BACKEND_DIR"
    
    # Créer l'environnement virtuel
    print_info "Création de l'environnement virtuel Python..."
    python3 -m venv venv
    source venv/bin/activate
    
    # Installer les dépendances
    print_info "Installation des dépendances Python..."
    pip install --upgrade pip
    
    # Créer requirements.txt s'il n'existe pas
    if [ ! -f requirements.txt ]; then
        cat > requirements.txt <<EOF
fastapi==0.109.0
uvicorn[standard]==0.27.0
sqlalchemy==2.0.25
pymysql==1.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
python-dotenv==1.0.0
pydantic==2.5.3
pydantic-settings==2.1.0
email-validator==2.1.0
EOF
    fi
    
    pip install -r requirements.txt
    print_success "Dépendances installées"
    
    # Créer le fichier .env
    print_info "Création du fichier .env..."
    SECRET_KEY=$(openssl rand -hex 32)
    
    cat > .env <<EOF
DATABASE_URL=mysql+pymysql://$DB_USER:$DB_PASSWORD@localhost:3306/insti_labs
SECRET_KEY=$SECRET_KEY
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
EOF
    
    print_success "Fichier .env créé"
    
    # Créer le dossier uploads
    mkdir -p uploads
    
    print_success "Backend configuré dans: $BACKEND_DIR"
}

# Initialiser la base de données
init_database() {
    print_header "Initialisation de la base de données"
    
    cd "$HOME/insti-project/backend"
    source venv/bin/activate
    
    if [ -f init_db.py ]; then
        print_info "Exécution du script d'initialisation..."
        python init_db.py
        print_success "Base de données initialisée"
    else
        print_warning "init_db.py non trouvé. Veuillez copier les fichiers Python dans le dossier backend."
    fi
}

# Installation de Node.js
install_nodejs() {
    print_header "Installation de Node.js"
    
    if command -v node &> /dev/null; then
        print_success "Node.js est déjà installé"
        node --version
        npm --version
    else
        print_info "Installation de Node.js 20.x..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt install -y nodejs
        print_success "Node.js installé"
        node --version
        npm --version
    fi
}

# Afficher le résumé
show_summary() {
    print_header "Installation terminée !"
    
    echo -e "${GREEN}✅ Tout est installé avec succès !${NC}\n"
    
    echo -e "${BLUE}📊 Résumé de l'installation:${NC}"
    echo -e "   • MySQL: Installé et configuré"
    echo -e "   • Base de données: insti_labs"
    echo -e "   • Utilisateur MySQL: $DB_USER"
    echo -e "   • Backend: $HOME/insti-project/backend"
    echo -e "   • Python: $(python3 --version)"
    echo -e "   • Node.js: $(node --version)"
    
    echo -e "\n${BLUE}🚀 Prochaines étapes:${NC}"
    echo -e "   1. Copiez les fichiers Python (main.py, models.py, etc.) dans:"
    echo -e "      ${YELLOW}$HOME/insti-project/backend${NC}"
    
    echo -e "\n   2. Lancez le backend:"
    echo -e "      ${YELLOW}cd $HOME/insti-project/backend${NC}"
    echo -e "      ${YELLOW}source venv/bin/activate${NC}"
    echo -e "      ${YELLOW}python main.py${NC}"
    
    echo -e "\n   3. Accédez à l'API:"
    echo -e "      ${YELLOW}http://localhost:8000${NC}"
    echo -e "      ${YELLOW}http://localhost:8000/docs${NC} (Documentation)"
    
    echo -e "\n${BLUE}🔐 Informations de connexion admin:${NC}"
    echo -e "   • Username: ${YELLOW}admin${NC}"
    echo -e "   • Password: ${YELLOW}admin123${NC}"
    echo -e "   ${RED}⚠ Changez ce mot de passe en production !${NC}"
    
    echo -e "\n${BLUE}📝 Fichiers de configuration:${NC}"
    echo -e "   • Backend .env: ${YELLOW}$HOME/insti-project/backend/.env${NC}"
    
    echo -e "\n${GREEN}Bon développement ! 🎓${NC}\n"
}

# Fonction principale
main() {
    clear
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║                                                        ║"
    echo "║     🎓 INSTI - Installation automatique 🎓            ║"
    echo "║                                                        ║"
    echo "║     Système de gestion des laboratoires               ║"
    echo "║                                                        ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
    
    check_sudo
    check_distribution
    
    print_info "Début de l'installation...\n"
    sleep 2
    
    # Mise à jour du système
    print_header "Mise à jour du système"
    sudo apt update
    print_success "Système mis à jour"
    
    # Installations
    install_mysql
    setup_database
    install_python
    setup_backend
    init_database
    install_nodejs
    
    # Résumé
    show_summary
}

# Exécuter le script
main