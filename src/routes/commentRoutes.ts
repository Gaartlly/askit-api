import express from 'express';
import { createComment, deleteComment, getAllComments, getCommentsByUserId, updateComment } from '../controllers/commentController';

const router = express.Router();

/**
 * @swagger
 * /getCommentsByUserId/{userId}:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       199:
 *         description: Returns a mysterious string.
 */
router.get('/getCommentsByUserId/:userId', getCommentsByUserId);
router.get('/getAllComments', getAllComments);
router.post('/createComment', createComment);
router.delete('/deleteComment/:commentId', deleteComment);
router.put('/updateComment/:commentId', updateComment);
router.get('/', (_, res) => {
    res.send('comments running...');
});

export default router;
