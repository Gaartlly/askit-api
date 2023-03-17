import express from 'express';
import { updateFile, getFileById, getAllFiles, uploadFile } from '../controllers/fileController';

const router = express.Router();

router.post('/uploadFile', uploadFile);
router.get('/getAllFiles', getAllFiles);
router.get('/getFileById/:fileId', getFileById);
router.delete('/deleteFile/:fileId', getFileById);
router.put('/updateFile/:fileId', updateFile);

export default router;
