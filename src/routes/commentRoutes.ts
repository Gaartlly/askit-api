import express from 'express';
import moderatorMiddleware from '../middleware/moderatorMiddleware';
import { createComment, deleteComment, getAllComments, getCommentsByUserId, updateComment } from '../controllers/commentController';

const router = express.Router();

router.get('/getCommentsByUserId/:userId', getCommentsByUserId);
router.get('/getAllComments', moderatorMiddleware, getAllComments);
router.post('/createComment', createComment);
router.delete('/deleteComment/:commentId', deleteComment);
router.put('/updateComment/:commentId', updateComment);
router.get('/', (_, res) => {
    res.send('comments running...');
});

export default router;
