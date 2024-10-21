const Joi = require('joi');

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        fullname: Joi.string().min(3).max(100).required(), // Changement de 'name' à 'fullname'
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
        age: Joi.number().integer().min(0).required(), // Ajout de l'âge
        dateOfBirth: Joi.date().required(), // Ajout de la date de naissance
        medicalHistory: Joi.object({
            hasBreastCancerHistory: Joi.boolean(),
            familyBreastCancerHistory: Joi.boolean(),
            lastMammogramDate: Joi.date().allow(null),
            notes: Joi.string().allow('').optional() // Permet un champ optionnel
        }).optional(), // Rendre cette section optionnelle
        lifeStyleFactors: Joi.object({
            alcohol: Joi.boolean().default(false),
            smoking: Joi.boolean().default(false),
            lowPhysicalActivity: Joi.boolean().default(false),
            none: Joi.boolean().default(true)
        }).optional(), // Rendre cette section optionnelle
        regularCheckups: Joi.boolean().optional(), // Champ optionnel
        recentBreastChanges: Joi.boolean().optional(), // Champ optionnel
        breastChangeDescription: Joi.string().allow('').optional(), // Champ optionnel
        isMother: Joi.boolean().optional() // Champ optionnel
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad request", error: error.details[0].message });
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
        age: Joi.number().integer().min(0).optional(), // Champ optionnel
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
