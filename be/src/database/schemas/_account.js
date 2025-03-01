const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    licensePlate: {
        type: String,
        required: true,
    },
})

const accountSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    user: {
        name: {
            type: String,
            default: ""
        },
        surname: {
            type: String,
            default: ""
        },
        profile_picture: {
            type: String,
            default: ""
        },
        birthdate: {
            type: Date,
            default: ""
        },
        type: {
            type: String,
            enum: ['user', 'admin', 'operator'],
            default: 'user'
        },
    },
    gateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gate',
    },
    contacts:{
        phone:{
            type: String,
            default: ""
        },
        address:{
            type: String,
            default: ""
        },
    },
    settings:{
        currency: {
            type: String,
            default: "USD"
        },
        preferred_language: {
            type: String,
            default: "en"
        },
        timezone: {
            type: String,
            default: "UTC"
        },
    },
    finances: {
        stripe_customer_id: { 
            type: String, default: "" 
        },
        stripe_payment_method: {
            type: String, default: ""
        },
        stripe_payment_methods: {
            type: [String],
            default: []
        },
        billing_address: {
            type: String,
            default: ""
        },
        balance: {
            type: Number,
            default: 0
        },
    },
    booleans: {
        isVerified: {
            type: Boolean,
            default: false
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
    },
    tokens: {
        verificationToken: {
            type: String 
        },
        passwordResetToken: {
            type: String
        },
    },
    notifications: {
        balanceUse: {
            type: Boolean,
            default: false
        },
        parking: {
            type: Boolean,
            default: false
        },
        exit: {
            type: Boolean,
            default: false
        },
        lowBalance: {
            type: Boolean,
            default: false
        },
        alerts: {
            type: Boolean,
            default: false
        }
    }
    

})

module.exports = mongoose.model('Account', accountSchema)