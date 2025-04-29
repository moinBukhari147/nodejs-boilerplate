import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This function is used to delete an image from the server
// When a user updates a picture, the old image is deleted from the server
// Or whe a user deleted a picture, it remove that from the server
// It's an async function that takes the image path as an argument
export const deleteImage = async (imgPath) => {
    try {
        const absolutePath = path.join(__dirname, '..', '..', imgPath);
        await fs.unlink(absolutePath);          // Delete the file
    } catch (err) {
        console.error("Error deleting old image:", err);
    }
};