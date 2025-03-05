const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();

const { Account, Vehicles } = require("../database/schemas/");
const hashPassword = require("../utils/sha256");
const { signToken, AuthenticateToken } = require("../utils/jwt");
const emailVerificationCodegen = require("../utils/emailVerificationCodegen");
const {
  sendVerificationEmail,
  sendAdminAccountCreationEmail,
} = require("../utils/mail");
const { uploadFileToS3 } = require("../utils/uploadFileToS3");
const { getCallerList } = require("../sockets/calls");

router.route("/").get((req, res) => {
  res.send("Account route Online");
});

router.route("/register").post(async (req, res) => {
  const { email, password, name, surname, source } = req.body;

  if (!email || !password || !name || !surname) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const emailExists = await Account.findOne({
    email: email.trim().toLowerCase(),
  });
  if (emailExists) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exists" });
  }

  const newAccount = new Account({
    email: email.trim().toLowerCase(),
    password: hashPassword(password),
    user: {
      name: name,
      surname: surname,
    },
    booleans: {
      isVerified: source && source === "app" ? true : false,
    }
  });

  const save = await newAccount.save();

  if (!save) {
    return res
      .status(500)
      .json({ success: false, message: "Error saving account" });
  }

  res
    .status(200)
    .json({ success: true, message: "Account created successfully" });
});
router.route("/verify/send").post(async (req, res) => {
  const { email } = req.body;

  const searchAccount = await Account.findOne({ email: email.toLowerCase() });

  if (!searchAccount) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials - Email is incorrect",
    });
  }

  if (searchAccount.booleans.isVerified === true) {
    return res
      .status(401)
      .json({ success: false, message: "Account has already been activated" });
  }

  const code = emailVerificationCodegen();

  searchAccount.tokens.verificationToken = code;
  const save = await searchAccount.save();

  if (!save) {
    return res
      .status(500)
      .json({ success: false, message: "Error saving account" });
  }

  const sendEmail = await sendVerificationEmail(code, email);

  if (!sendEmail) {
    searchAccount.tokens.verificationToken = code;
    await searchAccount.save();

    return res
      .status(500)
      .json({ success: false, message: "Error sending email" });
  } else {
    return res
      .status(200)
      .json({ success: true, message: "Verification code sent successfully" });
  }

  res
    .status(200)
    .json({ success: true, message: "Verification code sent successfully" });
});
router.route("/verify").post(async (req, res) => {
  const { email, token } = req.body;

  if (!email || !token) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  if (token.length !== 6) {
    return res.status(400).json({ success: false, message: "Invalid token" });
  }

  const searchAccount = await Account.findOne({
    email: email.toLowerCase(),
    "tokens.verificationToken": token,
  });

  if (!searchAccount) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials - Email or Token is incorrect",
    });
  }

  if (searchAccount.isVerified === true) {
    return res
      .status(401)
      .json({ success: false, message: "Account has already been activated" });
  }

  searchAccount.booleans.isVerified = true;
  searchAccount.tokens.verificationToken = "";

  const save = await searchAccount.save();

  if (!save) {
    return res
      .status(500)
      .json({ success: false, message: "Error saving account" });
  }

  res
    .status(200)
    .json({ success: true, message: "Account verified successfully" });
});
router.route("/login").post(async (req, res) => {
  const { email, password } = req.body;
  const searchAccount = await Account.findOne({
    email: email.toLowerCase(),
    password: hashPassword(password),
  });

  if (!searchAccount) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials - Email or Password is incorrect",
    });
  }


  const countVehicles = await Vehicles.find({ ownerId: searchAccount._id }).countDocuments();

  const token = signToken(email.toLowerCase(), hashPassword(password));

  res.status(200).json({
    success: true,
    message: "Login succesfull",
    isFirstLogin: !searchAccount.booleans.isVerified,
    vehicleCount: countVehicles,
    role: searchAccount.user.type,
    data: token,
  });
});
router.route("/authenticate").get(async (req, res) => {
  const auth = await AuthenticateToken(req, res);

  if (!auth.success) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Access" });
  }
  res
    .status(200)
    .json({ success: true, message: "Authorized Access", data: auth });
});

/* Settings */
router.route("/settings/profile").get(async (req, res) => {
  const auth = await AuthenticateToken(req, res);

  if (!auth.success) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Access" });
  }

  const searchAccount = await Account.findOne({
    email: auth.account.email,
  }).select("user contacts");

  if (!searchAccount) {
    return res
      .status(500)
      .json({ success: false, message: "Error fetching account" });
  }

  res.status(200).json({
    success: true,
    message: "Account fetched successfully",
    data: searchAccount,
  });
});
router
  .route("/settings/profile/picture")
  .put(upload.single("file"), async (req, res) => {
    const auth = await AuthenticateToken(req, res);

    if (!auth.success) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const pictureUrl = await uploadFileToS3(
      req.file.buffer,
      req.file.originalname
    );

    const searchAccount = await Account.findByIdAndUpdate(auth.account._id, {
      "user.profile_picture": pictureUrl,
    });

    if (!searchAccount) {
      return res
        .status(500)
        .json({ success: false, message: "Error updating profile picture" });
    }

    res
      .status(200)
      .json({ success: true, message: "Profile picture updated successfully" });
  });
router.route("/settings/profile").put(async (req, res) => {
  const { name, surname, birthdate, address, phone } = req.body;

  if (!name || !surname) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  console.log(birthdate, address, phone);

  const auth = await AuthenticateToken(req, res);

  if (!auth.success) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Access" });
  }

  const searchAccount = await Account.findByIdAndUpdate(auth.account._id, {
    "user.name": name,
    "user.surname": surname,
    "user.birthdate": new Date(birthdate),
    "contacts.address": address,
    "contacts.phone": phone,
  });

  if (!searchAccount) {
    return res
      .status(500)
      .json({ success: false, message: "Error updating profile" });
  }

  res
    .status(200)
    .json({ success: true, message: "Profile updated successfully" });
});
router.route("/settings/access").get(async (req, res) => {
  const auth = await AuthenticateToken(req, res);

  if (!auth.success) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Access" });
  }

  const searchAccount = await Account.findById(auth.account._id).select(
    "email"
  );

  if (!searchAccount) {
    return res
      .status(500)
      .json({ success: false, message: "Error fetching account" });
  }

  res.status(200).json({
    success: true,
    message: "Account fetched successfully",
    data: searchAccount.email,
  });
});
router.route("/settings/access/email").put(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const auth = await AuthenticateToken(req, res);

  if (!auth.success) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Access" });
  }
  // Check if email already exists
  const emailExists = await Account.findOne({
    email: email.toLowerCase(),
  }).select("_id");

  if (emailExists) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exists" });
  }

  //check if email and password match
  const verifyPassword = await Account.findOne({
    email: auth.account.email,
    password: hashPassword(password),
  });

  if (!verifyPassword) {
    return res.status(401).json({
      success: false,
      message: " Password is incorrect",
    });
  }

  const searchAccount = await Account.findByIdAndUpdate(auth.account._id, {
    email: email.toLowerCase(),
  }).select("email");

  //Sing new token
  const token = signToken(email.toLowerCase(), hashPassword(password));

  if (!searchAccount) {
    return res
      .status(500)
      .json({ success: false, message: "Error updating email" });
  }

  res
    .status(200)
    .json({
      success: true,
      message: "Email updated successfully",
      data: token,
    });
});
router.route("/settings/access/password").put(async (req, res) => {
  const { password, newPassword } = req.body;

  if (!password || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const auth = await AuthenticateToken(req, res);

  if (!auth.success) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Access" });
  }

  const searchAccount = await Account.findByIdAndUpdate(auth.account._id, {
    password: hashPassword(newPassword),
  });

  if (!searchAccount) {
    return res
      .status(500)
      .json({ success: false, message: "Error updating password" });
  }

  //Sing new token
  const token = signToken(auth.account.email, hashPassword(newPassword));

  res
    .status(200)
    .json({
      success: true,
      message: "Password updated successfully",
      data: token,
    });
});
router.route("/settings/notifications/get").get(async (req, res) => {
  const auth = await AuthenticateToken(req, res);

  if (!auth.success) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Access" });
  }

  const searchAccount = await Account.findById(auth.account._id).select(
    "notifications"
  );

  if (!searchAccount) {
    return res
      .status(500)
      .json({ success: false, message: "Error fetching notifications" });
  }

  res.status(200).json({
    success: true,
    message: "Notifications fetched successfully",
    data: searchAccount.notifications,
  });
})
router.route("/settings/notifications/update").put(async (req, res) => {
  const {
    balanceUse,
    parking,
    exit,
    lowBalance,
    alerts,
  } = req.body;


  const auth = await AuthenticateToken(req, res);

  if (!auth.success) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Access" });
  }

  const searchAccount = await Account.findByIdAndUpdate(auth.account._id, {
    notifications: {
      balanceUse,
      parking,
      exit,
      lowBalance,
      alerts,
    },
  });

  if (!searchAccount) {
    return res
      .status(500)
      .json({ success: false, message: "Error updating notifications" });
  }

  res
    .status(200)
    .json({
      success: true,
      message: "Notifications updated successfully",
    });
})



/*  Globals  */
router.route("/profiles/all").get(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success && !auth.account.user.type !== "admin") {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Access" });
  }

  const { limit, page, search, filter } = req.query;

  console.log(filter);

  const query = {
    $or: [
      { email: { $regex: search, $options: "i" } },
      { "user.name": { $regex: search, $options: "i" } },
      { "user.surname": { $regex: search, $options: "i" } },
    ],
  };

  // Add the filter condition dynamically if filter is not "all"
  if (filter && filter !== "all") {
    query["user.type"] = { $regex: filter, $options: "i" };
  }

  const searchAccounts = await Account.find(query)
    .select("user email gateId")
    .limit(parseInt(limit))
    .skip(parseInt(page - 1) * parseInt(limit));

  if (!searchAccounts) {
    return res
      .status(500)
      .json({ success: false, message: "Error fetching accounts" });
  }

  res.status(200).json({
    success: true,
    message: "Accounts fetched successfully",
    data: searchAccounts,
  });
}); //Paginated
router.route("/operators/all").get(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Access" });
  }

  const searchAccounts = await Account.find({
    "user.type": "operator",
  }).select("user _id email");

  if (!searchAccounts) {
    return res
      .status(500)
      .json({ success: false, message: "Error fetching accounts" });
  }

  res.status(200).json({
    success: true,
    message: "Accounts fetched successfully",
    data: searchAccounts,
  });
}); //Not paginated
router.route("/users/all").get(async (req, res) => {
  const auth = await AuthenticateToken(req);

  if (!auth.success) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Access" });
  }

  const searchAccounts = await Account.find({
    "user.type": "user",
  }).select("user email _id");

  if (!searchAccounts) {
    return res
      .status(500)
      .json({ success: false, message: "Error fetching accounts" });
  }

  res.status(200).json({
    success: true,
    message: "Accounts fetched successfully",
    data: searchAccounts,
  });
}); //Not paginated



/* Admin Create Operator */
router.route("/admin/create").post(async (req, res) => {
  const { email, name, surname, type } = req.body;

  if (!email || !name || !surname || !type) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const emailExists = await Account.findOne({
    email: email.trim().toLowerCase(),
  });
  if (emailExists) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exists" });
  }

  // Generate random password
  const password = Math.random().toString(36).slice(-8);

  const newAccount = new Account({
    email: email.trim().toLowerCase(),
    password: hashPassword(password),
    user: {
      name: name,
      surname: surname,
      type: type,
    },
  });

  //Send email with password
  const sendEmail = await sendAdminAccountCreationEmail(password, email);

  const save = await newAccount.save();

  if (!save) {
    return res
      .status(500)
      .json({ success: false, message: "Error saving account" });
  }

  res
    .status(200)
    .json({ success: true, message: "Account created successfully" });
});
router.route("/admin/update/:userId").put(async (req, res) => {
  const { email, name, surname, type } = req.body;
  const { userId } = req.params;

  console.log(req.body)

  if (!email || !name || !surname || !type) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const findUser = await Account.findById(userId);

  if (!findUser) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  //Check if email has changed
  if (findUser.email !== email) {
    const emailExists = await Account.findOne({
      email: email.trim().toLowerCase(),
    });
    if (emailExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
  }

  findUser.email = email;
  findUser.user.name = name;
  findUser.user.surname = surname;
  findUser.user.type = type;

  const save = await findUser.save();

  if (!save) {
    return res
      .status(500)
      .json({ success: false, message: "Error saving account" });
  }

  return res
    .status(200)
    .json({ success: true, message: "Account created successfully" });
});


/* Calls */
router.route("/call/getcallers").get(async (req, res) => {


  const list = await getCallerList()

  return res.status(200).json({
    success: true,
    message: "callers found",
    data: list
  })
})

module.exports = router;
