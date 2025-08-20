import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure directory exists
const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const UPLOAD_FOLDER = "public/villaAssets";
ensureDirExists(UPLOAD_FOLDER);

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //console.log("destination",file)
        cb(null, UPLOAD_FOLDER);
    },
    filename: function (req, file, cb) {
        //console.log("filename",file)
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    }
});

// File type filter
const fileFilter = (req, file, cb) => {

    const allowedTypes = /\.(jpeg|jpg|png|webp)$/;
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.includes(file.mimetype);
    //console.log(file.mimetype)
    //console.log(extname,mimetype)
//mimetype stands for Multipurpose Internet Mail Extension type.

//It tells what kind of file is being uploaded, based on its content—not just its extension.

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg, .jpg, .png, .webp files are allowed!'));
    }
};

// Multer config
const upload = multer({
    storage: storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5Mb
});

export default upload;
