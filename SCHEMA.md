# Schéma Entité-Relation - Memory Card API

## Tables et Relations

### 1. Table `User`
**Description:** Stocke les informations des utilisateurs

| Colonne      | Type          | Contraintes                    | Description                           |
|--------------|---------------|--------------------------------|---------------------------------------|
| user_id      | CHAR(36)      | PRIMARY KEY                    | Identifiant unique (UUID)             |
| email        | TEXT          | NOT NULL, UNIQUE               | Adresse email de l'utilisateur        |
| password     | TEXT          | NOT NULL                       | Mot de passe haché (bcrypt)           |
| name         | TEXT          | NOT NULL                       | Nom de famille                        |
| first_name   | TEXT          | NOT NULL                       | Prénom                                |
| is_admin     | BOOLEAN       | NOT NULL, DEFAULT FALSE        | Indique si l'utilisateur est admin    |

---

### 2. Table `Collection`
**Description:** Stocke les collections de flashcards

| Colonne        | Type          | Contraintes                    | Description                              |
|----------------|---------------|--------------------------------|------------------------------------------|
| collection_id  | CHAR(36)      | PRIMARY KEY                    | Identifiant unique (UUID)                |
| author_id      | CHAR(36)      | NOT NULL, FOREIGN KEY → User   | ID du propriétaire de la collection      |
| title          | TEXT          | NOT NULL                       | Titre de la collection                   |
| description    | TEXT          | NULL                           | Description optionnelle                  |
| is_public      | BOOLEAN       | NOT NULL, DEFAULT FALSE        | Visibilité (public ou privé)             |

**Relations:**
- `author_id` → `User.user_id` (Many-to-One) : Un utilisateur peut créer plusieurs collections

---

### 3. Table `Card`
**Description:** Stocke les flashcards

| Colonne        | Type          | Contraintes                         | Description                              |
|----------------|---------------|-------------------------------------|------------------------------------------|
| card_id        | CHAR(36)      | PRIMARY KEY                         | Identifiant unique (UUID)                |
| collection_id  | CHAR(36)      | NOT NULL, FOREIGN KEY → Collection  | Collection à laquelle appartient la carte|
| recto          | TEXT          | NOT NULL                            | Face avant de la carte                   |
| verso          | TEXT          | NOT NULL                            | Face arrière de la carte                 |
| url_recto      | TEXT          | NULL                                | URL optionnelle d'une image/lien (recto) |
| url_verso      | TEXT          | NULL                                | URL optionnelle d'une image/lien (verso) |

**Relations:**
- `collection_id` → `Collection.collection_id` (Many-to-One) : Une collection contient plusieurs cartes
- **Suppression en cascade:** Si une collection est supprimée, toutes ses cartes sont supprimées

---

### 4. Table `Level`
**Description:** Définit les niveaux de répétition espacée

| Colonne               | Type          | Contraintes         | Description                                    |
|-----------------------|---------------|---------------------|------------------------------------------------|
| level_id              | INTEGER       | PRIMARY KEY         | Identifiant du niveau (1 à 5)                  |
| days_before_revision  | INTEGER       | NOT NULL            | Nombre de jours avant la prochaine révision    |

**Données par défaut:**
```
Level 1 → 1 jour
Level 2 → 2 jours
Level 3 → 4 jours
Level 4 → 8 jours
Level 5 → 16 jours
```

---

### 5. Table `Revision`
**Description:** Suit la progression de chaque utilisateur pour chaque carte

| Colonne              | Type          | Contraintes                             | Description                                      |
|----------------------|---------------|-----------------------------------------|--------------------------------------------------|
| card_id              | CHAR(36)      | PRIMARY KEY (composite), FOREIGN KEY → Card | ID de la carte révisée                     |
| user_id              | CHAR(36)      | PRIMARY KEY (composite), FOREIGN KEY → User | ID de l'utilisateur                        |
| level_id             | INTEGER       | NOT NULL, FOREIGN KEY → Level, DEFAULT 1    | Niveau actuel de maîtrise                  |
| last_revision_date   | TIMESTAMP     | NOT NULL                                    | Date de la dernière révision               |
| next_revision_date   | TIMESTAMP     | NOT NULL                                    | Date de la prochaine révision prévue       |

**Relations:**
- `card_id` → `Card.card_id` (Many-to-One) : Une carte peut avoir plusieurs révisions (une par utilisateur)
- `user_id` → `User.user_id` (Many-to-One) : Un utilisateur peut avoir plusieurs révisions
- `level_id` → `Level.level_id` (Many-to-One) : Référence au niveau de répétition
- **Clé primaire composite:** `(card_id, user_id)` : Chaque utilisateur a une seule entrée de révision par carte
- **Suppression en cascade:** 
  - Si une carte est supprimée, toutes ses révisions sont supprimées
  - Si un utilisateur est supprimé, toutes ses révisions sont supprimées

**Important:** Cette table permet à chaque utilisateur d'avoir sa propre progression personnelle pour chaque carte, même si la carte appartient à une collection publique créée par un autre utilisateur.

---

### 6. Table `CollectionAccess`
**Description:** Gère les droits d'accès partagés aux collections privées

| Colonne        | Type          | Contraintes                              | Description                              |
|----------------|---------------|------------------------------------------|------------------------------------------|
| user_id        | CHAR(36)      | PRIMARY KEY (composite), FOREIGN KEY → User        | ID de l'utilisateur ayant l'accès  |
| collection_id  | CHAR(36)      | PRIMARY KEY (composite), FOREIGN KEY → Collection  | ID de la collection partagée       |

**Relations:**
- `user_id` → `User.user_id` (Many-to-One) : Un utilisateur peut avoir accès à plusieurs collections
- `collection_id` → `Collection.collection_id` (Many-to-One) : Une collection peut être partagée avec plusieurs utilisateurs
- **Clé primaire composite:** `(user_id, collection_id)`
- **Suppression en cascade:**
  - Si un utilisateur est supprimé, tous ses accès partagés sont supprimés
  - Si une collection est supprimée, tous les accès partagés associés sont supprimés

---

## Diagramme Textuel des Relations

```
User (1) ──────< (N) Collection
 │                     │
 │                     └──────< (N) Card
 │                               │
 └──< (N) CollectionAccess (N)──┘
 │                               │
 └──────< (N) Revision (N) ─────┘
                 │
                 └──────> (1) Level
```

## Description des Relations

### Relations principales :

1. **User → Collection** (One-to-Many)
   - Un utilisateur peut être l'auteur de plusieurs collections
   - Une collection a un seul auteur

2. **Collection → Card** (One-to-Many)
   - Une collection contient plusieurs cartes
   - Une carte appartient à une seule collection

3. **User ↔ Collection** via CollectionAccess (Many-to-Many)
   - Un utilisateur peut avoir accès à plusieurs collections partagées
   - Une collection peut être partagée avec plusieurs utilisateurs

4. **User ↔ Card** via Revision (Many-to-Many)
   - Un utilisateur peut réviser plusieurs cartes
   - Une carte peut être révisée par plusieurs utilisateurs
   - Chaque relation User-Card stocke la progression personnelle

5. **Revision → Level** (Many-to-One)
   - Chaque révision référence un niveau de répétition espacée
   - Un niveau peut être référencé par plusieurs révisions

### Règles de gestion :

- **Collections publiques** : Accessibles à tous les utilisateurs authentifiés (lecture seule sauf pour le propriétaire)
- **Collections privées** : Accessibles uniquement au propriétaire et aux utilisateurs ayant reçu un accès via CollectionAccess
- **Modification de cartes** : Seul le propriétaire de la collection peut créer, modifier ou supprimer des cartes
- **Révisions personnelles** : Chaque utilisateur a sa propre progression pour chaque carte, indépendamment de la visibilité de la collection

---

## Outils de visualisation recommandés

Pour créer un diagramme visuel à partir de cette structure :

1. **DrawSQL** : https://drawsql.app/
2. **Eraser.io** : https://www.eraser.io/use-case/data-model
3. **dbdiagram.io** : https://dbdiagram.io/

### Code DBML (pour dbdiagram.io) :

```dbml
Table User {
  user_id char(36) [pk]
  email text [not null, unique]
  password text [not null]
  name text [not null]
  first_name text [not null]
  is_admin boolean [not null, default: false]
}

Table Collection {
  collection_id char(36) [pk]
  author_id char(36) [not null, ref: > User.user_id]
  title text [not null]
  description text
  is_public boolean [not null, default: false]
}

Table Card {
  card_id char(36) [pk]
  collection_id char(36) [not null, ref: > Collection.collection_id]
  recto text [not null]
  verso text [not null]
  url_recto text
  url_verso text
}

Table Level {
  level_id integer [pk]
  days_before_revision integer [not null]
}

Table Revision {
  card_id char(36) [pk, ref: > Card.card_id]
  user_id char(36) [pk, ref: > User.user_id]
  level_id integer [not null, default: 1, ref: > Level.level_id]
  last_revision_date timestamp [not null]
  next_revision_date timestamp [not null]
  
  indexes {
    (card_id, user_id) [pk]
  }
}

Table CollectionAccess {
  user_id char(36) [pk, ref: > User.user_id]
  collection_id char(36) [pk, ref: > Collection.collection_id]
  
  indexes {
    (user_id, collection_id) [pk]
  }
}
```
