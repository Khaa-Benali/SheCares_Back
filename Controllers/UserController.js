const UserModel = require("../Models/User");
const updateUser = async (req, res) => {
    try {
        const userId = req.user._id; // Récupère l'ID de l'utilisateur à partir du token
        const updates = req.body; // Récupère les données de mise à jour depuis la requête

        // Recherche l'utilisateur par ID et met à jour ses informations
        const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        // Renvoie la réponse avec les informations mises à jour
        res.status(200).json({
            message: "User updated successfully",
            success: true,
            user: updatedUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
const getUser = async (req, res) => {
    try {
        const userId = req.user._id; // Obtenez l'ID de l'utilisateur à partir du token JWT

        const user = await UserModel.findById(userId); // Récupérez l'utilisateur par ID

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        res.status(200).json({
            message: "User retrieved successfully",
            success: true,
            user // Renvoie les données de l'utilisateur
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
// Ajouter un rendez-vous
const addAppointment = async (req, res) => {
    try {
        const userId = req.user._id;
        const { date, title, doctor, location } = req.body;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const newAppointment = { date, title, doctor, location };
        user.appointments.push(newAppointment);
        await user.save();

        res.status(201).json({
            message: "Appointment added successfully",
            success: true,
            appointments: user.appointments
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Mettre à jour un rendez-vous
const updateAppointment = async (req, res) => {
    try {
        const userId = req.user._id;
        const { appointmentId, date, title, doctor, location } = req.body;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const appointment = user.appointments.id(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found", success: false });
        }

        if (date) appointment.date = date;
        if (title) appointment.title = title;
        if (doctor) appointment.doctor = doctor;
        if (location) appointment.location = location;

        await user.save();

        res.status(200).json({
            message: "Appointment updated successfully",
            success: true,
            appointments: user.appointments
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const deleteAppointment = async (req, res) => {
    try {
        const userId = req.user._id;
        const { appointmentTitle } = req.params;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Use find to find the appointment by title
        const appointment = user.appointments.find(app => app.title === appointmentTitle);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found", success: false });
        }

        // Remove the appointment from the user's appointments
        const index = user.appointments.indexOf(appointment);
        user.appointments.splice(index, 1);

        // Save the updated user
        await user.save();

        res.status(200).json({
            message: "Appointment deleted successfully",
            success: true,
            appointments: user.appointments
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Récupérer tous les rendez-vous d'un utilisateur
const getAllAppointments = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        res.status(200).json({
            message: "Appointments retrieved successfully",
            success: true,
            appointments: user.appointments
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Récupérer le rendez-vous le plus proche
const getClosestAppointment = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const now = new Date();
        const closestAppointment = user.appointments
            .filter(app => new Date(app.date) > now) // Filtrer les rendez-vous futurs
            .sort((a, b) => new Date(a.date) - new Date(b.date))[0]; // Trier par date la plus proche

        if (!closestAppointment) {
            return res.status(404).json({
                message: "No upcoming appointments found",
                success: false
            });
        }

        res.status(200).json({
            message: "Closest appointment retrieved successfully",
            success: true,
            appointment: closestAppointment
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
const getAppointmentsByDate = async (req, res) => {
    try {
        const userId = req.user._id; // Récupérer l'ID de l'utilisateur depuis le token ou la session
        const { date } = req.query; // Récupérer la date depuis les paramètres de requête (format YYYY-MM-DD)

        if (!date) {
            return res.status(400).json({ 
                message: "Date parameter is required", 
                success: false 
            });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                message: "User not found", 
                success: false 
            });
        }

        // Filtrer les rendez-vous en fonction de la date
        const filteredAppointments = user.appointments.filter((appointment) => {
            // Assurez-vous que la date de l'appointment est au format ISO 8601
            const appointmentDate = new Date(appointment.date).toISOString().split("T")[0];
            return appointmentDate === date;
        });

        res.status(200).json({
            message: "Appointments retrieved successfully",
            success: true,
            appointments: filteredAppointments
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
// Récupérer le nombre de rendez-vous d'un utilisateur
const getAppointmentsCount = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const appointmentsCount = user.appointments.length;

        res.status(200).json({
            message: "Appointments count retrieved successfully",
            success: true,
            appointmentsCount: appointmentsCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};



module.exports = {
 updateUser ,
 getUser,
 addAppointment,
 updateAppointment,
 deleteAppointment,
 getAllAppointments,
 getClosestAppointment,
 getAppointmentsByDate,
 getAppointmentsCount
};