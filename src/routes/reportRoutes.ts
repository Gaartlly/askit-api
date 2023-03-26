import express from 'express';
import {
    createOrUpdateReport,
    getAllReports,
    getReport,
    deleteReport,
    disconnectTagFromReport,
    getReportsByAuthor,
} from '../controllers/reportController';

const router = express.Router();

router.post('/createOrUpdateReport', createOrUpdateReport);
router.put('/disconnectTagFromReport/', disconnectTagFromReport);
router.get('/getAllReports', getAllReports);
router.get('/getReport/:reportId', getReport);
router.get('/getReportByAuthor/', getReportsByAuthor);
router.delete('/deleteReport/:reportId', deleteReport);

export default router;
