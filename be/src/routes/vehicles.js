const express = require("express");
const { AuthenticateToken } = require("../utils/jwt");
const { Gate, Ticket, History, Vehicles } = require("../database/schemas");
const router = express.Router();

router.route("/").get(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (
    (!auth.success && auth.account.user.type !== "admin") ||
    auth.account.user.type !== "operator"
  ) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (auth.account.user.type === "operator" && !auth.account.gateId) {
    return res.status(401).json({
      success: false,
      message: "You are operator but you are not assigned to any gate",
    });
  }

  // Fetch filtered and paginated results
  const { page, limit, filter, search } = req.query;

  const query = {
    $or: [{ licensePlate: { $regex: search.toString(), $options: "i" } }],
  };

  const searchGates = await History.find(query)
    .select("-register")
    .limit(parseInt(limit))
    .skip(parseInt(page - 1) * parseInt(limit));

    console.log(searchGates);

  return res.status(200).json({
    success: true,
    data: searchGates,
  });
});


//User add vehicle
router.route("/add").post(async (req, res) => {
  const auth = await AuthenticateToken(req);
  

  if (!auth.success) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const { licensePlate, vehicleName } = req.body;
  console.log(licensePlate, vehicleName);

  if (!licensePlate || !vehicleName) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  const newVehicle = new Vehicles({
    ownerId: auth.account._id,
    licensePlate,
    vehicleName
  });

  await newVehicle.save();

  return res.status(200).json({
    success: true,
    message: "Vehicle added successfully",
  });
});
router.route("/personal").get(async (req, res) => {
  const auth = await AuthenticateToken(req);

  

  if (!auth.success) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const vehicles = await Vehicles.find({ ownerId: auth.account._id });

  return res.status(200).json({
    success: true,
    data: vehicles,
  });
});
router.route("/delete/:id").delete(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  await Vehicles.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "Vehicle deleted successfully",
  });
});

module.exports = router;
