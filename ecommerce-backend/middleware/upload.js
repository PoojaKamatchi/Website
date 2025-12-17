import multer from "multer";
import path from "path";

// Temporary storage in memory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // you can keep it, but Cloudinary will override
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

const upload = multer({ storage, fileFilter });

export default upload;
