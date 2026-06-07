const express = require("express");
const documentRouter = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const controller = require("../controllers/documentController");

documentRouter.post("/", auth, controller.createDocument);
documentRouter.post(
  "/import",
  auth,
  upload.single("file"),
  controller.importDocument,
);
documentRouter.get("/", auth, controller.getDocuments);
documentRouter.get("/:id", auth, controller.getDocumentById);
documentRouter.put("/:id", auth, controller.updateDocument);
documentRouter.delete("/:id", auth, controller.deleteDocument);
documentRouter.post("/:id/share", auth, controller.shareDocument);
documentRouter.post(
  "/:id/attach",
  auth,
  upload.single("file"),
  controller.attachFile,
);

module.exports = documentRouter;
