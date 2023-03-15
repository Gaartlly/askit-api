import express from 'express';
import { createTag, updateTag, getAllTags, getTag, deleteTag } from '../controllers/tagController'

const router = express.Router();

router.post('/createTag', createTag);
router.put('/updateTag/:tagId', updateTag);
router.get('/getAllTags', getAllTags);
router.get('/getTag/:tagId', getTag);
router.get('/deleteTag/:tagId', deleteTag);

export default router;
