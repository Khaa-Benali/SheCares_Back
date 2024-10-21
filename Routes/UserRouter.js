const express = require('express');
const router = express.Router(); 
const { updateUser , getUser } = require('../Controllers/UserController');
const ensureAuthenticated = require('../Middlewares/ensureAuthenticated');
const { updateUserValidation } = require('../Middlewares/AuthValidation');

router.put('/update', ensureAuthenticated, updateUserValidation, updateUser);

router.get('/', ensureAuthenticated, getUser); // Route pour récupérer l'utilisateur
module.exports = router;

