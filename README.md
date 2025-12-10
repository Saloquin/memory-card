# Memory Card API

A flash card API built with Node.js, Express, SQLite, and Drizzle ORM. This API supports user authentication, collection management, card creation, and spaced repetition learning.

## Tech Stack

- **Node.js** + **Express** (JavaScript, no TypeScript)
- **SQLite** database (`@libsql/client`)
- **Drizzle ORM** for database queries
- **Required Libraries:**
  - `zod` - Schema validation
  - `bcrypt` - Password hashing
  - `jsonwebtoken` - JWT authentication
  - `dotenv` - Environment configuration
  - `nodemon` - Development server

## Project Structure

```
src/
├── config/          # Database configuration
├── controllers/     # Business logic
├── middleware/      # Authentication middleware
├── models/          # Database schema
├── routes/          # API routes
├── utils/           # Utility functions (validation, JWT, UUID)
└── index.js         # Main server file
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

4. Push database schema:
```bash
npm run db:push
```

5. Initialize database with default levels:
```bash
npm run db:init
```

## Running the Application

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

#### Register a new user
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "Doe",
  "firstName": "John"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get user profile
```
GET /api/auth/profile
Authorization: Bearer <token>
```

### Collections

#### Get all collections (accessible by user)
```
GET /api/collections
Authorization: Bearer <token>
```

#### Get collection by ID
```
GET /api/collections/:id
Authorization: Bearer <token>
```

#### Create a new collection
```
POST /api/collections
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Spanish Vocabulary",
  "description": "Basic Spanish words",
  "isPublic": false
}
```

#### Update a collection
```
PUT /api/collections/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "isPublic": true
}
```

#### Delete a collection
```
DELETE /api/collections/:id
Authorization: Bearer <token>
```

#### Grant access to a user
```
POST /api/collections/:id/access
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user-uuid"
}
```

#### Revoke user access
```
DELETE /api/collections/:id/access/:userId
Authorization: Bearer <token>
```

### Cards

#### Get all cards in a collection
```
GET /api/cards/collection/:collectionId
Authorization: Bearer <token>
```

#### Get card by ID
```
GET /api/cards/:id
Authorization: Bearer <token>
```

#### Create a new card
```
POST /api/cards
Authorization: Bearer <token>
Content-Type: application/json

{
  "collectionId": "collection-uuid",
  "recto": "Hello",
  "verso": "Hola",
  "urlRecto": "https://example.com/image1.jpg",
  "urlVerso": "https://example.com/image2.jpg"
}
```

#### Update a card
```
PUT /api/cards/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "recto": "Updated front",
  "verso": "Updated back"
}
```

#### Delete a card
```
DELETE /api/cards/:id
Authorization: Bearer <token>
```

### Study / Revisions

#### Record a revision (spaced repetition)
```
POST /api/study/revisions
Authorization: Bearer <token>
Content-Type: application/json

{
  "cardId": "card-uuid",
  "levelId": 1
}
```

#### Get all user revisions
```
GET /api/study/revisions
Authorization: Bearer <token>
```

#### Get revision for a specific card
```
GET /api/study/revisions/:cardId
Authorization: Bearer <token>
```

#### Get all spaced repetition levels
```
GET /api/study/levels
Authorization: Bearer <token>
```

## Database Schema

### User Table
- `user_id` (UUID, Primary Key)
- `email` (Text, Unique)
- `password` (Text, hashed with bcrypt)
- `name` (Text)
- `first_name` (Text)
- `is_admin` (Boolean)

### Collection Table
- `collection_id` (UUID, Primary Key)
- `author_id` (UUID, Foreign Key to User)
- `title` (Text)
- `description` (Text, nullable)
- `is_public` (Boolean)

### Card Table
- `card_id` (UUID, Primary Key)
- `collection_id` (UUID, Foreign Key to Collection)
- `recto` (Text) - Front of card
- `verso` (Text) - Back of card
- `url_recto` (Text, nullable) - Image URL for front
- `url_verso` (Text, nullable) - Image URL for back

### Revision Table
- `card_id` (UUID, Primary Key)
- `user_id` (UUID, Primary Key)
- `level_id` (Integer, Foreign Key to Level)
- `last_revision_date` (Timestamp)

### Level Table (Spaced Repetition)
- `level_id` (Integer, Primary Key)
- `days_before_revision` (Integer)

Default levels:
- Level 0: 0 days (new card)
- Level 1: 1 day
- Level 2: 3 days
- Level 3: 7 days (1 week)
- Level 4: 14 days (2 weeks)
- Level 5: 30 days (1 month)
- Level 6: 60 days (2 months)
- Level 7: 90 days (3 months)

### CollectionAccess Table
- `user_id` (UUID, Primary Key)
- `collection_id` (UUID, Primary Key)

## Development

The API uses:
- **Zod** for request validation
- **bcrypt** for password hashing (salt rounds: 10)
- **JWT** for authentication (configurable expiration)
- **UUID v4** for entity IDs

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate migrations
- `npm run db:init` - Initialize database with default data

## License

ISC

