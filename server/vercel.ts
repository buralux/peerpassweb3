// Fichier spécifique pour le déploiement Vercel
import { createServer } from 'http';
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { log } from './vite';
import { registerRoutes } from './routes';
import path from 'path';

// Configuration
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'peerpass-secret-key';

// Création de l'application Express
const app = express();

// Middleware de session
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 heures
    },
  })
);

// Middleware pour parser le JSON
app.use(express.json());

// Chemins statiques
app.use(express.static(path.join(process.cwd(), 'dist')));

// Enregistrement des routes API
(async () => {
  try {
    await registerRoutes(app);
    console.log('Routes API enregistrées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des routes API:', error);
  }
})();

// Gestion des erreurs
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';
  res.status(statusCode).json({ error: message });
});

// Route par défaut pour renvoyer l'application React
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

// Création du serveur
const server = createServer(app);

// Export pour Vercel
export default app;

// Démarrage du serveur si non utilisé comme module
if (process.env.NODE_ENV !== 'vercel') {
  server.listen(PORT, () => {
    log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
  });
}