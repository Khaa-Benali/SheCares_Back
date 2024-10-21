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

module.exports = {
 updateUser ,
 getUser
};