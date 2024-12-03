const express = require('express');
const router = express.Router(); 
const { updateUser , getUser,addAppointment, updateAppointment, deleteAppointment, getAllAppointments, getClosestAppointment, getAppointmentsByDate, getAppointmentsCount } = require('../Controllers/UserController');
const ensureAuthenticated = require('../Middlewares/ensureAuthenticated');
const { updateUserValidation } = require('../Middlewares/AuthValidation');

router.put('/update', ensureAuthenticated, updateUserValidation, updateUser);

router.get('/', ensureAuthenticated, getUser); // Route pour récupérer l'utilisateur
// Route pour ajouter un rendez-vous
router.post('/addappointments', ensureAuthenticated, addAppointment);

// Route pour mettre à jour un rendez-vous
router.put('/updateAppointment', ensureAuthenticated, updateAppointment);

// Route pour supprimer un rendez-vous
router.delete('/deleteAppointment/:appointmentTitle', ensureAuthenticated, deleteAppointment);
// Récupérer tous les rendez-vous
router.get('/allAppointments', ensureAuthenticated, getAllAppointments);

// Récupérer le rendez-vous le plus proche
router.get('/appointment/closest', ensureAuthenticated, getClosestAppointment);

// Récupérer le rendez-vous par date
router.get('/appointmentByDate', ensureAuthenticated, getAppointmentsByDate);
router.get('/appointmentnumber', ensureAuthenticated, getAppointmentsCount);

module.exports = router;

