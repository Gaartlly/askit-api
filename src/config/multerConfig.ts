import multer from 'multer';
import cloudinaryStorage from './cloudinaryStorage';

const multerUpload = multer({
    storage: cloudinaryStorage,
});

export default multerUpload;
