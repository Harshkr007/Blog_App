import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; 
import 'dotenv/config';
import asyncHandler from './asyncHandler.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "Blogs_Image",
      resource_type: "auto"
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log("Cloudinary upload error:", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
}


const downloadOnCloudinary = async (publicId) => {
  try {
      const result = await cloudinary.api.resource(publicId);
      return result;
  } catch (error) {
      console.error('Download failed:', error);
      return null;
  }
};

const deleteOnCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("delete operation failed ::Error :  ",error);
    return null;
  }
}


export {
  uploadOnCloudinary,
  downloadOnCloudinary,
  deleteOnCloudinary
};

