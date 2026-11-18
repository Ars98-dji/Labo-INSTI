-- Script SQL d'initialisation complète de la base de données INSTI
-- À exécuter avec : mysql -u root -p < init_database.sql

-- Créer la base de données
CREATE DATABASE IF NOT EXISTS insti_labs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE insti_labs;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des départements
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des laboratoires
CREATE TABLE IF NOT EXISTS laboratories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10),
    name VARCHAR(200) NOT NULL,
    title VARCHAR(300),
    description TEXT,
    location VARCHAR(200),
    capacity INT,
    image_url VARCHAR(500),
    chief_name VARCHAR(100),
    chief_title VARCHAR(100),
    chief_photo VARCHAR(500),
    chief_phone VARCHAR(20),
    chief_email VARCHAR(100),
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_department_id (department_id),
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des équipements
CREATE TABLE IF NOT EXISTS equipments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    specifications JSON,
    technical_sheet_url VARCHAR(500),
    acquisition_date TIMESTAMP NULL,
    status VARCHAR(50) DEFAULT 'operational',
    laboratory_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_laboratory_id (laboratory_id),
    INDEX idx_name (name),
    FOREIGN KEY (laboratory_id) REFERENCES laboratories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des TPs
CREATE TABLE IF NOT EXISTS tps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    video_url VARCHAR(500),
    video_type VARCHAR(20) DEFAULT 'youtube',
    duration VARCHAR(20),
    realization_date TIMESTAMP NULL,
    laboratory_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_laboratory_id (laboratory_id),
    INDEX idx_title (title),
    FOREIGN KEY (laboratory_id) REFERENCES laboratories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des images de laboratoires
CREATE TABLE IF NOT EXISTS laboratory_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL,
    caption VARCHAR(200),
    `order` INT DEFAULT 0,
    laboratory_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_laboratory_id (laboratory_id),
    INDEX idx_order (`order`),
    FOREIGN KEY (laboratory_id) REFERENCES laboratories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des logs de modification
CREATE TABLE IF NOT EXISTS modification_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_data JSON,
    new_data JSON,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer l'utilisateur admin par défaut
-- Mot de passe: admin123 (haché avec bcrypt)
INSERT INTO users (username, email, full_name, hashed_password, is_active, is_superuser)
VALUES ('admin', 'admin@insti.edu', 'Administrateur INSTI', 
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5aeUn1NKBMvN6', TRUE, TRUE)
ON DUPLICATE KEY UPDATE email=email;

-- Insérer les départements
INSERT INTO departments (code, name, description) VALUES
('GC', 'Génie Civil', 'Département de Génie Civil'),
('GEI', 'Génie Électrique et Informatique', 'Département de Génie Électrique et Informatique'),
('GE', 'Génie Énergétique', 'Département de Génie Énergétique'),
('GMP', 'Génie Mécanique et Productique', 'Département de Génie Mécanique et Productique'),
('MS', 'Maintenance des Systèmes', 'Département de Maintenance des Systèmes')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insérer les laboratoires
INSERT INTO laboratories (code, name, title, description, image_url, chief_name, chief_title, chief_photo, chief_phone, chief_email, department_id) VALUES
('GC', 'Génie Civil', 'Laboratoire de Génie Civil – INSTI', 
 'Le laboratoire de génie civil de l\'INSTI est un espace dédié aux essais sur les matériaux de construction, aux études géotechniques et au contrôle qualité, afin de garantir la fiabilité des ouvrages et soutenir la recherche en infrastructures durables.',
 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop',
 'M. YESSOUFOU Joslin', 'Responsable du Département', 'https://i.pravatar.cc/150?img=12', '+229 01XXXXXXXX', 'patriko75@gmail.com', 1),

('GEI', 'Génie Électrique et Informatique', 'Laboratoire de Génie Électrique et Informatique – INSTI',
 'Le laboratoire de Génie Électrique et Informatique est dédié aux études sur les systèmes électriques, l\'automatisation, l\'électronique et l\'informatique appliquée, favorisant l\'innovation dans les réseaux intelligents et les technologies numériques.',
 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
 'Mme DEGUENON Justine', 'Responsable du Département', 'https://i.pravatar.cc/150?img=32', '+229 02XXXXXXXX', 'clarisse.ahissou@insti.edu', 2),

('GE', 'Génie Énergétique', 'Laboratoire de Génie Énergétique – INSTI',
 'Le laboratoire de Génie Énergétique est consacré aux études sur la conversion, le stockage et l\'efficacité énergétique, incluant les énergies renouvelables et les systèmes thermiques.',
 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=400&fit=crop',
 'M. DJOSSOU Armand', 'Responsable du Département', 'https://i.pravatar.cc/150?img=45', '+229 03XXXXXXXX', 'rodrigue.hountondji@insti.edu', 3),

('GMP', 'Génie Mécanique et Productique', 'Laboratoire de Génie Mécanique et Productique – INSTI',
 'Étude des matériaux, conception mécanique, usinage et fabrication assistée par ordinateur.',
 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop',
 'M. HINVI AMOUSSOU Laurent', 'Responsable du Département', 'https://i.pravatar.cc/150?img=56', '+229 04XXXXXXXX', 'firmin.dossou@insti.edu', 4),

('MS', 'Maintenance des Systèmes', 'Laboratoire de Maintenance des Systèmes – INSTI',
 'Diagnostic, entretien et fiabilité des systèmes industriels et informatiques.',
 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
 'M. ADAMOU David', 'Responsable du Département', 'https://i.pravatar.cc/150?img=67', '+229 05XXXXXXXX', 'mireille.tchibozo@insti.edu', 5);

-- Insérer les images des laboratoires
INSERT INTO laboratory_images (laboratory_id, image_url, `order`) VALUES
(1, 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop', 0),
(1, 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop', 1),
(2, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop', 0),
(3, 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=400&fit=crop', 0),
(3, 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=600&h=400&fit=crop', 1),
(4, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop', 0),
(5, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop', 0),
(5, 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop', 1);

-- Insérer les équipements pour le laboratoire GC
INSERT INTO equipments (name, description, image_url, specifications, laboratory_id) VALUES
('Presse hydraulique', 
 'Capacité 3000 kN pour essais sur béton et matériaux de construction',
 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
 JSON_OBJECT('marque', 'Controls Group', 'modele', 'Automax 5', 'capacite', '3000 kN', 'precision', '± 0.5%', 'anneeMiseEnService', '2019'),
 1),

('Los Angeles',
 'Machine d\'essai d\'usure par frottement des granulats',
 'https://images.unsplash.com/photo-1581092160607-ee67e8e0e8f1?w=400&h=400&fit=crop',
 JSON_OBJECT('marque', 'Matest', 'modele', 'C.097', 'vitesse', '30-33 tr/min', 'anneeMiseEnService', '2020'),
 1),

('Tamiseuse numérique',
 'Analyse granulométrique automatique des matériaux',
 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=400&h=400&fit=crop',
 JSON_OBJECT('marque', 'Retsch', 'modele', 'AS 200 Digital', 'anneeMiseEnService', '2021'),
 1);

-- Insérer les équipements pour GEI
INSERT INTO equipments (name, description, image_url, specifications, laboratory_id) VALUES
('Oscilloscope numérique',
 'Analyse des signaux électriques jusqu\'à 200 MHz',
 'https://images.unsplash.com/photo-1581090700227-4c4d1a3d3c3f?w=400&h=400&fit=crop',
 JSON_OBJECT('marque', 'Tektronix', 'modele', 'TBS2000B', 'bandePassante', '200 MHz', 'anneeMiseEnService', '2021'),
 2);

-- Insérer les TPs pour le laboratoire GC
INSERT INTO tps (title, description, video_url, duration, laboratory_id) VALUES
('Essai de compression sur béton',
 'Détermination de la résistance à la compression des éprouvettes de béton selon les normes en vigueur',
 'https://www.youtube.com/embed/0MdbFcplyWA',
 '5:23',
 1),

('Analyse granulométrique',
 'Détermination de la courbe granulométrique des granulats par tamisage',
 'https://www.youtube.com/embed/p8QOW65lXYg',
 '4:15',
 1),

('Essai Los Angeles',
 'Mesure de la résistance à l\'usure des granulats par chocs et abrasion',
 'https://www.youtube.com/embed/fXZj-V5qbh0',
 '3:45',
 1);

-- Insérer les TPs pour GEI
INSERT INTO tps (title, description, video_url, duration, laboratory_id) VALUES
('Étude des circuits logiques',
 'Analyse et réalisation de circuits combinatoires et séquentiels',
 'https://www.youtube.com/embed/9vKqVkMQHKk',
 '6:10',
 2);

-- Afficher un résumé
SELECT '✅ Base de données initialisée avec succès!' AS Status;
SELECT COUNT(*) AS 'Nombre de départements' FROM departments;
SELECT COUNT(*) AS 'Nombre de laboratoires' FROM laboratories;
SELECT COUNT(*) AS 'Nombre d\'équipements' FROM equipments;
SELECT COUNT(*) AS 'Nombre de TPs' FROM tps;