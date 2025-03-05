const { Chat, Account } = require("../database/schemas");
const { AuthenticateTokenSockets } = require("../utils/jwt");

let CONNECTED_USERS = [];

module.exports.socketHandler = (io) => {
  io.on("connection", async (socket) => {
    //Extract User references
    const userToken = socket.handshake.query.userId;
    const socketId = socket.id;
    const auth = await AuthenticateTokenSockets(userToken);

    if (!auth.success) {
      return;
    }

    addUserToSocketList(socketId, userToken, auth);

    //Messages
    sendMessageOperator(socket, io, userToken);
    sendMessageAdmin(socket, io, userToken);

    //Calls
    callJoin(socket, io, userToken);

    socket.on("disconnect", () => {
      removeUserFromSocketList(socket.id);
    });
  });
};

const sendMessageOperator = (socket, io, userToken) => {
  socket.on("send-message-operator", async (data) => {
    const auth = await AuthenticateTokenSockets(userToken);

    if (!auth.success) {
      // THROW ERROR AUTH
      return console.log("Not authorized");
    }

    if (auth.account.user.type === "operator" && !auth.account.gateId) {
      //THROW ERROR NO GATE ASSOCIATED SO CANNOT TALK FOR ONE
      return console.log("Operator not associated to a gate");
    }

    const { message } = data;
    const { gateId } = auth.account;

    //Record message in database
    registerMessageInDatabase(message, gateId, "operator");

    //Emit message data for socket transmission to all admins
    getAllAdmins().forEach((admin) => {
      io.to(admin.socketId).emit("receive-message-operator", {
        gateId,
        type: "text",
        role: "operator",
        content: message,
        date: new Date(),
        gateId: gateId,
      });
    });
  });
};
const sendMessageAdmin = (socket, io, userToken) => {
  socket.on("send-message-admin", async (data) => {
    const auth = await AuthenticateTokenSockets(userToken);

    if (!auth.success) {
      // THROW ERROR AUTH
      return console.log("Not authorized");
    }

    if (auth.account.user.type !== "admin") {
      //THROW ERROR NO GATE ASSOCIATED SO CANNOT TALK FOR ONE
      return console.log("Not enough permissions");
    }

    const { message, gateId } = data;

    //Record message in database
    registerMessageInDatabase(message, gateId, "admin");

    //Emit message data for socket transmission to all gaters of that gate
    getAllUsersFromGate(gateId).forEach((gater) => {
      io.to(gater.socketId).emit("receive-message-admin", {
        gateId,
        type: "text",
        role: "admin",
        content: message,
        date: new Date(),
      });
    });
  });
};

const completedTrack = (socket, data) => {
  socket.emit("completed", data);
};

/* Sockets Controllers */
const addUserToSocketList = (socketId, userToken, auth, peerId, room) => {
  const userObject = {
    socketId: socketId,
    token: userToken,
    account: {
      gateId: auth.account.gateId ?? null,
      _id: auth.account._id,
    },
    role: auth.account.user.type,
    room: room ?? null,
    peerId: peerId,
  };

  CONNECTED_USERS.push(userObject);
};
const removeUserFromSocketList = (socketId) => {
  CONNECTED_USERS = CONNECTED_USERS.filter(
    (user) => user.socketId !== socketId
  );
};
const getAllAdmins = () => {
  const adminsList = CONNECTED_USERS.filter((user) => {
    return user.role === "admin";
  });

  return adminsList;
};
const getAllUsersFromGate = (gateId) => {
  const gatersList = CONNECTED_USERS.filter((user) => {
    if (!user.account.gateId) return;
    const currentGateId = user.account.gateId.toString();
    return currentGateId === gateId;
  });

  return gatersList;
};

/* Messages Controllers */
const registerMessageInDatabase = async (message, gateId, role) => {
  const messageObject = {
    type: "text",
    role,
    content: message,
    date: new Date(),
  };

  //Verify if a chat with the current Gate exist
  const chat = await Chat.findOne({
    gateId: gateId,
  }).select("_id messages");

  if (!chat) {
    const newChat = new Chat({
      gateId,
      messages: [messageObject],
    });

    const savedChat = await newChat.save();
    return !!savedChat;
  } else {
    chat.messages.push(messageObject);

    const updatedChat = await chat.save();
    return !!updatedChat;
  }
};

/* Calls controllers */
const callJoin = (socket, io, userToken) => {
  socket.on("call-joined", async (data) => {
    const auth = await AuthenticateTokenSockets(userToken);

    if (!auth.success) {
      // THROW ERROR AUTH
      return console.log("Not authorized");
    }

    if (auth.account.user.type === "operator" && !auth.account.gateId) {
      //THROW ERROR NO GATE ASSOCIATED SO CANNOT TALK FOR ONE
      return console.log("Operator not associated to a gate");
    }

    const { peerId } = data;
    const { id } = socket;

    //add peerId to socket
    const userIndex = CONNECTED_USERS.findIndex((user) => user.socketId === id);

    if (userIndex === -1) {
      // If no user is found, handle the error
      return console.log("User not found in CONNECTED_USERS");
    }

    // Update the peerId for the found user
    CONNECTED_USERS[userIndex].peerId = peerId;
  });
};
const getCallerList = async () => {
  // Filter users who have a peerId
  const callableUsers = CONNECTED_USERS.filter((user) => user.peerId);

  // Use Promise.all to handle multiple asynchronous calls
  const searchUsers = await Promise.all(callableUsers.map(async (user) => {
    // Fetch the account details by user ID
    const userAccount = await Account.findById(user.account._id).select('user');
    
    // Return the account data along with the peerId
    return {
      user: userAccount,
      peerId: user.peerId,
    };
  }));

  return searchUsers;
};



setInterval(()=>{
  //console.log(CONNECTED_USERS)
},1000)


module.exports.getCallerList = getCallerList;



