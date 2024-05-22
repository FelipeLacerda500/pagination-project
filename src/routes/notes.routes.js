const { Router } = require("express");
const NotesController = require("../controllers/NotesController");
const notesRoutes = Router();
const notesController = new NotesController();

notesRoutes.get("/", notesController.index);
notesRoutes.post("/", notesController.create);

module.exports = notesRoutes;
