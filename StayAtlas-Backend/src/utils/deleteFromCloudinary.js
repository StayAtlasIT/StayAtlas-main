import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


export const deleteFromCloudinary = async (publicUrls = [], type = "villa") => {
  if (!Array.isArray(publicUrls) || publicUrls.length === 0) return;

  const folderName = type === "experience"
    ? "StayAtlasExperienceImages"
    : "StayAtlasVillaImages";

    const results = [];
    
  for (const url of publicUrls) {
    try {
      const parts = url.split("/");
      const filenameWithExt = parts[parts.length - 1];
      const publicId = `${folderName}/${filenameWithExt.split(".")[0]}`; 

      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "image"
      });
      results.push({
        url,
        publicId,
        status: result.result 
      });
    } catch (err) {
      console.error(`Failed to delete image ${url}:`, err.message);
      results.push({
        url,
        status: "error",
        error: err.message
      });
    }
  }
  console.log(results)
  return results;
};