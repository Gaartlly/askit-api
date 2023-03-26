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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: https
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Report:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         authorId:
 *           type: integer
 *           example: 2
 *         commentId:
 *           type: integer
 *           example: 3
 *         postId:
 *           type: integer
 *           example: 4
 *         reason:
 *           type: string
 *           example: "Violação dos termos de uso."
 *       required:
 *         - authorId
 *         - commentId
 *         - postId
 *         - reason
 *
 */

/**
 * @swagger
 * /api/report/createOrUpdateReport:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Create a new report or update an existing one containing the same foreign keys.
 *     tags: [Report]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Report'
 *             example:
 *               authorId: 2
 *               commentId: 3
 *               postId: 4
 *               type: "Violação dos termos de uso"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               report:
 *                 id: 1
 *                 authorId: 2
 *                 commentId: 3
 *                 postId: 4
 *                 type: "Violação dos termos de uso"
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/report/createOrUpdateReport
 *                 statusCode: 400
 *                 message: Bad request
 *
 *       500:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: InternalServerError
 *                 path: /api/report/createOrUpdateReport
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/createOrUpdateReport', createOrUpdateReport);

/**
 * @swagger
 * /api/report/disconnectTagFromReport:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Update an existing report disconnecting one of its tags.
 *     tags: [Report]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: integer
 *                 example: 1
 *               tagId:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - postId
 *               - tagId
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               report:
 *                 id: 1
 *                 authorId: 2
 *                 commentId: 3
 *                 postId: 4
 *                 type: "Violação dos termos de uso"
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/report/disconnectTagFromReport
 *                 statusCode: 400
 *                 message: Bad request
 *
 *       500:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: InternalServerError
 *                 path: /api/report/disconnectTagFromReport
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.put('/disconnectTagFromReport/', disconnectTagFromReport);

/**
 * @swagger
 * /api/report/getAllReports:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all reports.
 *     tags: [Report]
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               reports: []
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/report/getAllReports
 *                 statusCode: 400
 *                 message: Bad request
 *
 *       500:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: InternalServerError
 *                 path: /api/report/getAllReports
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getAllReports', getAllReports);

/**
 * @swagger
 * /api/report/getReport/{reportId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a report by id.
 *     tags: [Report]
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               report:
 *                 id: 1
 *                 commentId: 1
 *                 postId: 1
 *                 authorId: 1
 *                 type: "Violação dos termos de uso"
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/report/getReport
 *                 statusCode: 400
 *                 message: Bad request
 *
 *       404:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: NotFoundError
 *                 path: /api/report/getReport
 *                 statusCode: 404
 *                 message: Not found
 *
 *       500:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: InternalServerError
 *                 path: /api/report/getReport
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getReport/:reportId', getReport);

/**
 * @swagger
 * /api/report/getReportByAuthor
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all reports by an author.
 *     tags: [Report]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorId:
 *                 type: integer
 *                 description: The id of the author whose reports are being retrieved.
 *                 example: 1
 *             required:
 *               - authorId
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               reports: []
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/report/getReportByAuthor
 *                 statusCode: 400
 *                 message: Bad request
 *
 *       500:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: InternalServerError
 *                 path: /api/report/getReportByAuthor
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getReportByAuthor/', getReportsByAuthor);

/**
 * @swagger
 * /api/report/deleteReport/{reportId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete an report by id.
 *     tags: [Report]
 *     parameters:
 *       - in: path param
 *         name: reportId
 *         required: true
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/report/deleteReport
 *                 statusCode: 400
 *                 message: Bad request
 *
 *       404:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: NotFoundError
 *                 path: /api/report/deleteReport
 *                 statusCode: 404
 *                 message: Not found
 *
 *       500:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: InternalServerError
 *                 path: /api/report/deleteReport
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/deleteReport/:reportId', deleteReport);

export default router;
