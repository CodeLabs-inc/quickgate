const jwt = require("jsonwebtoken");
const { Account } = require("../database/schemas");

async function AuthenticateToken(req) {
  if (!req.headers.authorization) {
    return {
      success: false,
      account: null
    
    
    };
  }

  if (req.headers.authorization.split(" ")[0] !== "Bearer") {
    return {
      success: false,
      account: null
    };
  }

  if (req.headers.authorization.split(" ")[1] === "null") {
    return {
      success: false,
      account: null
    };
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const account = await Account.findOne({
      email: decoded.email,
      password: decoded.password,
    }).select("-password -settings -contacts");

    if (!account) {
      return {
        success: false,
        account: null,
      };
    }

    return {
      success: true,
      account: account,
    };
  } catch (error) {
    return {
      success: false,
      account: null,
    };
  }
}
async function AuthenticateTokenSockets(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const account = await Account.findOne({
      email: decoded.email,
      password: decoded.password,
    }).select("_id gateId user.type");

    if (!account) {
      return {
        success: false,
        account: null,
      };
    }

    return {
      success: true,
      account: account,
    };
  } catch (error) {
    return {
      success: false,
      account: null,
    };
  }
}

function signToken(email, password) {
  return jwt.sign(
    { email: email.toLowerCase(), password: password },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );
}

module.exports = {
  AuthenticateToken,
  AuthenticateTokenSockets,
  signToken,
};
