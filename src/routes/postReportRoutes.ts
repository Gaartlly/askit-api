import express from 'express';
import moderatorMiddleware from '../middleware/moderatorMiddleware';
import {
    createOrUpdatePostReport,
    getAllPostReports,
    getPostReport,
    deletePostReport,
    disconnectTagFromPostReport,
    getPostReportsByAuthor,
} from '../controllers/postReportController';

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
 *     PostReport:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         authorId:
 *           type: integer
 *           example: 2
 *         postId:
 *           type: integer
 *           example: 3
 *         reason:
 *           type: string
 *           example: "Violação dos termos de uso."
 *       required:
 *         - authorId
 *         - postId
 *         - reason
 *
 */

/**
 * @swagger
 * /api/postReport/createOrUpdatePostReport:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Create a new post report or update an existing one containing the same foreign keys.
 *     tags: [PostReport]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostReport'
 *             example:
 *               authorId: 2
 *               postId: 3
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
 *                 postId: 3
 *                 type: "Violação dos termos de uso"
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/postReport/createOrUpdatePostReport
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
 *                 path: /api/postReport/createOrUpdatePostReport
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/createOrUpdatePostReport', createOrUpdatePostReport);

/**
 * @swagger
 * /api/postReport/disconnectTagFromPostReport:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     description: Update an existing post report disconnecting one of its tags.
 *     tags: [PostReport]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postReportId:
 *                 type: integer
 *                 example: 1
 *               tagId:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - postReportId
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
 *                 postId: 3
 *                 type: "Violação dos termos de uso"
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/postReport/disconnectTagFromPostReport
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
 *                 path: /api/postReport/disconnectTagFromPostReport
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.put('/disconnectTagFromPostReport/', disconnectTagFromPostReport);

/**
 * @swagger
 * /api/postReport/getAllPostReports:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all post reports.
 *     tags: [PostReport]
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
 *                 path: /api/postReport/getAllPostReports
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
 *                 path: /api/postReport/getAllPostReports
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getAllPostReports', moderatorMiddleware, getAllPostReports);

/**
 * @swagger
 * /api/postReport/getPostReport/{postReportId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a post report by id.
 *     tags: [PostReport]
 *     parameters:
 *       - name: postReportId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               report:
 *                 id: 1
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
 *                 path: /api/postReport/getPostReport
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
 *                 path: /api/postReport/getPostReport
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
 *                 path: /api/postReport/getPostReport
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getPostReport/:postReportId', getPostReport);

/**
 * @swagger
 * /api/postReport/getPostReportsByAuthor:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all post reports by an author.
 *     tags: [PostReport]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorId:
 *                 type: integer
 *                 description: The id of the author whose post reports are being retrieved.
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
 *                 path: /api/postReport/getPostReportsByAuthor
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
 *                 path: /api/postReport/getPostReportsByAuthor
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/getPostReportsByAuthor/', getPostReportsByAuthor);

/**
 * @swagger
 * /api/postReport/deletePostReport/{postReportId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete an post report by id.
 *     tags: [PostReport]
 *     parameters:
 *       - name: postReportId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
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
 *                 path: /api/postReport/deletePostReport
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
 *                 path: /api/postReport/deletePostReport
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
 *                 path: /api/postReport/deletePostReport
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/deletePostReport/:postReportId', deletePostReport);

export default router;
