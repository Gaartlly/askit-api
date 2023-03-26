import express from 'express';
import {
    createUserControl,
    updateUserControl,
    getAllUserControls,
    getUserControl,
    deleteUserControl,
} from '../controllers/userControlController';

const router = express.Router();

router.post('/createUserControl', createUserControl);
router.put('/updateUserControl/:userControlId', updateUserControl);
router.get('/getAllUserControls', getAllUserControls);
router.get('/getUserControl/:userControlId', getUserControl);
router.get('/deleteUserControl/:userControlId', deleteUserControl);

export default router;
