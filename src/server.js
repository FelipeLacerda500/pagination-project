require("express-async-errors");

const sqliteConnection = require("./database/sqlite");
const AppError = require("../src/utils/AppError");
const express = require("express");
const routes = require("./routes");

const server = express();

sqliteConnection();
server.use(express.json());
server.use(routes);

server.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.error(error);

  return response
    .status(500)
    .json({ status: "error", message: "Internal server error" });
});

server.listen(3333, () => {
  console.log("Server is running on PORT: 3333");
});
