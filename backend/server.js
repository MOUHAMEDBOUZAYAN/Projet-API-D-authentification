const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./config/database');
const checkEnv = require('./config/env'); // Import de la vérification des variables d'environnement

// Charger les variables d'environnement
dotenv.config();

// Vérifier les variables d'environnement
if (typeof checkEnv === 'function') {
  checkEnv();
}

// Connecter à la base de données
connectDB();

// Créer l'application Express
const app = express();

// Configuration CORS
const corsOptions = require('./config/cors');
app.use(cors(corsOptions));

// Cookie parser
app.use(cookieParser());

// Parser du body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuration des sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret-key-for-development',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: parseInt(process.env.SESSION_EXPIRE) || 86400000 // 24 heures par défaut
    }
  })
);

// Middlewares de sécurité
app.use(helmet()); // Sécuriser les en-têtes HTTP
app.use(mongoSanitize()); // Empêcher l'injection NoSQL
app.use(xss()); // Nettoyer les entrées utilisateur pour prévenir XSS

// Limiter les requêtes pour prévenir les attaques par force brute
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limiter chaque IP à 100 requêtes par fenêtre (10 minutes)
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer après 10 minutes'
});
app.use('/api/auth', limiter);

// Prévenir la pollution des paramètres HTTP
app.use(hpp());

// Middleware de journalisation
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Route de base pour vérifier que l'API fonctionne
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API d\'authentification' });
});

// Routes API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Route de gestion des erreurs 404 (route non trouvée)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route non trouvée: ${req.originalUrl}`
  });
});

// Middleware de gestion des erreurs - doit être placé après les routes
app.use(errorHandler);

// Port d'écoute
const PORT = process.env.PORT || 5000;

// Démarrer le serveur
const server = app.listen(PORT, () => {
  console.log(`Serveur démarré en mode ${process.env.NODE_ENV} sur le port ${PORT}`);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err, promise) => {
  console.log(`Erreur: ${err.message}`);
  // Fermez le serveur et quittez le processus
  server.close(() => process.exit(1));
});