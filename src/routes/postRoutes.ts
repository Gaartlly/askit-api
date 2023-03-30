import express from 'express';
import { createPost, updatePost, getAllPosts, getPost, deletePost } from '../controllers/postController';

const router = express.Router();

router.post('/create-post', createPost);
router.put('/update-post/:id', updatePost);
router.get('/get-all-posts', getAllPosts);
router.get('/get-post/:id', getPost);
router.delete('/delete-post/:id', deletePost);

export default router;
