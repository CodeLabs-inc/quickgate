const mongoose = require("mongoose");

const gateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
    unique: true,
  },
  address: {
    city: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 10,
    },
    country: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 255,
      default: "República Dominicana",
    },
    street: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
    },
    cords: {
      latitude: {
        type: String,
      },
      longitude: {
        type: String,
      },
    },
  },

  rates: {
    hourly: {
      type: Number,
      default: 0,
    },
    daily: {
      type: Number,
      default: 0,
    },
  },
  booleans: {
    isActive: {
      type: Boolean,
      default: true,
    },
    isEV: {
      type: Boolean,
      default: false,
    },
    isHandicapped: {
      type: Boolean,
      default: false,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  settings: {
    capacity: {
      type: Number,
      default: 0,
    },

    payment_address: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      default: "DOP",
    },
    preferred_language: {
      type: String,
      default: "ES",
    },
    timezone: {
      type: String,
      default: "AST",
    },
  },

  vehiclesList: {
    type: Array,
    default: [], //Car plates inside the parking lot
  },

  openingSchedule: {
    days: {
      type: Array,
      default: [0, 1, 2, 3, 4, 5, 6],
    },
    hours: {
      open: {
        type: String,
        default: "08:00",
      },
      close: {
        type: String,
        default: "22:00",
      },
    },
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Gate", gateSchema);
