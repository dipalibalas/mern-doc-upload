const express = require("express");
const documentRouter = express.Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/documentController");

documentRouter.post("/", auth, controller.createDocument);

documentRouter.get("/", auth, controller.getDocuments);

documentRouter.put("/:id", auth, controller.updateDocument);

documentRouter.delete("/:id", auth, controller.deleteDocument);

documentRouter.post("/:id/share", auth, controller.shareDocument);

module.exports = documentRouter;
