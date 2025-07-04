// controllers\fileController.js
const prisma = require("../db/prisma");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const cloudinary = require("../config/cloudinaryConfig");

// /file/upload GET
const uploadGet = async (req, res) => {
   const folders = await prisma.folder.findMany({
      where: { userId: req.user.id },
   });

   res.render("files/upload", {
      title: "Upload File",
      folders,
      user: req.user,
      error: req.flash("error")[0] || null,
      success: req.flash("success")[0] || null,
   });
};
// /file/upload POST
const uploadFile = async (req, res) => {
   const { folderId } = req.body;
   // console.log("*** Hi form Upload File ***");
   // console.log(req.file);
   cloudinary.uploader.upload(
      req.file.path,
      { resource_type: "auto", folder: "test_folder" },
      async function (err, result) {
         if (err) {
            console.error(err);
            req.flash("error", err.message);
            res.redirect("/file/upload");
         }
         console.log(result);
         await prisma.file.create({
            data: {
               filename: req.file.originalname, // Name of the file on the user's computer
               filepath: result.url, // The full path to the uploaded file
               size: req.file.size,
               mimeType: req.file.mimetype,
               userId: req.user.id,
               folderId: folderId ? parseInt(folderId) : null,
            },
         });

         // ✅ Delete local file after Cloudinary upload
         fs.unlinkSync(req.file.path);

         req.flash("success", "File uploaded!");
         res.redirect("/dashboard");
      }
   );
};

// /file/:id/download GET
const downloadFile = async (req, res) => {
   const file = await prisma.file.findUnique({
      where: { id: parseInt(req.params.id) },
   });

   if (!file) {
      req.flash("error", "File not found.");
      return res.redirect("/dashboard");
   }
   // console.log(file.filepath);
   // console.log(file.filename);
   // // res.download(path.resolve(file.filepath, file.filename));
   // return res.redirect(file.filepath);
   try {
      // Fetch the file from cloudinary
      const response = await axios({
         method: "GET",
         url: file.filepath,
         responseType: "stream",
      });

      // set the download headers
      res.setHeader("Content-Disposition", `attachment; filename=${file.filename}`);
      res.setHeader("Content-Type", file.mimeType);

      //Pipe Cloudinary stream to response
      response.data.pipe(res);
   } catch (err) {
      console.error(error);
      req.flash("error", "Unable to download file.");
      return res.redirect("/dashboard");
   }
};

// /:id/assign-folder POST

const assignFileToFolder = async (req, res, next) => {
   const fileId = parseInt(req.params.id);
   const { folderId } = req.body;

   try {
      await prisma.file.update({
         where: { id: fileId },
         data: {
            folderId: parseInt(folderId),
         },
      });
      req.flash("success", "File Successfully assigned to folder!");
   } catch (error) {
      console.error(error);
      req.flash("error", "An error occurred while assigning the file.");
      // next(error)
   }
   res.redirect(`/file/${fileId}`);
};

// /file/:id GET
const fileDetails = async (req, res) => {
   const file = await prisma.file.findUnique({
      where: { id: parseInt(req.params.id) },
   });

   const folders = await prisma.folder.findMany({
      where: { userId: req.user.id },
   });

   res.render("files/fileDetails", {
      file,
      folders,
      user: req.user,
      title: file.filename,
      error: req.flash("error")[0] || null,
      success: req.flash("success")[0] || null,
   });
};

// file/:id/delete POST
const deleteFile = async (req, res) => {
   const fileId = parseInt(req.params.id);
   const file = await prisma.file.findUnique({
      where: { id: fileId },
   });
   const folderId = file.folderId;
   await prisma.file.delete({ where: { id: fileId } });
   console.log(folderId);
   req.flash("success", "successfully Deleted");
   res.redirect(`/dashboard/${folderId}`);
};

module.exports = {
   uploadGet,
   uploadFile,
   fileDetails,
   downloadFile,
   assignFileToFolder,
   deleteFile,
};
