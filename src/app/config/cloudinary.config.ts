/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2  as cloudinary} from "cloudinary";
import { envVars } from "./env";
import AppError from "../ErrorHandlers/AppError";


cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret : envVars.CLOUDINARY.CLOUDINARY_API_SECRET
})


export const deleteImageFromCLoudinary  = async(url: string) => {
   try {
     const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

    const match  = url.match(regex);
    if(match && match[1]){
        const public_id = match[1];
        await cloudinary.uploader.destroy(public_id);
        console.log(`file ${public_id}  deleted successfully`);
    }
   } catch (error: any) {
    throw new AppError(401, 'cloudinary image dilation successfully', error.message)
   }
}

export const cloudinaryUploads = cloudinary;