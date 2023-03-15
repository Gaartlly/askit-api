import express from 'express';
import { createUser, deleteUser, getUsers, updateUser } from '../controllers/userController'

const router = express.Router();

router.post('/createUser', createUser);
router.get('/getUsers', getUsers);
router.put('/updateUser/:userId', updateUser);
router.delete('/deleteUser/:userId', deleteUser);

export default router;
