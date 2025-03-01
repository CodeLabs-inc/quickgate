const mongoose = require('mongoose');


const vehiclesSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    licensePlate: {
        type: String,
        required: true
    },
    vehicleName:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Vehicles', vehiclesSchema)