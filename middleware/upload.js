// middleware\upload.js

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Destination where files get saved
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, "..", "uploads");
      if (!fs.existsSync(uploadPath)) {
         fs.mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
   },
   filename: function (req, file, cb) {
      // e.g. myFile-1679729317.pdf
      const uniqueSuffix = Date.now() + path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix);
   },
});

const upload = multer({ storage });

module.exports = upload;
