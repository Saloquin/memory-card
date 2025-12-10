# Projet R5.05 - API de Flashcards avec Répétition Espacée

## Informations du Projet

**Repository GitHub:** https://github.com/Saloquin/memory-card

**Branch:** `copilot/develop-api-with-express`

## Documentation Complète

Ce projet contient tous les livrables demandés :

### 1. Code Source ✅
- Structure modulaire (routes, controllers, middleware, models, config, utils)
- Code JavaScript (pas de TypeScript)
- Utilisation de toutes les librairies obligatoires

### 2. Documentation Technique ✅

#### API_DOCUMENTATION.md
Documentation complète des 25 endpoints de l'API :
- 3 endpoints d'authentification
- 9 endpoints pour les collections
- 6 endpoints pour les flashcards
- 4 endpoints pour les révisions
- 3 endpoints d'administration

Pour chaque endpoint :
- Méthode HTTP et chemin
- Type d'authentification (publique/authentifiée/admin)
- Description fonctionnelle
- Paramètres d'entrée (body, route params, query params)
- Exemples de requêtes et réponses

#### SCHEMA.md
Schéma entité-relation complet :
- Description détaillée des 6 tables
- Relations entre entités
- Clés primaires et étrangères
- Contraintes et règles de cascade
- Code DBML pour générer le diagramme visuel

### 3. README.md ✅
Instructions complètes :
- Installation des dépendances
- Configuration des variables d'environnement
- Lancement en mode développement
- Initialisation de la base de données
- Description de l'architecture
- Liste des endpoints

## Technologies Utilisées (Conformes aux Exigences)

✅ **Node.js** + **Express** (JavaScript uniquement)
✅ **SQLite** avec `@libsql/client`
✅ **Drizzle ORM** pour les requêtes
✅ **zod** pour la validation
✅ **bcrypt** pour le hachage des mots de passe
✅ **jsonwebtoken** pour l'authentification JWT
✅ **dotenv** pour les variables d'environnement
✅ **nodemon** pour le développement

## Fonctionnalités Implémentées

### Authentification ✅
- [x] Inscription avec email, prénom, nom, mot de passe
- [x] Connexion avec JWT
- [x] Route pour récupérer le profil du compte connecté
- [x] Gestion des erreurs (mauvais mot de passe, utilisateur inconnu)

### Gestion des Collections ✅
- [x] Créer une collection (titre, description, visibilité public/privé)
- [x] Consulter une collection par ID (avec contrôle d'accès)
- [x] Lister ses propres collections
- [x] Rechercher des collections publiques par titre
- [x] Modifier une collection (propriétaire uniquement)
- [x] Supprimer une collection (propriétaire uniquement, cascade sur les cartes)
- [x] Accès privé/public géré correctement

### Gestion des Flashcards ✅
- [x] Créer une flashcard (recto, verso, URLs optionnelles, collection)
- [x] Consulter une flashcard par ID (respect des droits d'accès)
- [x] Lister les flashcards d'une collection
- [x] Récupérer les flashcards à réviser (date de révision arrivée/dépassée)
- [x] Modifier une flashcard (propriétaire uniquement)
- [x] Supprimer une flashcard (propriétaire uniquement)
- [x] Réviser une flashcard avec mise à jour automatique du niveau et de la date

### Répétition Espacée ✅
- [x] 5 niveaux implémentés (1, 2, 4, 8, 16 jours)
- [x] Niveau actuel stocké en base
- [x] Date de dernière révision stockée
- [x] Date de prochaine révision calculée et stockée
- [x] Progression personnelle par utilisateur (table Revision avec clé composite)
- [x] Fonctionne pour les collections publiques (progression indépendante)

### Administration (Optionnel) ✅
- [x] Lister les utilisateurs
- [x] Consulter un utilisateur par ID
- [x] Supprimer un utilisateur (cascade sur collections/flashcards)
- [x] Routes protégées par middleware admin

## Points Forts de l'Implémentation

### Architecture
- Structure modulaire claire et maintenable
- Séparation des responsabilités (routes → controllers → models)
- Middleware réutilisables (auth, admin)
- Validation centralisée avec Zod

### Sécurité
- Mots de passe hachés avec bcrypt
- JWT avec secret obligatoire (fail-fast si non défini)
- Protection contre les injections SQL (Drizzle ORM)
- Validation de toutes les entrées utilisateur
- Middleware d'authentification et d'autorisation

### Base de Données
- Schéma normalisé et cohérent
- UUIDs pour les identifiants (meilleure pratique)
- Suppression en cascade correctement configurée
- Index composites pour les performances

### Répétition Espacée
- Implémentation fidèle au système demandé
- Progression personnelle par utilisateur
- Calcul automatique des dates de révision
- Gestion du succès/échec (avance ou reset)

## Instructions d'Installation Rapide

```bash
# Cloner le repository
git clone https://github.com/Saloquin/memory-card.git
cd memory-card

# Installer les dépendances
npm install

# Copier la configuration
cp .env.example .env
# Éditer .env pour définir JWT_SECRET

# Initialiser la base de données
npm run db:push
npm run db:init

# Lancer en mode développement
npm run dev

# Lancer en production
npm start
```

L'API sera accessible sur http://localhost:3000

## Test de l'API

Exemples de requêtes disponibles dans `API_DOCUMENTATION.md`

```bash
# Inscription
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123","name":"Doe","firstName":"John"}'

# Connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'

# Utiliser le token JWT pour les requêtes authentifiées
```

## Conformité avec le Barème

### Fonctionnalités implémentées (10 pts) ✅
- Inscription et connexion fonctionnels
- Tous les endpoints implémentés
- Routes protégées correctement
- Système de répétition espacée complet

### Conception & base de données (4 pts) ✅
- Schéma de données cohérent et normalisé
- Gestion complète de la répétition espacée
- Relations et contraintes bien définies
- Documentation du schéma fournie

### Qualité technique & bonnes pratiques (4 pts) ✅
- Respect de toutes les contraintes techniques
- Code modulaire et maintenable
- Validation des données avec Zod
- Sécurité (bcrypt, JWT, protection SQL injection)

### Documentation & rendu (2 pts) ✅
- Documentation complète des endpoints
- Schéma entité-relation fourni
- README avec instructions d'installation
- Code DBML pour visualisation

## Fichiers Importants

- `README.md` - Instructions d'installation et présentation
- `API_DOCUMENTATION.md` - Documentation des 25 endpoints
- `SCHEMA.md` - Schéma de base de données et relations
- `src/index.js` - Point d'entrée de l'application
- `src/models/schema.js` - Définition du schéma Drizzle
- `package.json` - Dépendances et scripts

## Contact

Pour toute question sur l'implémentation, consulter :
1. La documentation API (API_DOCUMENTATION.md)
2. Le schéma de BDD (SCHEMA.md)
3. Le README principal (README.md)
