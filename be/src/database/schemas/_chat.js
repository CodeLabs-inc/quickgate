const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
    type: {
        type: String, 
        enum: ['text', 'image'],
    },
    role: {
        type: String, 
        enum: ['admin', 'operator'],
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const chatSchema = new mongoose.Schema({
    gateId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gate',
        required: true
    },
    messages: {
        type: [messageSchema],
        default: []
    }

})

module.exports = mongoose.model('Chat', chatSchema)