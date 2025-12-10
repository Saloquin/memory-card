# Documentation de l'API - Memory Card

## Table des matières
1. [Authentification](#authentification)
2. [Collections](#collections)
3. [Flashcards](#flashcards)
4. [Révisions](#révisions)
5. [Administration](#administration)

---

## Authentification

### 1. Inscription (Register)

**Endpoint:** `POST /api/auth/register`

**Type d'authentification:** Publique (aucune authentification requise)

**Description:** Créer un nouveau compte utilisateur

**Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123",
  "name": "Dupont",
  "firstName": "Jean"
}
```

**Réponse réussie (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "userId": "uuid-v4",
    "email": "user@example.com",
    "name": "Dupont",
    "firstName": "Jean",
    "isAdmin": false
  },
  "token": "jwt-token"
}
```

---

### 2. Connexion (Login)

**Endpoint:** `POST /api/auth/login`

**Type d'authentification:** Publique

**Description:** Authentifier un utilisateur et obtenir un token JWT

**Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Réponse réussie (200):**
```json
{
  "message": "Login successful",
  "user": {
    "userId": "uuid-v4",
    "email": "user@example.com",
    "name": "Dupont",
    "firstName": "Jean",
    "isAdmin": false
  },
  "token": "jwt-token"
}
```

---

### 3. Profil utilisateur

**Endpoint:** `GET /api/auth/profile`

**Type d'authentification:** Utilisateur authentifié

**Description:** Récupérer les informations du compte connecté

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Réponse réussie (200):**
```json
{
  "user": {
    "userId": "uuid-v4",
    "email": "user@example.com",
    "name": "Dupont",
    "firstName": "Jean",
    "isAdmin": false
  }
}
```

---

## Collections

### 4. Créer une collection

**Endpoint:** `POST /api/collections`

**Type d'authentification:** Utilisateur authentifié

**Description:** Créer une nouvelle collection de flashcards

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Body (JSON):**
```json
{
  "title": "Vocabulaire Espagnol",
  "description": "Mots de base en espagnol",
  "isPublic": false
}
```

**Réponse réussie (201):**
```json
{
  "message": "Collection created successfully",
  "collection": {
    "collectionId": "uuid-v4",
    "authorId": "uuid-v4",
    "title": "Vocabulaire Espagnol",
    "description": "Mots de base en espagnol",
    "isPublic": false
  }
}
```

---

### 5. Lister toutes les collections accessibles

**Endpoint:** `GET /api/collections`

**Type d'authentification:** Utilisateur authentifié

**Description:** Récupérer toutes les collections accessibles par l'utilisateur (collections publiques, ses propres collections, collections partagées avec lui)

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Réponse réussie (200):**
```json
{
  "collections": [
    {
      "collectionId": "uuid-v4",
      "authorId": "uuid-v4",
      "title": "Vocabulaire Espagnol",
      "description": "Mots de base",
      "isPublic": false,
      "authorName": "Dupont",
      "authorFirstName": "Jean"
    }
  ]
}
```

---

### 6. Lister mes propres collections

**Endpoint:** `GET /api/collections/my`

**Type d'authentification:** Utilisateur authentifié

**Description:** Récupérer uniquement les collections dont l'utilisateur est propriétaire

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Réponse réussie (200):**
```json
{
  "collections": [
    {
      "collectionId": "uuid-v4",
      "authorId": "uuid-v4",
      "title": "Ma collection",
      "description": "Description",
      "isPublic": true
    }
  ]
}
```

---

### 7. Rechercher des collections publiques

**Endpoint:** `GET /api/collections/search?q=<terme>`

**Type d'authentification:** Utilisateur authentifié

**Description:** Rechercher des collections publiques par titre

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query params:**
- `q` (string, requis): Terme de recherche pour le titre

**Réponse réussie (200):**
```json
{
  "collections": [
    {
      "collectionId": "uuid-v4",
      "authorId": "uuid-v4",
      "title": "Vocabulaire Espagnol",
      "description": "Mots de base",
      "isPublic": true,
      "authorName": "Martin",
      "authorFirstName": "Sophie"
    }
  ]
}
```

---

### 8. Consulter une collection

**Endpoint:** `GET /api/collections/:id`

**Type d'authentification:** Utilisateur authentifié

**Description:** Récupérer les détails d'une collection spécifique (accessible si publique, si propriétaire, ou si accès partagé)

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Route params:**
- `id` (UUID): ID de la collection

**Réponse réussie (200):**
```json
{
  "collection": {
    "collectionId": "uuid-v4",
    "authorId": "uuid-v4",
    "title": "Vocabulaire Espagnol",
    "description": "Mots de base",
    "isPublic": false,
    "authorName": "Dupont",
    "authorFirstName": "Jean"
  }
}
```

---

### 9. Modifier une collection

**Endpoint:** `PUT /api/collections/:id`

**Type d'authentification:** Utilisateur authentifié (propriétaire uniquement)

**Description:** Modifier le titre, la description ou la visibilité d'une collection

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Route params:**
- `id` (UUID): ID de la collection

**Body (JSON):**
```json
{
  "title": "Nouveau titre",
  "description": "Nouvelle description",
  "isPublic": true
}
```

**Réponse réussie (200):**
```json
{
  "message": "Collection updated successfully",
  "collection": {
    "collectionId": "uuid-v4",
    "authorId": "uuid-v4",
    "title": "Nouveau titre",
    "description": "Nouvelle description",
    "isPublic": true
  }
}
```

---

### 10. Supprimer une collection

**Endpoint:** `DELETE /api/collections/:id`

**Type d'authentification:** Utilisateur authentifié (propriétaire uniquement)

**Description:** Supprimer une collection et toutes ses flashcards associées (suppression en cascade)

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Route params:**
- `id` (UUID): ID de la collection

**Réponse réussie (200):**
```json
{
  "message": "Collection deleted successfully"
}
```

---

### 11. Accorder l'accès à une collection

**Endpoint:** `POST /api/collections/:id/access`

**Type d'authentification:** Utilisateur authentifié (propriétaire uniquement)

**Description:** Partager une collection avec un autre utilisateur

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Route params:**
- `id` (UUID): ID de la collection

**Body (JSON):**
```json
{
  "userId": "uuid-v4-du-user"
}
```

**Réponse réussie (201):**
```json
{
  "message": "Access granted successfully"
}
```

---

### 12. Révoquer l'accès à une collection

**Endpoint:** `DELETE /api/collections/:id/access/:userId`

**Type d'authentification:** Utilisateur authentifié (propriétaire uniquement)

**Description:** Retirer l'accès partagé d'un utilisateur à une collection

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Route params:**
- `id` (UUID): ID de la collection
- `userId` (UUID): ID de l'utilisateur dont on révoque l'accès

**Réponse réussie (200):**
```json
{
  "message": "Access revoked successfully"
}
```

---

## Flashcards

### 13. Créer une flashcard

**Endpoint:** `POST /api/cards`

**Type d'authentification:** Utilisateur authentifié (propriétaire de la collection uniquement)

**Description:** Créer une nouvelle flashcard dans une collection

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Body (JSON):**
```json
{
  "collectionId": "uuid-v4",
  "recto": "Hello",
  "verso": "Hola",
  "urlRecto": "https://example.com/image1.jpg",
  "urlVerso": "https://example.com/image2.jpg"
}
```

**Note:** Les champs `urlRecto` et `urlVerso` sont optionnels.

**Réponse réussie (201):**
```json
{
  "message": "Card created successfully",
  "card": {
    "cardId": "uuid-v4",
    "collectionId": "uuid-v4",
    "recto": "Hello",
    "verso": "Hola",
    "urlRecto": "https://example.com/image1.jpg",
    "urlVerso": "https://example.com/image2.jpg"
  }
}
```

---

### 14. Lister les flashcards d'une collection

**Endpoint:** `GET /api/cards/collection/:collectionId`

**Type d'authentification:** Utilisateur authentifié (avec accès à la collection)

**Description:** Récupérer toutes les flashcards d'une collection spécifique

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Route params:**
- `collectionId` (UUID): ID de la collection

**Réponse réussie (200):**
```json
{
  "cards": [
    {
      "cardId": "uuid-v4",
      "collectionId": "uuid-v4",
      "recto": "Hello",
      "verso": "Hola",
      "urlRecto": null,
      "urlVerso": null
    }
  ]
}
```

---

### 15. Récupérer les flashcards à réviser

**Endpoint:** `GET /api/cards/collection/:collectionId/review`

**Type d'authentification:** Utilisateur authentifié (avec accès à la collection)

**Description:** Obtenir les flashcards dont la date de prochaine révision est arrivée ou dépassée, ou qui n'ont jamais été révisées

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Route params:**
- `collectionId` (UUID): ID de la collection

**Réponse réussie (200):**
```json
{
  "cards": [
    {
      "cardId": "uuid-v4",
      "collectionId": "uuid-v4",
      "recto": "Bonjour",
      "verso": "Hello",
      "urlRecto": null,
      "urlVerso": null
    }
  ]
}
```

---

### 16. Consulter une flashcard

**Endpoint:** `GET /api/cards/:id`

**Type d'authentification:** Utilisateur authentifié (avec accès à la collection)

**Description:** Récupérer les détails d'une flashcard spécifique

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Route params:**
- `id` (UUID): ID de la flashcard

**Réponse réussie (200):**
```json
{
  "card": {
    "cardId": "uuid-v4",
    "collectionId": "uuid-v4",
    "recto": "Hello",
    "verso": "Hola",
    "urlRecto": null,
    "urlVerso": null
  }
}
```

---

### 17. Modifier une flashcard

**Endpoint:** `PUT /api/cards/:id`

**Type d'authentification:** Utilisateur authentifié (propriétaire de la collection uniquement)

**Description:** Modifier le contenu d'une flashcard

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Route params:**
- `id` (UUID): ID de la flashcard

**Body (JSON):**
```json
{
  "recto": "Nouveau recto",
  "verso": "Nouveau verso",
  "urlRecto": "https://example.com/new-image.jpg"
}
```

**Note:** Tous les champs sont optionnels, seuls ceux fournis seront mis à jour.

**Réponse réussie (200):**
```json
{
  "message": "Card updated successfully",
  "card": {
    "cardId": "uuid-v4",
    "collectionId": "uuid-v4",
    "recto": "Nouveau recto",
    "verso": "Nouveau verso",
    "urlRecto": "https://example.com/new-image.jpg",
    "urlVerso": null
  }
}
```

---

### 18. Supprimer une flashcard

**Endpoint:** `DELETE /api/cards/:id`

**Type d'authentification:** Utilisateur authentifié (propriétaire de la collection uniquement)

**Description:** Supprimer une flashcard

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Route params:**
- `id` (UUID): ID de la flashcard

**Réponse réussie (200):**
```json
{
  "message": "Card deleted successfully"
}
```

---

## Révisions

### 19. Enregistrer une révision

**Endpoint:** `POST /api/study/revisions`

**Type d'authentification:** Utilisateur authentifié (avec accès à la collection)

**Description:** Enregistrer une révision de flashcard. Le système gère automatiquement la progression du niveau et calcule la prochaine date de révision selon la méthode de répétition espacée.

**Fonctionnement:**
- Si l'utilisateur révise une flashcard appartenant à une collection publique dont il n'est pas propriétaire, la progression est personnelle (table Revision avec clé composite cardId + userId)
- `success: true` → avance au niveau suivant (max niveau 5)
- `success: false` → retour au niveau 1

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Body (JSON):**
```json
{
  "cardId": "uuid-v4",
  "success": true
}
```

**Réponse réussie (201):**
```json
{
  "message": "Revision recorded successfully",
  "revision": {
    "cardId": "uuid-v4",
    "userId": "uuid-v4",
    "levelId": 2,
    "lastRevisionDate": "2024-12-10T14:30:00.000Z",
    "nextRevisionDate": "2024-12-12T14:30:00.000Z",
    "success": true,
    "daysUntilNextReview": 2
  }
}
```

---

### 20. Récupérer toutes les révisions de l'utilisateur

**Endpoint:** `GET /api/study/revisions`

**Type d'authentification:** Utilisateur authentifié

**Description:** Obtenir l'historique de toutes les révisions de l'utilisateur connecté

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Réponse réussie (200):**
```json
{
  "revisions": [
    {
      "cardId": "uuid-v4",
      "userId": "uuid-v4",
      "levelId": 3,
      "lastRevisionDate": "2024-12-10T14:30:00.000Z",
      "nextRevisionDate": "2024-12-14T14:30:00.000Z"
    }
  ]
}
```

---

### 21. Récupérer la révision d'une flashcard

**Endpoint:** `GET /api/study/revisions/:cardId`

**Type d'authentification:** Utilisateur authentifié (avec accès à la collection)

**Description:** Obtenir l'état de révision de l'utilisateur pour une flashcard spécifique

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Route params:**
- `cardId` (UUID): ID de la flashcard

**Réponse réussie (200):**
```json
{
  "revision": {
    "cardId": "uuid-v4",
    "userId": "uuid-v4",
    "levelId": 2,
    "lastRevisionDate": "2024-12-10T14:30:00.000Z",
    "nextRevisionDate": "2024-12-12T14:30:00.000Z"
  }
}
```

---

### 22. Lister les niveaux de répétition espacée

**Endpoint:** `GET /api/study/levels`

**Type d'authentification:** Utilisateur authentifié

**Description:** Récupérer la liste des niveaux de répétition espacée et leurs délais

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Réponse réussie (200):**
```json
{
  "levels": [
    { "levelId": 1, "daysBeforeRevision": 1 },
    { "levelId": 2, "daysBeforeRevision": 2 },
    { "levelId": 3, "daysBeforeRevision": 4 },
    { "levelId": 4, "daysBeforeRevision": 8 },
    { "levelId": 5, "daysBeforeRevision": 16 }
  ]
}
```

---

## Administration

**Note:** Toutes les routes d'administration nécessitent un compte administrateur (`isAdmin: true`)

### 23. Lister tous les utilisateurs

**Endpoint:** `GET /api/admin/users`

**Type d'authentification:** Administrateur

**Description:** Récupérer la liste de tous les utilisateurs

**Headers:**
```
Authorization: Bearer <jwt-token-admin>
```

**Réponse réussie (200):**
```json
{
  "users": [
    {
      "userId": "uuid-v4",
      "email": "user@example.com",
      "name": "Dupont",
      "firstName": "Jean",
      "isAdmin": false
    }
  ]
}
```

---

### 24. Consulter un utilisateur

**Endpoint:** `GET /api/admin/users/:id`

**Type d'authentification:** Administrateur

**Description:** Récupérer les détails d'un utilisateur spécifique

**Headers:**
```
Authorization: Bearer <jwt-token-admin>
```

**Route params:**
- `id` (UUID): ID de l'utilisateur

**Réponse réussie (200):**
```json
{
  "user": {
    "userId": "uuid-v4",
    "email": "user@example.com",
    "name": "Dupont",
    "firstName": "Jean",
    "isAdmin": false
  }
}
```

---

### 25. Supprimer un utilisateur

**Endpoint:** `DELETE /api/admin/users/:id`

**Type d'authentification:** Administrateur

**Description:** Supprimer un utilisateur et toutes ses données associées (collections, flashcards, révisions) via suppression en cascade

**Note:** Un administrateur ne peut pas supprimer son propre compte

**Headers:**
```
Authorization: Bearer <jwt-token-admin>
```

**Route params:**
- `id` (UUID): ID de l'utilisateur

**Réponse réussie (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

## Codes d'erreur

- `400` - Bad Request (données invalides, validation échouée)
- `401` - Unauthorized (token manquant ou invalide)
- `403` - Forbidden (accès refusé, permissions insuffisantes)
- `404` - Not Found (ressource introuvable)
- `500` - Internal Server Error (erreur serveur)

## Méthode de répétition espacée

Le système utilise 5 niveaux avec les délais suivants :

| Niveau | Délai avant prochaine révision |
|--------|--------------------------------|
| 1      | 1 jour                         |
| 2      | 2 jours                        |
| 3      | 4 jours                        |
| 4      | 8 jours                        |
| 5      | 16 jours                       |

Lors d'une révision :
- **Succès** (`success: true`) : progression au niveau suivant (max 5)
- **Échec** (`success: false`) : retour au niveau 1

La date de prochaine révision est calculée automatiquement : `lastRevisionDate + daysBeforeRevision`
