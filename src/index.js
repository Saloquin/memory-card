import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import collectionsRoutes from './routes/collectionsRoutes.js';
import cardsRoutes from './routes/cardsRoutes.js';
import studyRoutes from './routes/studyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/collections', collectionsRoutes);
app.use('/api/cards', cardsRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Memory Card API is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Memory Card API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      collections: '/api/collections',
      cards: '/api/cards',
      study: '/api/study',
      admin: '/api/admin',
      health: '/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API available at http://localhost:${PORT}`);
});

export default app;
