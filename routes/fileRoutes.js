// routes\fileRoutes.js
const { Router } = require("express");
const router = Router();
const fileController = require("../controllers/fileController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");
const upload = require("../middleware/upload");

// /file/...
router.get("/upload", ensureAuthenticated, fileController.uploadGet);
router.post("/upload", ensureAuthenticated, upload.single("file"), fileController.uploadFile); // here .single('file') is name of : <input type="file" name="file" />

router.get("/:id/download", ensureAuthenticated, fileController.downloadFile);

router.post("/:id/delete", ensureAuthenticated, fileController.deleteFile)

router.post("/:id/assign-folder", ensureAuthenticated, fileController.assignFileToFolder);
router.get("/:id", ensureAuthenticated, fileController.fileDetails);

module.exports = router;
