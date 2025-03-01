const mongoose = require('mongoose');


const subscriptionSchema = new mongoose.Schema({
    licensePlate: {
        type: String,
        required: true
    },
    gateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gate',
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },

})

module.exports = mongoose.model('Subsctiptions', subscriptionSchema)