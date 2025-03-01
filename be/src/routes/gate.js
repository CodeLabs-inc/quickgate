const express = require("express");
const { AuthenticateToken } = require("../utils/jwt");
const { Gate, Ticket, Account, Subscriptions } = require("../database/schemas");
const router = express.Router();

router.route("/").get(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success && auth.account.user.type !== "admin") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const { page, limit, filter, search } = req.query;


  const query = {
    $or: [{ name: { $regex: search, $options: "i" } }],
  };

  const searchGates = await Gate.find(query)
    .limit(parseInt(limit))
    .skip(parseInt(page - 1) * parseInt(limit));
  //.select("-vehiclesList");

  const updatedGates = searchGates.map((gate) => ({
    ...gate.toObject(),
    vehiclesList: gate.vehiclesList.length,
  }));

  return res.status(200).json({
    success: true,
    data: updatedGates,
  });
});
router.route("/inputselect").get(async (req, res) => {
  /* const auth = await AuthenticateToken(req);

  if (!auth.success) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  } */

  const searchGates = await Gate.find().select("name _id")

  return res.status(200).json({
    success: true,
    data: searchGates,
  });
});
router.route("/get/:id").get(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success && auth.account.user.type !== "admin") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const { id } = req.params;

  const gate = await Gate.findById(id);

  if (!gate) {
    return res.status(404).json({
      success: false,
      message: "Gate not found",
    });
  }

  //Find users with operator access to the gate panel 
  const users = await Account.find({ gateId: gate._id }).select("user email");

  const updatedGate = {
    ...gate.toObject(),
    vehiclesList: gate.vehiclesList.length,
    operators: users
  }


  return res.status(200).json({
    success: true,
    data: updatedGate,
  });
});
router.route("/dashboard/get").get(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success && auth.account.user.type !== "operator") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const gate = await Gate.findById(auth.account.gateId);

  if (!gate) {
    return res.status(404).json({
      success: false,
      message: "Gate not found",
    });
  }


  return res.status(200).json({
    success: true,
    data: gate,
  });
});
router.route("/create").post(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success && auth.account.user.type !== "admin") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const { name, city, street } = req.body;

  if (!name || !city || !street) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    const newGate = new Gate({
      name,
      address: {
        city,
        street,
      },
    });

    await newGate.save();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Gate created",
  });
});
router.route("/transit").get(async (req, res) => {
    const { page, limit, search } = req.query;

    const auth = await AuthenticateToken(req);

    if (!auth.success && auth.account.user.type !== "admin" && auth.account.user.type !== "operator") {
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

  
    try {
      // Fetch filtered and paginated results
      //query if auth.auccount.gateId is not null
      const query = {
        $and: [
          auth.account.gateId ? { gateId: auth.account.gateId } : {},
          {
            $or: [
              { licensePlate: { $regex: search.toString(), $options: "i" } }
            ]
          }
        ]
      };
      

      const searchTickets = await Ticket.find(query)
        .sort({ 'date.exit': 1 }) // Sort by 'date.entry' descending
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));
  
      return res.status(200).json({
        success: true,
        data: searchTickets,
      });
    } catch (error) {

      return res.status(500).json({
        success: false,
        message: "Error fetching tickets",
        error: error.message,
      });
    }
});


router.route("/add/operator").post(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success && auth.account.user.type !== "admin") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const { gateId, accountId } = req.body;

  if (!gateId || !accountId) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  const gate = await Gate.findById(gateId).select("_id");
  if (!gate) {
    return res.status(404).json({
      success: false,
      message: "Gate not found",
    });
  }


  const account = await Account.findById(accountId).select("-password");

  if (!account) {
    return res.status(404).json({
      success: false,
      message: "Account not found",
    });
  }

  if (account.gateId){
    return res.status(400).json({
      success: false,
      message: "Account already assigned to a gate",
    });
  }
  
  account.gateId = gate._id;

  await account.save();

  return res.status(200).json({
    success: true,
    message: "Operator added to gate",
    data: account
  });
})
router.route("/delete/operator").delete(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success && auth.account.user.type !== "admin") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const { gateId, accountId } = req.body;

  if (!gateId || !accountId) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  const gate = await Gate.findById(gateId).select("_id");
  if (!gate) {
    return res.status(404).json({
      success: false,
      message: "Gate not found",
    });
  }


  const account = await Account.findById(accountId);

  if (!account) {
    return res.status(404).json({
      success: false,
      message: "Account not found",
    });
  }
  //delete account.gateId;
  account.gateId = null;
  

  await account.save();

  return res.status(200).json({
    success: true,
    message: "Operator added to gate",
  });
})

router.route("/subscriptions/").get(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const { page, limit, search } = req.query;

  const query = {
    $or: [{ licensePlate: { $regex: search || "", $options: "i" } }],
    ...(auth.account.gateId ? { gateId: auth.account.gateId } : {}),
  };
  
  

  const searchSubscriptions = await Subscriptions.find(query)
    .limit(parseInt(limit))
    .skip(parseInt(page - 1) * parseInt(limit));
  //.select("-vehiclesList");

  return res.status(200).json({
    success: true,
    data: searchSubscriptions,
  });
});
router.route("/subscriptions/:id").get(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const { id } = req.params;

  const subscription = await Subscriptions.findById(id);

  if (!subscription) {
    return res.status(404).json({
      success: false,
      message: "Subscription not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: subscription,
  });
});
router.route("/subscriptions/").post(async (req, res) => {
  console.log(req.body);
  const auth = await AuthenticateToken(req);

  if (!auth.success) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (auth.account.user.type !== "operator" && !auth.account.gateId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const { licensePlate, duration } = req.body;

  if ( !licensePlate || !duration) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }



  //Calculate end date, duration in days from now
  const endDate = new Date(new Date().getTime() + duration * 24 * 60 * 60 * 1000);

  const newSubscription = new Subscriptions({
    gateId: auth.account.gateId,
    licensePlate,
    endDate
  })

  await newSubscription.save();

  return res.status(200).json({
    success: true,
    message: "Subscription created",
  });
});

router.route("/settings/gate/get").get(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (auth.account.user.type !== "operator" && !auth.account.gateId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }


  const gate = await Gate.findById(auth.account.gateId).select("-vehiclesList");

  if (!gate) {
    return res.status(404).json({
      success: false,
      message: "Gate not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: gate,
  });
})
router.route("/settings/gate/map").put(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (auth.account.user.type !== "operator" && !auth.account.gateId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }


  const { lat, lng } = req.body;

  const gate = await Gate.findById(auth.account.gateId);

  if (!gate) {
    return res.status(404).json({
      success: false,
      message: "Gate not found",
    });
  }

  gate.address.cords = {
    latitude: lat,
    longitude: lng,
  };

  await gate.save();

  return res.status(200).json({
    success: true,
    message: "Map updated",
  });
})
router.route("/settings/gate/booleans").put(async (req, res) => {
  const auth = await AuthenticateToken(req);

  const {
    isActive,
    isPrivate,
    isEV,
    isHandicapped
  } = req.body;

  if (auth.account.user.type !== "operator" && !auth.account.gateId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  console.log(req.body);

  const gate = await Gate.findById(auth.account.gateId);
  if (!gate) {
    return res.status(404).json({
      success: false,
      message: "Gate not found",
    });
  }

  gate.booleans = {
    isActive: isActive ?? gate.booleans.isActive,
    isPrivate : isPrivate ?? gate.booleans.isPrivate,
    isEV: isEV ?? gate.booleans.isEV,
    isHandicapped: isHandicapped ?? gate.booleans.isHandicapped
  }

  await gate.save();


  return res.status(200).json({
    success: true,
    message: "Booleans updated",
  })
})
router.route("/settings/gate/informations").put(async (req, res) => {
  const auth = await AuthenticateToken(req);

  const {
    name,
    city,
    street,
    capacity,
    daysOpen,
    openTime,
    closeTime
  } = req.body;


  console.log(daysOpen)


  if (auth.account.user.type !== "operator" && !auth.account.gateId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const gate = await Gate.findById(auth.account.gateId);
  if (!gate) {
    return res.status(404).json({
      success: false,
      message: "Gate not found",
    });
  }


  gate.name = name ?? gate.name;
  gate.address.street = street ?? gate.address.street;
  gate.address.city = city ?? gate.address.city;
  gate.settings.capacity = capacity ?? gate.settings.capacity;
  gate.openingSchedule.days = daysOpen ?? gate.openingSchedule.days;
  gate.openingSchedule.hours.open = openTime ?? gate.openingSchedule.hours.open;
  gate.openingSchedule.hours.close = closeTime ?? gate.openingSchedule.hours.close;


  await gate.save();

  return res.status(200).json({
    success: true,
    message: "Informations updated",
  })

})
router.route("/settings/gate/rates").put(async (req, res) => {
  const auth = await AuthenticateToken(req);

  const {
    hourly,
    daily,
  } = req.body;

  if (auth.account.user.type !== "operator" && !auth.account.gateId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const gate = await Gate.findById(auth.account.gateId);
  if (!gate) {
    return res.status(404).json({
      success: false,
      message: "Gate not found",
    });
  }

  gate.rates = {
    hourly: Number(hourly) ?? gate.rates.hourly,
    daily: Number(daily) ?? gate.rates.daily,
  }

  await gate.save();

  return res.status(200).json({
    success: true,
    message: "Rates updated",
  })
})
router.route("/settings/gate/billing").put(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth || auth.account.user.type !== "operator" && !auth.account.gateId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const {
    payment_address,
    currency
  } = req.body;

  const gate = await Gate.findById(auth.account.gateId);
  if (!gate) {
    return res.status(404).json({
      success: false,
      message: "Gate not found",
    });
  }

  gate.settings.payment_address = payment_address ?? gate.settings.payment_address;
  gate.settings.currency = currency ?? gate.settings.currency;
  
  await gate.save();

  return res.status(200).json({
    success: true,
    message: "Billing updated",
  })
  

})





/* APP */

router.route("/app/all").get(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  //const { page, limit, search } = req.query;

  /* const query = {
    $or: [{ licensePlate: { $regex: search, $options: "i" } }],
  }; */

  const searchGates = await Gate.find({
    'booleans.isActive': true
  }).select("address name rates.hourly settings.capacity");
    //.find(query)
    //.limit(parseInt(limit))
    //.skip(parseInt(page - 1) * parseInt(limit));
    

  return res.status(200).json({
    success: true,
    data: searchGates,
  });
})

  

module.exports = router;
