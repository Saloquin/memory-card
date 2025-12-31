# 🎴 Memory Card API

> API RESTful de gestion de flashcards avec système de répétition espacée pour optimiser l'apprentissage

[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3.x-blue.svg)](https://www.sqlite.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-0.44-orange.svg)](https://orm.drizzle.team/)

---

## 📋 Table des Matières

- [À Propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Tests](#-tests)
- [API Documentation](#-api-documentation)
- [Système de Répétition Espacée](#-système-de-répétition-espacée)
- [Structure du Projet](#-structure-du-projet)
- [Technologies](#-technologies)
- [Auteurs](#-auteurs)

---

## 🎯 À Propos

Memory Card API est une application backend complète permettant de créer, gérer et réviser des collections de flashcards selon la méthode scientifique de **répétition espacée**. Cette méthode optimise la mémorisation en proposant les cartes au moment optimal pour maximiser la rétention à long terme.

### Points Clés

- 🔐 **Authentification JWT sécurisée**
- 📚 **Collections publiques et privées**
- 🎴 **Flashcards avec médias (URLs)**
- 🔄 **Système de répétition espacée (5 niveaux)**
- 👥 **Gestion multi-utilisateurs**
- 🛡️ **Permissions et contrôle d'accès**
- ✅ **Suite de tests automatisés complète**

---

## ✨ Fonctionnalités

### Authentification
- ✅ Inscription utilisateur avec hash bcrypt
- ✅ Connexion avec génération de token JWT
- ✅ Système de rôles (utilisateur standard / administrateur)

### Gestion des Collections
- ✅ Création de collections (titre, description, visibilité)
- ✅ Collections publiques accessibles à tous
- ✅ Collections privées (propriétaire uniquement)
- ✅ Recherche de collections publiques
- ✅ Modification et suppression (propriétaire uniquement)

### Gestion des Flashcards
- ✅ Création de cartes avec recto/verso
- ✅ Support d'URLs pour images/liens
- ✅ Association aux collections
- ✅ Modification et suppression sécurisées

### Système de Révision
- ✅ Récupération automatique des cartes à réviser
- ✅ Calcul dynamique de la prochaine révision
- ✅ 5 niveaux de répétition espacée (1, 2, 4, 8, 16 jours)
- ✅ Progression personnalisée par utilisateur
- ✅ Historique des révisions

### Administration
- ✅ Gestion des utilisateurs (admin uniquement)
- ✅ Suppression d'utilisateurs avec cascade
- ✅ Statistiques et monitoring

---

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ HTTP/JSON
       │ JWT Auth
┌──────▼──────┐
│   Express   │
│   Routes    │
├─────────────┤
│ Middlewares │
│  • checkToken
│  • checkAdmin
│  • validation
├─────────────┤
│ Controllers │
├─────────────┤
│   Models    │
│   (Zod)     │
├─────────────┤
│  Drizzle    │
│    ORM      │
├─────────────┤
│   SQLite    │
│  Database   │
└─────────────┘
```

---

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** >= 18.0.0 (recommandé: 22.x)
- **npm** >= 9.0.0
- **Git** (pour cloner le projet)

Vérifiez vos versions :

```bash
node --version
npm --version
git --version
```

---

## 🚀 Installation

### 1. Cloner le Projet

```bash
git clone https://github.com/votre-username/memory-card.git
cd memory-card
```

### 2. Installer les Dépendances

```bash
npm install
```

Cette commande installera toutes les dépendances nécessaires listées dans `package.json`.

### 3. Initialiser la Base de Données

```bash
# Créer/mettre à jour le schéma de la base de données
npm run db:push

# Peupler la base avec des données de test
npm run db:seed
```

---

## ⚙️ Configuration

### Variables d'Environnement

Créez un fichier `.env` à la racine du projet :

```env
# Port du serveur
PORT=3000

# Secret JWT (IMPORTANT: Changez cette valeur en production !)
JWT_SECRET=votre_secret_jwt_super_securise_ici

# Base de données SQLite
DATABASE_URL=file:./database.db
```

⚠️ **Sécurité** : Ne commitez JAMAIS votre fichier `.env` sur Git !

### Base de Données

Le projet utilise **SQLite** avec une base de données locale (`database.db`). Aucune configuration serveur n'est nécessaire.

---

## 🎮 Utilisation

### Démarrage en Mode Développement

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000` avec rechargement automatique (nodemon).

### Démarrage en Mode Production

```bash
npm start
```

### Commandes Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur en mode développement avec nodemon |
| `npm start` | Démarre le serveur en mode production |
| `npm test` | Lance les tests automatisés |
| `npm run test:full` | Réinitialise la DB et lance les tests |
| `npm run test:pipeline` | Pipeline complet: schema + seed + tests |
| `npm run db:push` | Met à jour le schéma de la base de données |
| `npm run db:seed` | Peuple la base avec des données de test |
| `npm run db:studio` | Ouvre Drizzle Studio (interface graphique) |

---

## 🧪 Tests

### Exécuter les Tests

Le projet inclut une suite complète de 31 tests automatisés.

```bash
# 1. Démarrer le serveur (terminal 1)
npm run dev

# 2. Lancer les tests (terminal 2)
npm test
```

### Pipeline de Test Complet

Pour réinitialiser la DB et lancer les tests automatiquement :

```bash
# Terminal 1: Serveur
npm run dev

# Terminal 2: Seed + Tests
npm run test:full
```

### Couverture des Tests

- ✅ **Authentification** (6 tests) - Inscription, connexion, gestion des erreurs
- ✅ **Collections** (7 tests) - CRUD, permissions, recherche
- ✅ **Cartes** (5 tests) - CRUD, permissions, validation
- ✅ **Révisions** (6 tests) - Système de répétition espacée
- ✅ **Administration** (5 tests) - Gestion utilisateurs (admin)
- ✅ **Nettoyage** (2 tests) - Suppression ressources

---

## 📚 API Documentation

### Comptes de Test

Après avoir exécuté `npm run db:seed`, utilisez ces comptes :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Admin** | admin@memorycard.com | admin123 |
| **User1** | jean.dupont@example.com | password123 |
| **User2** | marie.martin@example.com | password123 |
| **User3** | pierre.bernard@example.com | password123 |

### Endpoints Principaux

#### 🔐 Authentification

```http
POST /auth/register
POST /auth/login
```

#### 📚 Collections

```http
GET    /collections/user/              # Mes collections
GET    /collections/public/:query      # Rechercher collections publiques
POST   /collections/                   # Créer une collection
GET    /collections/:id                # Détails d'une collection
PUT    /collections/:id                # Modifier une collection
DELETE /collections/:id                # Supprimer une collection
```

#### 🎴 Cartes

```http
POST   /cards/                         # Créer une carte
GET    /cards/:id                      # Détails d'une carte
PUT    /cards/:id                      # Modifier une carte
DELETE /cards/:id                      # Supprimer une carte
GET    /cards/collection/:id           # Cartes d'une collection
```

#### 🔄 Révisions

```http
GET    /reviews/collection/:id/review  # Cartes à réviser
POST   /reviews/:id/review             # Réviser une carte
```

#### 👥 Utilisateurs (Admin)

```http
GET    /users/                         # Liste des utilisateurs
GET    /users/:id                      # Détails d'un utilisateur
DELETE /users/:id                      # Supprimer un utilisateur
```

### Exemples de Requêtes

#### Inscription

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nouveau@example.com",
    "password": "password123",
    "firstName": "John",
    "name": "Doe"
  }'
```

#### Connexion

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean.dupont@example.com",
    "password": "password123"
  }'
```

#### Créer une Collection

```bash
curl -X POST http://localhost:3000/collections/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  -d '{
    "title": "Ma Collection",
    "description": "Description de ma collection",
    "is_public": true
  }'
```

📄 **Fichier de test complet** : Voir [api-test.http](./api-test.http)

---

## 🔄 Système de Répétition Espacée

### Principe

Le système utilise **5 niveaux** de révision avec des intervalles croissants pour optimiser la mémorisation :

| Niveau | Délai de Révision | Utilisation |
|--------|-------------------|-------------|
| **1** | 1 jour | Nouvelles cartes / Oubliées |
| **2** | 2 jours | Début de mémorisation |
| **3** | 4 jours | Mémorisation intermédiaire |
| **4** | 8 jours | Bonne mémorisation |
| **5** | 16 jours | Excellente mémorisation |

### Fonctionnement

```
┌─────────────────┐
│  Réviser Carte  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Choisir Niveau  │  (1-5 selon la facilité)
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ Calcul Prochaine Révision  │
│                             │
│ next_review_date =          │
│   last_revision_date +      │
│   level.days_before_revision│
└────────┬────────────────────┘
         │
         ▼
┌─────────────────┐
│ Carte Programmée│
│ pour Révision   │
└─────────────────┘
```

### Caractéristiques

- ✅ **Calcul Dynamique** : La date de prochaine révision est calculée en temps réel
- ✅ **Personnalisation** : Chaque utilisateur a sa propre progression
- ✅ **Collections Partagées** : Les révisions sur collections publiques sont indépendantes
- ✅ **Historique** : Suivi des révisions avec dates et niveaux

### Exemple

```javascript
// Jean révise une carte le 25 décembre au niveau 3 (4 jours)
last_revision_date: 2024-12-25
level_id: 3  // 4 jours

// La carte apparaîtra dans "cartes à réviser" à partir du :
next_review_date: 2024-12-29  // 25 + 4 jours
```

---

## 📁 Structure du Projet

```
memory-card/
├── src/
│   ├── controllers/          # Logique métier
│   │   ├── authController.js
│   │   ├── cardController.js
│   │   ├── collectionController.js
│   │   ├── reviewController.js
│   │   └── userController.js
│   ├── db/                   # Base de données
│   │   ├── database.js       # Configuration Drizzle
│   │   ├── schema.js         # Schéma des tables
│   │   └── seed.js           # Données de test
│   ├── middleware/           # Middlewares Express
│   │   ├── checkAdmin.js     # Vérification admin
│   │   └── checkToken.js     # Vérification JWT
│   ├── models/               # Validation Zod
│   │   ├── card.js
│   │   ├── collection.js
│   │   ├── review.js
│   │   └── user.js
│   ├── routers/              # Routes Express
│   │   ├── authRouter.js
│   │   ├── cardRouter.js
│   │   ├── collectionRouter.js
│   │   ├── reviewRouter.js
│   │   └── userRouter.js
│   ├── utils/                # Utilitaires
│   │   ├── logger.js         # Logging des requêtes
│   │   └── validation.js     # Validation middleware
│   └── server.js             # Point d'entrée
├── tests/
│   └── api.test.js           # Suite de tests
├── .env                      # Variables d'environnement (à créer)
├── .gitignore
├── drizzle.config.js         # Configuration Drizzle
├── package.json
└── README.md                 # Ce fichier
```

---

## 🛠️ Technologies

### Backend
- **Node.js** v22.x - Runtime JavaScript
- **Express** v5.x - Framework web
- **SQLite** - Base de données embarquée

### ORM & Validation
- **Drizzle ORM** v0.44 - Modern TypeScript ORM
- **Zod** v4.x - Validation de schémas

### Sécurité
- **bcryptjs** - Hash de mots de passe
- **jsonwebtoken** - Authentification JWT
- **CORS** - Cross-Origin Resource Sharing

### Développement
- **nodemon** - Rechargement automatique
- **dotenv** - Gestion des variables d'environnement
- **uuid** - Génération d'identifiants uniques

---

## 📖 Documentation Technique

Pour une documentation détaillée de l'implémentation :

- 📄 [IMPLEMENTATION_REPORT.md](./IMPLEMENTATION_REPORT.md) - Rapport technique complet
- 🧪 [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Guide des tests
- 🌐 [api-test.http](./api-test.http) - Collection de tests REST

---

## 🔒 Sécurité

### Bonnes Pratiques Implémentées

- ✅ Mots de passe hashés avec bcrypt (10 rounds)
- ✅ Tokens JWT avec expiration (1 heure)
- ✅ Validation stricte des entrées (Zod)
- ✅ Protection contre les injections SQL (ORM)
- ✅ Contrôle d'accès sur toutes les routes sensibles
- ✅ CORS configuré

### Recommandations de Production

⚠️ **Avant de déployer en production :**

1. Changez `JWT_SECRET` dans `.env`
2. Utilisez HTTPS
3. Configurez rate limiting
4. Activez les logs de sécurité
5. Mettez en place des backups réguliers

---

## 🐛 Résolution de Problèmes

### Le serveur ne démarre pas

```bash
# Vérifier si le port 3000 est libre
netstat -ano | findstr :3000

# Windows: Tuer le processus si nécessaire
taskkill /PID <PID> /F

# Linux/Mac: Tuer le processus
kill -9 <PID>
```

### Erreurs de base de données

```bash
# Réinitialiser complètement la base
npm run db:push -- --force
npm run db:seed
```

### Les tests échouent

```bash
# Vérifier que le serveur tourne
curl http://localhost:3000

# Réinitialiser et relancer
npm run test:full
```

---

## 📝 Licence

Ce projet est réalisé dans le cadre d'un projet académique à l'Université de Caen Normandie.

---

## 👥 Auteurs

**Projet académique** - Université de Caen Normandie  
**Encadrant** : Clément Catel (clement.catel@unicaen.fr)

---

## 📞 Contact & Support

Pour toute question ou problème :

1. Consultez la [documentation technique](./IMPLEMENTATION_REPORT.md)
2. Vérifiez les [issues GitHub](../../issues)
3. Contactez l'encadrant du projet

---

<div align="center">

**Fait avec ❤️ pour l'apprentissage et la mémorisation optimale**

[⬆ Retour en haut](#-memory-card-api)

</div>
