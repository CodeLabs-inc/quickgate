const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    licensePlate: {
        type: String,
        required: true
    },
    gateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gate',
        required: true
    },




    dates: {
        entry: {
            type: Date,
            required: true,
            default: Date.now
        },
        validated: {
            type: Date
        },
        paid: {
            type: Date
        },
        exit: {
            type: Date
        },
    },

    

    isPaid: {
        type: Boolean,
        default: false
    },
    value: {
        type: Number,
    }
})

module.exports = mongoose.model('Ticket', ticketSchema)