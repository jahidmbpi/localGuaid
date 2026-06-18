import { CloudinaryStorage } from "multer-storage-cloudinary";

import multer from "multer";
import { cloudinaryUpload } from "./cloudenary.config";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      const nameWithoutExtension = file.originalname.substring(
        0,
        file.originalname.lastIndexOf(".")
      );
      const fileName = nameWithoutExtension
        .toLocaleLowerCase()
        .replace(/\s+/g, "-")
        .replace(/\./g, "-")
        .replace(/[^a-z0-9\-]/g, "");

      const uniqueFileName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        fileName;
      return uniqueFileName;
    },
  },
});

export const multerUpload = multer({ storage });
