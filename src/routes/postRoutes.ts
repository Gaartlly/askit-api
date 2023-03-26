import express from 'express';
import {
    createPost,
    updatePost,
    getAllPosts,
    getPost,
    deletePost,
    disconnectTagFromPost,
    getPostsByAuthor,
} from '../controllers/postController';

const router = express.Router();

router.post('/createPost', createPost);
router.put('/updatePost/:postId', updatePost);
router.put('/disconnectTagFromPost/', disconnectTagFromPost);
router.get('/getAllPosts', getAllPosts);
router.get('/getPost/:postId', getPost);
router.get('/getPostByAuthor/', getPostsByAuthor);
router.delete('/deletePost/:postId', deletePost);

export default router;
