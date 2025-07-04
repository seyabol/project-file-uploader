// routes\folderRoutes.js
const { Router } = require("express");
const router = Router();

const folderController = require("../controllers/folderController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

// /dashboard/...


router.get("/", ensureAuthenticated, folderController.listFolders);

router.get("/new", ensureAuthenticated, folderController.newFolderForm);
router.post("/new", ensureAuthenticated, folderController.createFolder);

router.get("/:id", ensureAuthenticated, folderController.viewFolder);

router.get("/:id/edit", ensureAuthenticated, folderController.editFolderForm);
router.post("/:id/edit", ensureAuthenticated, folderController.updateFolder);

router.post("/:id/share", ensureAuthenticated, folderController.shareFolder);
router.get("/shared/:uuid", folderController.viewSharedFolder);

router.post("/:id/delete", ensureAuthenticated, folderController.deleteFolder);



module.exports = router