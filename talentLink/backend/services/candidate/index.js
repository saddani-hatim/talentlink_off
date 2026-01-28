import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import candidateRoutes from './src/routes/candidate.routes.js';

const app = express();
const PORT = process.env.CANDIDATE_SERVICE_PORT || 2022;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true
}));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/candidate', candidateRoutes);

// 404 handler
app.use((req, res, next) => {
  console.log(`404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ message: 'Route non trouvée' });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur interne est survenue dans le service candidat' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Service Candidat démarré sur le port ${PORT}`);
});
