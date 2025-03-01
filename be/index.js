require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { account, payments, gate, ticket, vehicles } = require("./src/routes/");
const { errorHandler } = require("./src/middleware");
const connectDatabase = require("./src/database/connection");


//Database connection
connectDatabase()

// Create express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/account", account);
app.use("/payments", payments);
app.use("/gate", gate);
app.use("/ticket", ticket);
app.use("/vehicles", vehicles);



/* Error middleware */
app.use(errorHandler);
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/* Handle unhandled promise rejections */
process.on("unhandledRejection", (err) => {
  console.log(`${err.message}`);
  //Close server & exit process
  server.close(() => process.exit(1));
});
