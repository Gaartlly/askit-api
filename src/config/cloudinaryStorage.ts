import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinaryConnection from './cloudinaryConfig';

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinaryConnection,
    params: async (req, file) => {
        return { folder: 'AskIt' };
    },
});

export default cloudinaryStorage;
