require("dotenv").config();

const express = require("express");
const { createServer } = require('node:http')
const { Server } = require('socket.io');
const cors = require("cors");

const { account, payments, gate, ticket, vehicles } = require("./src/routes/");
const { errorHandler } = require("./src/middleware");
const connectDatabase = require("./src/database/connection");
const socketHandler = require("./src/sockets/calls")


//Database connection
connectDatabase()

// Create express app
const app = express();
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/account", account);
app.use("/payments", payments);
app.use("/gate", gate);
app.use("/ticket", ticket);
app.use("/vehicles", vehicles);

// Sockets
socketHandler(io);

/* Error middleware */
app.use(errorHandler);
const PORT = process.env.PORT || 4000;
const globalServer = server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/* Handle unhandled promise rejections */
process.on("unhandledRejection", (err) => {
  console.log(`${err.message}`);
  //Close server & exit process
  globalServer.close(() => process.exit(1));
});
