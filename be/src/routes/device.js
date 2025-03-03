const express = require("express");
const hashPassword = require("../utils/sha256");
const { Device } = require("../database/schemas");
const { signToken, signTokenDevice, AuthenticateToken } = require("../utils/jwt");
const router = express.Router();

router.route("/register").post(async (req, res) => {
  console.log(req.body);
  if (!username || !password || !gateId || !ipAddress) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const usernameExists = await Device.findOne({
    username: username.trim(),
  });
  if (usernameExists) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exists" });
  }

  const newAccount = new Device({
    username: username.trim(),
    password: hashPassword(password),
    gateId,
    ip_address: ipAddress,
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
router.route("/login").post(async (req, res) => {
  const { username, password } = req.body;
  const searchAccount = await Device.findOne({
    username: username,
    password: hashPassword(password),
  });

  if (!searchAccount) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials - Email or Password is incorrect",
    });
  }

  const token = signTokenDevice(username, hashPassword(password));

  res.status(200).json({
    success: true,
    message: "Login succesfull",
    data: token,
    gateId: searchAccount.gateId
  });
});



/* 
    @desc get the Server device of a gate 
*/
router.route('/get/all').get(async (req, res) => {
    const auth = await AuthenticateToken(req)

    if (!auth || auth.account.user.type !== 'operator' || !auth.account.gateId){
        return res
        .status(400)
        .json({
            success: false,
            message: 'Not authorized'
        })
    }


    const getDevice = await Device.findOne({
        gateId: auth.account.gateId
    })

    if (!getDevice){
        return res
        .status(201)
        .json({
            success: true,
            message: 'No devices found',
        })
    }

    return res
    .status(200)
    .json({
        success: true,
        message: 'Devices found',
        data: getDevice
    })


})

module.exports = router;
