import express from 'express';
import moderatorMiddleware from '../middleware/moderatorMiddleware';
import { createComment, deleteComment, getAllComments, getCommentsByUserId, updateComment } from '../controllers/commentController';

const router = express.Router();

router.get('/:id', getCommentsByUserId);
router.get('/', getAllComments);
router.post('/', createComment);
router.delete('/:id', deleteComment);
router.put('/:id', updateComment);

export default router;
