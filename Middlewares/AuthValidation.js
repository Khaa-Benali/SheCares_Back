const Joi = require('joi');

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        fullname: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
        dateOfBirth: Joi.date().required(), // Assurez-vous que la date est bien envoyée
        medicalHistory: Joi.object({
            hasBreastCancerHistory: Joi.boolean().default(false), // Défaut à false
            familyBreastCancerHistory: Joi.boolean().default(false), // Défaut à false
            lastMammogramDate: Joi.date().allow(null).optional(), // Peut être null ou une date
            notes: Joi.string().allow('').optional() // Peut être une chaîne vide
        }).optional(),
        lifeStyleFactors: Joi.object({
            alcohol: Joi.boolean().default(false), // Défaut à false
            smoking: Joi.boolean().default(false), // Défaut à false
            lowPhysicalActivity: Joi.boolean().default(false), // Défaut à false
            none: Joi.boolean().default(false) // Défaut à false
        }).optional(),
        regularCheckups: Joi.boolean().optional(),
        recentBreastChanges: Joi.boolean().optional(),
        breastChangeDescription: Joi.string().allow('').optional(),
        isMother: Joi.boolean().optional()
    });

    const { error } = schema.validate(req.body, { abortEarly: false }); // Valide tous les champs, pas juste le premier qui échoue

    if (error) {
        const errorMessages = error.details.map(detail => detail.message); // Collecte tous les messages d'erreur
        return res.status(400).json({ message: "Bad request", errors: errorMessages });
    }

    next();
};


const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad request", error: error.details[0].message });
    }
    next();
};
const updateUserValidation = (req, res, next) => {
    const schema = Joi.object({
        fullname: Joi.string().min(3).max(100).optional(), // Champ optionnel
        email: Joi.string().email().optional(), // Champ optionnel
        dateOfBirth: Joi.date().optional(), // Champ optionnel
        medicalHistory: Joi.object({
            hasBreastCancerHistory: Joi.boolean().optional(),
            familyBreastCancerHistory: Joi.boolean().optional(),
            lastMammogramDate: Joi.date().allow(null).optional(),
            notes: Joi.string().allow('').optional()
        }).optional(),
        lifeStyleFactors: Joi.object({
            alcohol: Joi.boolean().default(false).optional(),
            smoking: Joi.boolean().default(false).optional(),
            lowPhysicalActivity: Joi.boolean().default(false).optional(),
            none: Joi.boolean().default(true).optional()
        }).optional(),
        regularCheckups: Joi.boolean().optional(),
        recentBreastChanges: Joi.boolean().optional(),
        breastChangeDescription: Joi.string().allow('').optional(),
        isMother: Joi.boolean().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad request", error: error.details[0].message });
    }
    next(); // Passe à la prochaine fonction middleware si la validation réussit
};

module.exports = {
    signupValidation,
    loginValidation,
    updateUserValidation
};
