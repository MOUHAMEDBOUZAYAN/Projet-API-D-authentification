// config/database.js
// Configuration et connexion à la base de données MongoDB

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connexion sans les options dépréciées
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erreur de connexion à MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;