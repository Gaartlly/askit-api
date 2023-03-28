import express from 'express';
import verifyAuthentication from '../middleware/authUserMiddleware';
import { createUser, deleteUser, getUsers, updateUser } from '../controllers/userController';

const router = express.Router();

router.post('/createUser', createUser);
router.get('/getUsers', verifyAuthentication, getUsers);
router.put('/updateUser/:userId', verifyAuthentication, updateUser);
router.delete('/deleteUser/:userId', verifyAuthentication, deleteUser);

export default router;
