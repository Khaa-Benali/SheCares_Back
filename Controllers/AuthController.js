
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");


const signup = async (req, res) => {
    try {
        console.log('Signup request received:', req.body);
        const { fullname, email, password, dateOfBirth, medicalHistory, lifeStyleFactors, regularCheckups, recentBreastChanges, breastChangeDescription, isMother } = req.body;

        // Vérifie si l'utilisateur existe déjà
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({ message: 'User already exists, you can login', success: false });
        }

        // Crée un nouveau modèle utilisateur
        const userModel = new UserModel({
            fullname, 
            email, 
            password: await bcrypt.hash(password, 10), // Hachage du mot de passe
            dateOfBirth: new Date(dateOfBirth), // Conversion de la date
            medicalHistory: {
                hasBreastCancerHistory: medicalHistory?.hasBreastCancerHistory ?? false,
                familyBreastCancerHistory: medicalHistory?.familyBreastCancerHistory ?? false,
                lastMammogramDate: medicalHistory?.lastMammogramDate ? new Date(medicalHistory.lastMammogramDate) : null,
                notes: medicalHistory?.notes ?? ""
            },
            lifeStyleFactors: {
                alcohol: lifeStyleFactors?.alcohol ?? false,
                smoking: lifeStyleFactors?.smoking ?? false,
                lowPhysicalActivity: lifeStyleFactors?.lowPhysicalActivity ?? false,
                none: lifeStyleFactors?.none ?? false
            },
            regularCheckups: regularCheckups ?? false,
            recentBreastChanges: recentBreastChanges ?? false,
            breastChangeDescription: breastChangeDescription ?? "",
            isMother: isMother ?? false
        });

        await userModel.save();

        res.status(201).json({
            message: "Signup successful",
            success: true
        });
    } catch (err) {
        console.error('Signup error:', err); // Ajoute cette ligne pour plus de détails sur l'erreur
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMsg = 'Auth failed email or password is wrong';
        if (!user) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email,
                fullname: user.fullname
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}

module.exports = {
    signup,
    login
}