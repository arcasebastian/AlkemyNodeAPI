const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { normalizeError } = require("./normalizeError");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "public", "images"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const validateFileType = (req, file, cb) => {
  const validImageTypes = /jpeg|jpg|png|gif/;
  const fileExt = path.extname(file.originalname);
  const fileMime = file.mimetype;
  if (validImageTypes.test(fileExt) && validImageTypes.test(fileMime))
    return cb(null, true);
  return cb("Invalid file format.", false);
};
const multerFileUpload = multer({
  storage: storage,
  limits: { fileSize: 100000 },
  fileFilter: validateFileType,
}).single("image");

const uploadFile = (req, res, next) => {
  multerFileUpload(req, res, (err) => {
    if (err) {
      next(normalizeError(err, 500));
    } else {
      next();
    }
  });
};
const deleteFile = (filePath) => {
  let actualPath = path.normalize(__dirname + "/../public" + filePath);
  fs.unlink(actualPath, (err) => {
    if (err) {
      throw err;
    }
  });
};

exports.uploadFile = uploadFile;
exports.deleteFile = deleteFile;
