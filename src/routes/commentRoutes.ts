import express from 'express';
import moderatorMiddleware from '../middleware/moderatorMiddleware';
import { createComment, deleteComment, getAllComments, getCommentsByUserId, updateComment } from '../controllers/commentController';

const router = express.Router();

router.get('/get-comments-by-user-id/:id', getCommentsByUserId);
router.get('/get-all-comments', getAllComments);
router.post('/create-comment', createComment);
router.delete('/delete-comment/:id', deleteComment);
router.put('/update-comment/:id', updateComment);

export default router;
