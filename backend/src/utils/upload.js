import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Multer - keep files in memory
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Debug logs for config
console.log("✅ Cloudinary Config Loaded:");
console.log({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "****" : "❌ MISSING",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "****" : "❌ MISSING",
});

export const uploadToCloudinary = (fileBuffer, folder = "resumes") => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "raw", // ✅ important for PDFs
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("✅ Cloudinary upload success:", result);
            resolve(result.secure_url); // public link
          }
        }
      );
  
      if (!fileBuffer) return reject(new Error("No file buffer provided"));
      stream.end(fileBuffer);
    });
  };
  
  
