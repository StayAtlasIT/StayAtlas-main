// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Single universal uploader.
 * - If "input" is Buffer => uses upload_stream
 * - If "input" is string path => uses uploader.upload
 * type:
 *   - "villa" | "experience" => image
 *   - "real-moment-video"    => video (forced mp4/h264+aac)
 */
export const uploadOnCloudinary = (input, type = "villa") => {
  return new Promise((resolve, reject) => {
    let folderName = "Misc";
    let resourceType = "image";
    const opts = {
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    if (type === "villa") {
      folderName = "StayAtlasVillaImages";
      resourceType = "image";
    } else if (type === "experience") {
      folderName = "StayAtlasExperienceImages";
      resourceType = "image";
    } else if (type === "real-moment-video") {
      folderName = "StayAtlasRealMomentVideos";
      resourceType = "video";
      // Ensure widely supported, streamable video
      Object.assign(opts, {
        format: "mp4",
        transformation: [
          { video_codec: "h264" },
          { audio_codec: "aac" },
        ],
      });
    }

    const finalOptions = { folder: folderName, resource_type: resourceType, ...opts };

    // Buffer upload (stream)
    if (Buffer.isBuffer(input)) {
      const stream = cloudinary.uploader.upload_stream(finalOptions, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
      stream.end(input);
      return;
    }

    // Path upload
    if (typeof input === "string") {
      cloudinary.uploader
        .upload(input, finalOptions)
        .then(resolve)
        .catch(reject);
      return;
    }

    reject(new Error("uploadOnCloudinary: invalid input (expected Buffer or file path)"));
  });
};


const uploadMultipleImagesParallel = async (filePaths = [], type) => {
    // Chunk uploads to reduce memory spikes when many files are sent
    const concurrency = 3;
    const successfulUploads = [];
    const failedFilePaths = [];

    for (let i = 0; i < filePaths.length; i += concurrency) {
        const chunk = filePaths.slice(i, i + concurrency);
        const results = await Promise.allSettled(chunk.map(path => uploadOnCloudinary(path, type)));

        results.forEach((result, idx) => {
            if (result.status === "fulfilled" && result.value) {
                successfulUploads.push(result.value);
            } else {
                failedFilePaths.push(chunk[idx]);
            }
        });
    }

    if (failedFilePaths.length > 0) {
        console.log(`Retrying ${failedFilePaths.length} failed uploads...`);
        const retryResults = await Promise.allSettled(
            failedFilePaths.map(path => uploadOnCloudinary(path, type))
        );
        retryResults.forEach(result => {
            if (result.status === "fulfilled" && result.value) {
                successfulUploads.push(result.value);
            }
        });
    }

    return successfulUploads;
};

export { uploadMultipleImagesParallel};
