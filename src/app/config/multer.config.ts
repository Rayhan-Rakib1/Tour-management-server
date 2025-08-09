/* eslint-disable no-useless-escape */
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUploads } from "./cloudinary.config";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUploads,
  params: {
    public_id: (req, file) => {
      const fileName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "-") // empty space remove replace with dash
        .replace(/\./g, "-")
        .replace(/[^a-z0-9\-\.]/g, "");

        const extention = file.originalname.split('.').pop();

        const uniqueFileName = Math.random().toString(36).substring(2)+ "-" +Date.now() +  "-" +fileName + "."  + extention
        return uniqueFileName;
    },
  },
});

export const multerUploads = multer({ storage: storage });
