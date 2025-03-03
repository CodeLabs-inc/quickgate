const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },


  ip_address: {
    type: String,
    required: true,
  },
  
  gateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gate",
    required: true,
  },
});

module.exports = mongoose.model("Device", deviceSchema);
