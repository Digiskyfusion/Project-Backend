const multer= require ("multer");


const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "upload/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Create uploads folder if it doesn't exist
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;


