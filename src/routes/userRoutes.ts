import express from 'express';
import { createUser, deleteUser, getUsers, updateUser } from '../controllers/userController';
import adminMiddleware from '../middleware/adminMiddleware';
import moderatorMiddleware from '../middleware/moderatorMiddleware';
import verifyAuthentication from '../middleware/authUserMiddleware';

const router = express.Router();

router.post('/createUser', createUser);
router.get('/getUsers', verifyAuthentication, adminMiddleware, getUsers);
router.put('/updateUser/:userId', verifyAuthentication, updateUser);
router.delete('/deleteUser/:userId', verifyAuthentication, moderatorMiddleware, deleteUser);

export default router;