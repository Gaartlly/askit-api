import express from 'express';
import { createTag, updateTag, getAllTags, getTag, deleteTag } from '../controllers/tagController'

const router = express.Router();

router.post('/create-tag', createTag);
router.put('/update-tag/:id', updateTag);
router.get('/get-all-tags', getAllTags);
router.get('/get-tag/:id', getTag);
router.get('/delete-tag/:id', deleteTag);

export default router;
