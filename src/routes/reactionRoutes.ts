import express from 'express';
import {
    createOrUpdateReaction,
    getAllReactions,
    getReaction,
    deleteReaction,
    getReactionsByAuthor,
} from '../controllers/reactionController';

const router = express.Router();

router.post('/createOrUpdateReaction', createOrUpdateReaction);
router.get('/getAllReactions', getAllReactions);
router.get('/getReaction/:reactionId', getReaction);
router.get('/getReactionByAuthor/', getReactionsByAuthor);
router.delete('/deleteReaction/:reactionId', deleteReaction);

export default router;
