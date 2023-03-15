import express from 'express';
import { createPost, updatePost, getAllPosts, getPost, deletePost } from '../controllers/postController';

const router = express.Router();

router.post('/createPost', createPost);
router.put('/updatePost/:postId', updatePost);
router.get('/getAllPosts', getAllPosts);
router.get('/getPost/:postId', getPost);
router.delete('/deletePost/:postId', deletePost);

export default router;
