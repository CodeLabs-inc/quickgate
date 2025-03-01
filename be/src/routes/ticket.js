const express = require("express");
const { AuthenticateToken } = require("../utils/jwt");
const {
  Gate,
  Ticket,
  History,
  Vehicles,
  Subscriptions,
  Account,
} = require("../database/schemas");
const router = express.Router();

// ------- CAMERA APIS (FOR CARS ENTERING OR EXITING THE GATE) -------

/* 
  @route  GET /ticket/enter/:gateId
  @desc   The routes is used FROM THE CAMERA READER TO REGISTER A CAR ENTRY
*/
router.route("/enter/:gateId").post(async (req, res) => {
  const { gateId } = req.params;
  const { plate } = req.body;

  if (!plate) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  //1. Check if the gate exists
  const checkExist = await Gate.findById(gateId).select("_id");

  if (!checkExist) {
    return res.status(404).json({
      success: false,
      message: "Gate not found",
    });
  }

  //2. Check if the gate is active
  const checkActive = await Gate.findById(gateId).select("booleans.isActive");
  if (!checkActive.booleans.isActive) {
    return res.status(400).json({
      success: false,
      message: "Gate is not active",
    });
  }

  //3. Check if the gate is not full
  const checkFull = await Gate.findById(gateId).select(
    "vehiclesList settings.capacity"
  );
  if (checkFull.vehiclesList.length >= checkFull.settings.capacity) {
    return res.status(400).json({
      success: false,
      message: "Gate is full, wait for a vehicle to exit",
    });
  }

  //4. Check if the plate is alredy registered inside any gate
  const checkPlate = await Ticket.findOne({
    licensePlate: plate,
    "dates.exit": null,
  });
  if (checkPlate) {
    return res.status(400).json({
      success: false,
      message:
        "This plate is already present in another parking, please contact assistance",
    });
  }

  //5 Check if the plate has a subscription in the current gate if so set ticket to paid and price to 0
  const checkSubscription = await Subscriptions.findOne({
    licensePlate: plate,
    gateId,
    endDate: { $gte: Date.now() },
  });

  //5. Create a new ticket
  const newTicket = new Ticket({
    licensePlate: plate,
    gateId,
    isPaid: checkSubscription ? true : false,
    value: checkSubscription ? 0 : null,
  });

  await newTicket.save();

  //6. Add the plate to the gate
  await Gate.findByIdAndUpdate(gateId, { $push: { vehiclesList: plate } });

  //7. Register history of the plate (if it's the first time create an entry else update the stays and push the register)
  const checkHistory = await History.findOne({ licensePlate: plate });

  if (!checkHistory) {
    const newHistory = new History({
      licensePlate: plate,
      stays: 1,
      register: [
        {
          ticketId: newTicket._id,
          gateId,
          date: Date.now(),
        },
      ],
    });

    await newHistory.save();
  } else {
    await History.findByIdAndUpdate(checkHistory._id, {
      $inc: { stays: 1 },
      $push: {
        register: {
          ticketId: newTicket._id,
          gateId,
          date: Date.now(),
        },
      },
    });
  }

  return res.status(200).json({
    success: true,
    message: "Open Gate",
  });
});

/* 
  @route  GET /ticket/exit/:gateId
  @desc   The routes is used FROM THE CAMERA READER TO REGISTER A CAR EXIT
*/
router.route("/exit/:gateId").post(async (req, res) => {
  const { gateId } = req.params;
  const { plate } = req.body;

  if (!plate) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  //1. Check if the gate exists
  const checkExist = await Gate.findById(gateId).select("_id rates");
  if (!checkExist) {
    return res.status(404).json({
      success: false,
      message: "Gate not found",
    });
  }

  //2. Check if the gate is active
  const checkActive = await Gate.findById(gateId).select("booleans.isActive");
  if (!checkActive.booleans.isActive) {
    return res.status(400).json({
      success: false,
      message: "Gate is not active",
    });
  }

  //3. Check if the plate is alredy registered inside the gate
  const checkPlate = await Ticket.findOne({
    licensePlate: plate,
    gateId,
    "dates.exit": null,
  });
  if (!checkPlate) {
    return res.status(400).json({
      success: false,
      message: "This plate is not present in this gate",
    });
  }

  //4 Check if plate is associated with an account that has balance
  const checkOwnerBalance = await Vehicles.findOne({
    licensePlate: plate,
  }).select("ownerId");


  if (!checkOwnerBalance) {
    //Plate is not associated with an account
  } else {
    if (!checkPlate.isPaid) {
      //Plate is associated with an account (check if he can pay now off balance, calculate the amount and deduct)
      console.log("Account has car registered, cheking balance..");
      const checkAccountBalance = await Account.findById(
        checkOwnerBalance.ownerId
      ).select("finances.balance");

      const entryTime = checkPlate.dates.entry;
      const currentTime = new Date();
      const diffTime = currentTime - entryTime;
      const diffTimeInHours = diffTime / 1000 / 60 / 60;

      const days = Math.floor(diffTimeInHours / 24);
      const hours = Number((diffTimeInHours % 24).toFixed(2));

      const hourlyRate = checkExist.rates.hourly;
      const dailyRate = checkExist.rates.daily;
      const totalAmount = days * dailyRate + hours * hourlyRate;

      if (checkAccountBalance.finances.balance < totalAmount) {
        return res.status(400).json({
          success: false,
          message:
            "Car is associated to an account with insufficient funds, please pay the ticket normally or top up the account",
        });
      }

      //4.1 Deduct the amount from the account
      await Account.findByIdAndUpdate(checkOwnerBalance.ownerId, {
        $inc: { "finances.balance": -totalAmount },
      });

      //4.2 Set the ticket as paid
      await Ticket.findByIdAndUpdate(checkPlate._id, {
        $set: {
          isPaid: true,
          "dates.validated": Date.now(),
          "dates.paid": Date.now(),
          "dates.exit": Date.now(),
          value: totalAmount
        },
      });
      console.log("Stay was paid off balance");

      //4.3 Remove the plate from the fame
      await Gate.findByIdAndUpdate(gateId, { $pull: { vehiclesList: plate } });

      return res.status(200).json({
        success: true,
        message: "Close Gate",
      });
    }
  }

  /* Fast Pay (No car registered to an account) routine */

  //4.1 Check if the Ticked is Paid
  if (!checkPlate.isPaid) {
    return res.status(400).json({
      success: false,
      message: "The ticket is not paid",
    });
  }

  //4.2 Close the ticket
  await Ticket.findByIdAndUpdate(checkPlate._id, {
    $set: { "dates.exit": Date.now() },
  });

  //5. Remove the plate from the gate
  await Gate.findByIdAndUpdate(gateId, { $pull: { vehiclesList: plate } });

  return res.status(200).json({
    success: true,
    message: "Close Gate",
  });
});

// ------- FAST PAY (NO ACCOUNT) -------

/* 
  @route  GET /ticket/pay/lookup/:licensePlate
  @desc   This route is looking up the plate and lookup the ticket
*/
router.route("/pay/lookup/:licensePlate").get(async (req, res) => {
  const { licensePlate } = req.params;

  const checkTicket = await Ticket.findOne({
    licensePlate,
    "dates.exit": null,
  });

  console.log(checkTicket);

  if (!checkTicket) {
    return res.status(404).json({
      success: false,
      message: "Ticket not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Ticket Found",
    data: checkTicket,
  });
});

/* 
  @route  GET /ticket/pay/calculate/:ticketId
  @desc   The route fetches the current ticket and calculates the amount to pay
*/
router.route("/pay/calculate/:ticketId").get(async (req, res) => {
  const { ticketId } = req.params;

  const checkTicket = await Ticket.findById(ticketId);
  if (!checkTicket) {
    return res.status(404).json({
      success: false,
      message: "Ticket not found",
    });
  }

  const checkGate = await Gate.findById(checkTicket.gateId).select("rates");
  const entryTime = checkTicket.dates.entry;

  //5. Calculate the current time and the difference between the entry time
  const currentTime = new Date();
  const diffTime = currentTime - entryTime;
  const diffTimeInHours = diffTime / 1000 / 60 / 60;
  //console.log(diffTimeInHours);

  //6. Calculate days and hours
  const days = Math.floor(diffTimeInHours / 24);
  const hours = Number((diffTimeInHours % 24).toFixed(2));
  //console.log({ days, hours });

  //7. Calculate the total amount to pay
  const hourlyRate = checkGate.rates.hourly;
  const dailyRate = checkGate.rates.daily;
  const totalAmount = days * dailyRate + hours * hourlyRate;
  console.log("to pay: ", totalAmount);

  return res.status(200).json({
    success: true,
    message: "Amount calculated",
    data: {
      days,
      hours,
      totalAmount,

      licensePlate: checkTicket.licensePlate,
      dates: {
        entry: entryTime,
        validated: checkTicket.dates.validated ?? null,
      },
      rates: {
        hourly: hourlyRate,
        daily: dailyRate,
      },
    },
  });
});

/* 
  @route  PUT /ticket/pay/confirm/:ticketId
  @desc   This route is when user confirms the price calculated (has 5 minutes to complete payment, checked on next endpoint)
*/
router.route("/pay/confirm/:ticketId").put(async (req, res) => {
  const { ticketId } = req.params;
  const { amount } = req.body;

  const checkTicket = await Ticket.findById(ticketId);
  if (!checkTicket) {
    return res.status(404).json({
      success: false,
      message: "Ticket not found",
    });
  }
  const now = Date.now();

  checkTicket.dates.validated = now;
  const saveTicket = await checkTicket.save();

  if (!saveTicket) {
    return res.status(400).json({
      success: false,
      message: "Error saving the ticket",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Payment confirmed",
    data: {
      ticketId: checkTicket._id,
      validated: now,
    },
  });
});

/* 
  @route GET /ticket/informations/:licensePlate
  @desc  This route is used to fetch the CURRENT (currently parked) ticket informations
*/
router.route("/informations/:licensePlate").get(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success || auth.account.user.type !== "operator") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const checkTicket = await Ticket.findOne({
    licensePlate: req.params.licensePlate,
    gateId: auth.account.gateId,
    "dates.exit": null,
  });

  if (!checkTicket) {
    return res.status(404).json({
      success: false,
      message: "Ticket not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Ticket found",
    data: checkTicket,
  });
});

/* 
  @route GET /ticket/manual-validation/:licensePlate
  @desc  This route is used to manually validate a ticket (free of charge or paid locally[offline, not handled by us])
*/
router.route("/manual-validation/:licensePlate").put(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success || auth.account.user.type !== "operator") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const checkTicket = await Ticket.findOne({
    licensePlate: req.params.licensePlate,
    gateId: auth.account.gateId,
    "dates.exit": null,
  });

  if (!checkTicket) {
    return res.status(404).json({
      success: false,
      message: "Ticket not found",
    });
  }

  checkTicket.dates.validated = Date.now();
  checkTicket.dates.paid = Date.now();
  checkTicket.isPaid = true;
  checkTicket.value = 0;

  const saveTicket = await checkTicket.save();

  if (!saveTicket) {
    return res.status(400).json({
      success: false,
      message: "Error saving the ticket",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Ticket validated",
    data: saveTicket,
  });
});

/* 
  @route GET /ticket/statistics/latest-seven-days
  @desc  This route is used to fetch the statistics of the last seven days
*/
router.route("/statistics/last-seven-days").get(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success || auth.account.user.type !== "operator") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // Get the date 6 days ago to include today as the last day in the 7-day period
  const sixDaysAgo = new Date();
  sixDaysAgo.setDate(sixDaysAgo.getDate() - 5);
  sixDaysAgo.setHours(0, 0, 0, 0); // Ensure the date starts at midnight

  // Find tickets within the last 7 days, including today
  const checkTickets = await Ticket.find({
    gateId: auth.account.gateId,
    "dates.entry": { $gte: sixDaysAgo },
  });

  // Accumulate counts by date
  const data = {};

  checkTickets.forEach((ticket) => {
    const dayDate = new Date(ticket.dates.entry);
    const formattedDate = dayDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

    if (!data[formattedDate]) {
      data[formattedDate] = 1;
    } else {
      data[formattedDate] += 1;
    }
  });

  // Generate all dates from 6 days ago to today
  const result = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(sixDaysAgo);
    currentDate.setDate(sixDaysAgo.getDate() + i);
    const formattedDate = currentDate.toISOString().split("T")[0];

    // Ensure each date has a count, default to 0 if not found
    result.push({
      date: formattedDate,
      count: data[formattedDate] || 0,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Statistics found",
    data: result,
  });
});

/* 
  @route GET /ticket/statistics/week-days
  @desc  This route is used to fetch the statistics of the week days
*/
router.route("/statistics/week-days").get(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success || auth.account.user.type !== "operator") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // Find all tickets for the gate
  const checkTickets = await Ticket.find({
    gateId: auth.account.gateId,
  });

  // Initialize all days of the week with count 0
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const data = days.reduce((acc, day) => {
    acc[day] = 0;
    return acc;
  }, {});

  // Count tickets for each day of the week
  checkTickets.forEach((ticket) => {
    const dayIndex = new Date(ticket.dates.entry).getDay();
    data[days[dayIndex]] += 1; // Increment the count for the corresponding day
  });

  // Convert the data object to an array of { day, count }
  const result = days.map((day) => ({
    day,
    count: data[day],
  }));

  return res.status(200).json({
    success: true,
    message: "Statistics found",
    data: result,
  });
});

// ------- USER (APP) -------

/* 
  @route  GET /ticket/user/:userId
  @desc   Fetch all tickets for a specific user
*/
router.route("/user").get(async (req, res) => {
  const auth = await AuthenticateToken(req);
  if (!auth.success) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  //1. Find user car's License Plates
  const userCars = await Vehicles.find({ ownerId: auth.account._id }).select(
    "licensePlate"
  );

  //2. Find all tickets for the user cars
  const userTickets = await Ticket.find({
    licensePlate: { $in: userCars.map((car) => car.licensePlate) },
    "dates.exit": null,
  });

  //3 For each ticket found get the gate data
  const allGates = await Gate.find({}).select("name _id address");
  const mappedUserGates = userTickets.map((ticket) => {
    const gateData = allGates.find(
      (gate) => gate._id.toString() == ticket.gateId
    );
    return {
      ...ticket._doc,
      gateData,
    };
  });

  return res.status(200).json({
    success: true,
    message: "Tickets found",
    data: mappedUserGates,
  });
});

/* 
  @route  GET /ticket/user/free-access
  @desc   Fetch all free access subscriptions for a specific user
*/
router.route("/user/free-access").get(async (req, res) => {
  const auth = await AuthenticateToken(req);
  if (!auth.success) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  //1. Find user car's License Plates
  const userCars = await Vehicles.find({ ownerId: auth.account._id }).select(
    "licensePlate"
  );

  const searchSubscriptions = await Subscriptions.find({
    licensePlate: { $in: userCars.map((car) => car.licensePlate) },
  }).populate({
    path: "gateId",
    model: "Gate",
    select: "name address _id",
    rename: "gateData",
  });

  return res.status(200).json({
    success: true,
    message: "Tickets found",
    data: searchSubscriptions,
  });
});

module.exports = router;
