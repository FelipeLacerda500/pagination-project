const { Router } = require("express");

const noteRoutes = require("./notes.routes");

const routes = Router();

routes.use("/notes", noteRoutes);

module.exports = routes;
