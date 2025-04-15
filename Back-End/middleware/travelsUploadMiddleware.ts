import multer, { diskStorage } from "multer";
import { extname } from "path";
import { config } from "../config/config";

const travels = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/travels_images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + extname(file.originalname));
  },
});

const uploadTravelsMiddleware = multer({
  storage: travels,
  fileFilter: (req, file, cb) => {
    if (config.acceptedFilesType.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export default uploadTravelsMiddleware;
