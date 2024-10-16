import multer from "multer";
import { resolve } from 'path';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';

// Function to create directory if it doesn't exist
const createDirectoryIfNotExists = (directory) => {
    try {
        mkdirSync(directory, { recursive: true });
    } catch (error) {
        console.error(`Error creating directory: ${error}`);
        return frontError(res, `Error creating directory: ${error}`)
    }
};

const storage = diskStorage({

    destination: (req, file, cb) => {
        const destinationPath = resolve(`${req.storagePath}`);    // ====IMP===== we have to create a middleware for each different path pattrens and Add it before this middleware ====IMP
        // Create directory if it doesn't exist
        createDirectoryIfNotExists(destinationPath);

        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        const filename = file.originalname;
        cb(null, filename);
    },
});

// Multer instance for handling file uploads
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp/i;           // File types for vidoes |mp4|mkv|avi|mov|quicktime
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Unsupported file format"));
        }
    }
});

export { upload };