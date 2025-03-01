const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    gateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gate',
        required: true
    },
    price: {
        type: Number,
        required: false,
        default: 0
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
})

const historySchema = new mongoose.Schema({
    licensePlate: {
        type: String,
        required: true
    },
    stays: {
        type: Number,
        default: 1
    },
    debt: {
        type: Number,
        default: 0
    },
    register: {
        type: [registerSchema],
        default: []
    }
})

module.exports = mongoose.model('History', historySchema)