// const multer = require("multer");
// const path = require("path");
// const status = require("../../../helpers/Response");
// const fs = require("fs");
// const util = require("util");
// const writeFile = util.promisify(fs.writeFile);

// const memoryStorage = multer.memoryStorage();

// // Set up the multer upload with memory storage
// const upload = multer({
//   storage: memoryStorage,
//   fileFilter: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
//       return cb(new Error("Only images are allowed"), false);
//     }
//     cb(null, true);
//   },
//   limits: { fileSize: 4 * 1024 * 1024 },
// }).fields([
//   { name: "aircraft", maxCount: 1 },
//   { name: "lopa", maxCount: 1 },
//   { name: "cabin", maxCount: 1 },
//   { name: "interior", maxCount: 1 },
// ]);

// // Helper function to save a file from memory to disk
// const saveFile = async (file, folder) => {
//   // Create the folder if it doesn't exist
//   if (!fs.existsSync(folder)) {
//     fs.mkdirSync(folder, { recursive: true });
//   }
//   const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//   // Define the full path for the file
//   const filePath = path.join(
//     folder,
//     file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
//   );
//   // Write the file to disk
//   await writeFile(filePath, file.buffer);
//   return file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
// };

// const uploadImages = (req, res, next) => {
//   upload(req, res, async (err) => {
//     if (err instanceof multer.MulterError) {
//       // A Multer error occurred when uploading.
//       // console.log(err);
//       if (err.code === "LIMIT_UNEXPECTED_FILE") {
//         return status.ResponseStatus(
//           res,
//           400,
//           `File limit exceed for the field ${err.field}..!`
//         );
//       }
//       return status.ResponseStatus(res, 400, err.message);
//     } else if (err) {
//       // An unknown error occurred when uploading.
//       return status.ResponseStatus(
//         res,
//         400,
//         `Failed to upload images! ${err.message}.`
//       );
//     }

//     // Initialize a new uploads object for each request
//     const uploads = { aircraft: [], lopa: [], cabin: [], interior: [] };

//     // Check if all required fields have at least one file
//     const requiredFields = ["aircraft", "lopa", "cabin", "interior"];
//     for (const field of requiredFields) {
//       if (!req.files[field] || req.files[field].length === 0) {
//         // Field is missing files, return an error
//         return status.ResponseStatus(
//           res,
//           400,
//           `Please select the ${field} image. It is required to have at least one file.`
//         );
//       }
//     }

//     // Save the files to disk
//     try {
//       for (const file of req.files["aircraft"]) {
//         const filename = await saveFile(file, "uploads/nsop_quotation/images/");
//         uploads.aircraft.push({ ...file, filename });
//       }

//       // Save 'lopa' image
//       for (const file of req.files["lopa"]) {
//         const filename = await saveFile(file, "uploads/nsop_quotation/images/");
//         uploads.lopa.push({ ...file, filename });
//       }

//       // Save 'cabin' image
//       for (const file of req.files["cabin"]) {
//         const filename = await saveFile(file, "uploads/nsop_quotation/images/");
//         uploads.cabin.push({ ...file, filename });
//       }

//       // Save 'interior' images
//       for (const file of req.files["interior"]) {
//         const filename = await saveFile(file, "uploads/nsop_quotation/images/");
//         uploads.interior.push({ ...file, filename });
//       }

//       req.uploads = uploads;
//       next();
//     } catch (saveError) {
//       return status.ResponseStatus(
//         res,
//         500,
//         `Error saving files: ${saveError.message}`
//       );
//     }
//   });
// };

// module.exports = uploadImages;

const multer = require("multer");
const path = require("path");
const status = require("../../../helpers/Response");
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);

// Use memory storage for multer
const memoryStorage = multer.memoryStorage();

// Set up the multer upload with memory storage
const upload = multer({
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".png", ".jpg", ".jpeg", ".gif"].includes(ext)) {
      return cb(new Error("Only images are allowed"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB
}).fields([
  { name: "aircraft", maxCount: 1 }, // multiple aircraft images
  { name: "interior", maxCount: 1 }, // multiple interior images
  { name: "lopa", maxCount: 1 }, // optional single lopa image
  { name: "cabin", maxCount: 1 }, // optional single cabin image
]);

// Helper function to save a file from memory to disk
const saveFile = async (file, folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const fileName = `${file.fieldname}-${uniqueSuffix}${path.extname(
    file.originalname
  )}`;
  const filePath = path.join(folder, fileName);

  await writeFile(filePath, file.buffer);
  return fileName;
};

// Upload handler middleware
const uploadImages = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return status.ResponseStatus(
          res,
          400,
          `File limit exceeded for the field ${err.field}..!`
        );
      }
      return status.ResponseStatus(res, 400, err.message);
    } else if (err) {
      return status.ResponseStatus(
        res,
        400,
        `Failed to upload images! ${err.message}.`
      );
    }

    const uploads = { aircraft: [], lopa: [], cabin: [], interior: [] };
    const fields = ["aircraft", "lopa", "cabin", "interior"];

    try {
      for (const field of fields) {
        if (req.files && req.files[field]) {
          for (const file of req.files[field]) {
            const filename = await saveFile(
              file,
              "uploads/nsop_quotation/images/"
            );
            uploads[field].push({ ...file, filename });
          }
        }
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
