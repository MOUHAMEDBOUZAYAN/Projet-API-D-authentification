// middlewares/validator.js
// Middleware de validation des entrées

const { body, validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

// Traiter les résultats de validation
const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return next(new ErrorResponse(errorMessages.join(', '), 400));
  }
  next();
};

// Règles de validation pour l'inscription
const registerValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 50 }).withMessage('Le nom doit comporter entre 2 et 50 caractères')
    .escape(),
  
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Veuillez fournir un email valide')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit comporter au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),
  
  body('passwordConfirm')
    .notEmpty().withMessage('La confirmation du mot de passe est requise')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      return true;
    })
];

// Règles de validation pour la connexion
const loginValidationRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Veuillez fournir un email valide')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
];

// Règles de validation pour la réinitialisation du mot de passe
const resetPasswordValidationRules = [
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit comporter au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),
  
  body('passwordConfirm')
    .notEmpty().withMessage('La confirmation du mot de passe est requise')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      return true;
    })
];

// Règles de validation pour la mise à jour du profil
const updateProfileValidationRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Le nom doit comporter entre 2 et 50 caractères')
    .escape(),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Veuillez fournir un email valide')
    .normalizeEmail()
];

// Règles de validation pour la mise à jour du mot de passe
const updatePasswordValidationRules = [
  body('currentPassword')
    .notEmpty().withMessage('Le mot de passe actuel est requis'),
  
  body('newPassword')
    .notEmpty().withMessage('Le nouveau mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit comporter au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('Le nouveau mot de passe doit être différent de l\'actuel');
      }
      return true;
    }),
  
  body('passwordConfirm')
    .notEmpty().withMessage('La confirmation du mot de passe est requise')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      return true;
    })
];

module.exports = {
  validationMiddleware,
  registerValidationRules,
  loginValidationRules,
  resetPasswordValidationRules,
  updateProfileValidationRules,
  updatePasswordValidationRules
};