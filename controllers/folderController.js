// controllers\folderController.js
const prisma = require("../db/prisma");
const { parseDuration } = require("../utils/time");

// /dashboard GET
const listFolders = async (req, res) => {
   const folders = await prisma.folder.findMany({
      where: { userId: req.user.id },
   });

   const noFolderFiles = await prisma.file.findMany({
      where: {
         userId: req.user.id,
         folderId: null,
      },
   });

   // console.log(noFolderFiles)

   res.render("files/dashboard", {
      folders,
      noFolderFiles,
      user: req.user,
      title: "Dashboard",
      error: req.flash("error")[0] || null,
      success: req.flash("success")[0] || null,
   });
};

// /dashboard/new GET
const newFolderForm = (req, res) => {
   res.render("files/newFolder", {
      user: req.user,
      title: "New Folder",
      error: req.flash("error")[0] || null,
      success: req.flash("success")[0] || null,
   });
};

// /dashboard/new POST
const createFolder = async (req, res) => {
   const { name } = req.body;
   await prisma.folder.create({
      data: {
         name,
         userId: req.user.id,
      },
   });
   req.flash("success", "Folder created!");
   res.redirect("/dashboard");
};

// /dashboard/:id GET
const viewFolder = async (req, res) => {
   const folderId = parseInt(req.params.id);

   const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
         files: true,
         sharedLink: true,
      },
   });

   const linkData = folder.sharedLink
      ? {
           url: `${req.protocol}://${req.get("host")}/dashboard/shared/${folder.sharedLink.id}`,
           expiresAt: folder.sharedLink.expiresAt,
        }
      : null;

   res.render("files/viewFolder", {
      folder,
      user: req.user,
      title: folder.name,
      sharedLink: linkData,
      error: req.flash("error")[0] || null,
      success: req.flash("success")[0] || null,
   });
};
// /dashboard/:id/edit GET
const editFolderForm = async (req, res) => {
   const folder = await prisma.folder.findUnique({
      where: { id: parseInt(req.params.id) },
   });

   res.render("files/editFolder", {
      folder,
      user: req.user,
      title: "Edit Folder",
      error: req.flash("error")[0] || null,
      success: req.flash("success")[0] || null,
   });
};
// /dashboard/:id/edit POST
const updateFolder = async (req, res) => {
   const { name } = req.body;
   await prisma.folder.update({
      where: { id: parseInt(req.params.id) },
      data: { name },
   });

   req.flash("success", "Folder updated!");
   res.redirect("/dashboard");
};
// /dashboard/:id/delete POST
const deleteFolder = async (req, res) => {
   await prisma.folder.delete({
      where: { id: parseInt(req.params.id) },
   });
   req.flash("success", "Folder Deleted");
   res.redirect("/dashboard");
};

// /dashboard/:id/share POST
const shareFolder = async (req, res) => {
   const folderId = parseInt(req.params.id);
   const { duration } = req.body;

   try {
      const expiresAt = parseDuration(duration);

      // Check if folder has an existing shared link
      const existingFolder = await prisma.folder.findUnique({
         where: { id: folderId },
         include: { sharedLink: true },
      });

      if (existingFolder.sharedLink) {
         await prisma.sharedLink.delete({
            where: { id: existingFolder.sharedLink.id },
         });
      }

      const sharedLink = await prisma.sharedLink.create({
         data: {
            expiresAt,
            folder: {
               connect: { id: folderId },
            },
         },
      });

      const url = `${req.protocol}://${req.get("host")}/dashboard/shared/${sharedLink.id}`;

      req.flash("success", `Share link generated: ${url}`);
      res.redirect(`/dashboard/${folderId}`);
   } catch (err) {
      console.error(err);
      req.flash("error", "Could not generate share link. Check your duration format.");
      res.redirect(`/dashboard/${folderId}`);
   }
};

// /dashboard/shared/:uuid GET
const viewSharedFolder = async (req, res) => {
   const { uuid } = req.params;

   try {
      const sharedLink = await prisma.sharedLink.findUnique({
         where: { id: uuid },
         include: {
            folder: {
               include: {
                  files: true,
               },
            },
         },
      });

      if (!sharedLink) {
         req.flash("error", "Link not found");
         return res.redirect("/");
      }

      if (sharedLink.expiresAt < new Date()) {
         req.flash("error", "Link has expired");
         return res.redirect("/");
      }

      return res.render("files/viewFolder", {
         folder: sharedLink.folder,
         shared: true,
         user: req.user || null,
         title: sharedLink.folder.name,
         sharedLink: null,
         error: req.flash("error")[0] || null,
         success: req.flash("success")[0] || null,
      });
   } catch (err) {
      console.error(err);
      req.flash("error", "Something went wrong");
      res.redirect("/");
   }
};

module.exports = {
   listFolders,
   newFolderForm,
   createFolder,
   viewFolder,
   editFolderForm,
   updateFolder,
   deleteFolder,
   shareFolder,
   viewSharedFolder,
};
