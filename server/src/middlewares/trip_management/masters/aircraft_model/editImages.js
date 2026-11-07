const multer = require("multer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);

const memoryStorage = multer.memoryStorage();

const upload = multer({
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (![".png", ".jpg", ".jpeg", ".gif"].includes(ext)) {
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

const saveFile = async (file, folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const filePath = path.join(
    folder,
    file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
  );
  await writeFile(filePath, file.buffer);
  return file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
};

const uploadImages = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res
        .status(400)
        .json({ message: `Failed to upload images: ${err.message}` });
    }

    const uploads = { aircraft: [], interior: [], lopa: [], cabin: [] };

    try {
      if (req.files["aircraft"]) {
        for (const file of req.files["aircraft"]) {
          const filename = await saveFile(file, "uploads/aircrafts/");
          uploads.aircraft.push({ filename });
        }
      }

      if (req.files["lopa"]) {
        for (const file of req.files["lopa"]) {
          const filename = await saveFile(file, "uploads/lopas/");
          uploads.lopa.push({ filename });
        }
      }

      if (req.files["cabin"]) {
        for (const file of req.files["cabin"]) {
          const filename = await saveFile(file, "uploads/cabins/");
          uploads.cabin.push({ filename });
        }
      }

      if (req.files["interior"]) {
        for (const file of req.files["interior"]) {
          const filename = await saveFile(file, "uploads/interiors/");
          uploads.interior.push({ filename });
        }
      }

      req.uploads = uploads;
      next();
    } catch (saveError) {
      return res
        .status(500)
        .json({ message: `Error saving files: ${saveError.message}` });
    }
  });
};

module.exports = uploadImages;
