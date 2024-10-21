const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    medicalHistory: {
        hasBreastCancerHistory: {
            type: Boolean,
            default: false
        },
        familyBreastCancerHistory: {
            type: Boolean,
            default: false
        },
        lastMammogramDate: {
            type: Date,
            default: null
        },
        notes: {
            type: String,
            trim: true
        }
    },
    lifeStyleFactors: {
        alcohol: {
            type: Boolean,
            default: false
        },
        smoking: {
            type: Boolean,
            default: false
        },
        lowPhysicalActivity: {
            type: Boolean,
            default: false
        },
        none: {
            type: Boolean,
            default: true // Si aucun facteur de risque n'est présent
        }
    },
    regularCheckups: {
        type: Boolean,
        default: false // Si la personne fait des checkups réguliers
    },
    recentBreastChanges: {
        type: Boolean,
        default: false // Si la personne a remarqué des changements dans ses seins récemment
    },
    breastChangeDescription: {
        type: String,
        trim: true,
        default: '' // Description des changements (douleurs, grosseurs, changements de la peau, etc.)
    },
    isMother: {
        type: Boolean,
        default: false // Indique si l'utilisateur est une mère ou non
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;