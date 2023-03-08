import express from 'express';
import { createComment, getComments } from '../controllers/commentController';

const router = express.Router();

router.get('/getComments/:postId', getComments); 
router.post('/createComment', createComment); 
router.get("/", (_,res) => {res.send("comments running...")})

export default router;