// config/cors.js
// Configuration des options CORS pour l'API

module.exports = {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    exposedHeaders: ['X-Total-Count'],
    maxAge: 86400 // 24 heures en secondes
  };