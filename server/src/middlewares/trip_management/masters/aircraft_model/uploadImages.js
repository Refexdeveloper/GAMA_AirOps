const multer = require("multer");
const path = require("path");
const status = require("../../../../helpers/Response");
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);

const memoryStorage = multer.memoryStorage();

// Set up the multer upload with memory storage
const upload = multer({
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return cb(new Error("Only images are allowed"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 4 * 1024 * 1024 },
}).fields([
  { name: "aircraft", maxCount: 3 },
  { name: "lopa", maxCount: 1 },
  { name: "cabin", maxCount: 1 },
  { name: "interior", maxCount: 3 },
]);

// Helper function to save a file from memory to disk
const saveFile = async (file, folder) => {
  // Create the folder if it doesn't exist
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  // Define the full path for the file
  const filePath = path.join(
    folder,
    file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
  );
  // Write the file to disk
  await writeFile(filePath, file.buffer);
  return file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
};

const uploadImages = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      // console.log(err);
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return status.ResponseStatus(
          res,
          400,
          `File limit exceed for the field ${err.field}..!`
        );
      }
      return status.ResponseStatus(res, 400, err.message);
    } else if (err) {
      // An unknown error occurred when uploading.
      return status.ResponseStatus(
        res,
        400,
        `Failed to upload images! ${err.message}.`
      );
    }

    // Initialize a new uploads object for each request
    const uploads = { aircraft: [], lopa: [], cabin: [], interior: [] };

    // Check if all required fields have at least one file
    const requiredFields = ["aircraft", "lopa", "cabin", "interior"];
    for (const field of requiredFields) {
      if (!req.files[field] || req.files[field].length === 0) {
        // Field is missing files, return an error
        return status.ResponseStatus(
          res,
          400,
          `Please select the ${field} image. It is required to have at least one file.`
        );
      }
    }

    // Save the files to disk
    try {
      for (const file of req.files["aircraft"]) {
        const filename = await saveFile(file, "uploads/aircrafts/");
        uploads.aircraft.push({ ...file, filename });
      }

      // Save 'lopa' image
      for (const file of req.files["lopa"]) {
        const filename = await saveFile(file, "uploads/lopas/");
        uploads.lopa.push({ ...file, filename });
      }

      // Save 'cabin' image
      for (const file of req.files["cabin"]) {
        const filename = await saveFile(file, "uploads/cabins/");
        uploads.cabin.push({ ...file, filename });
      }

      // Save 'interior' images
      for (const file of req.files["interior"]) {
        const filename = await saveFile(file, "uploads/interiors/");
        uploads.interior.push({ ...file, filename });
      }

      req.uploads = uploads;
      next();
    } catch (saveError) {
      return status.ResponseStatus(
        res,
        500,
        `Error saving files: ${saveError.message}`
      );
    }
  });
};

module.exports = uploadImages;
