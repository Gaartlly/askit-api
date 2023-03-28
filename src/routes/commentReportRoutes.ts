import express from 'express';
import {
    createOrUpdateCommentReport,
    getAllCommentReports,
    getCommentReport,
    deleteCommentReport,
    disconnectTagFromCommentReport,
    getCommentReportsByAuthor,
} from '../controllers/commentReportController';

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
 *     CommentReport:
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
 *         reason:
 *           type: string
 *           example: "Violação dos termos de uso."
 *       required:
 *         - authorId
 *         - commentId
 *         - reason
 *
 */

/**
 * @swagger
 * /api/commentReport/createOrUpdateCommentReport:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Create a new comment report or update an existing one containing the same foreign keys.
 *     tags: [CommentReport]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentReport'
 *             example:
 *               authorId: 2
 *               commentId: 3
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
 *                 type: "Violação dos termos de uso"
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/commentReport/createOrUpdateCommentReport
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
 *                 path: /api/commentReport/createOrUpdateCommentReport
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/createOrUpdateCommentReport', createOrUpdateCommentReport);

/**
 * @swagger
 * /api/commentReport/disconnectTagFromCommentReport:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Update an existing comment report disconnecting one of its tags.
 *     tags: [CommentReport]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentReportId:
 *                 type: integer
 *                 example: 1
 *               tagId:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - commentReportId
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
 *                 type: "Violação dos termos de uso"
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/commentReport/disconnectTagFromCommentReport
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
 *                 path: /api/commentReport/disconnectTagFromCommentReport
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.put('/disconnectTagFromCommentReport/', disconnectTagFromCommentReport);

/**
 * @swagger
 * /api/commentReport/getAllCommentReports:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all comment reports.
 *     tags: [CommentReport]
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
 *                 path: /api/commentReport/getAllCommentReports
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
 *                 path: /api/commentReport/getAllCommentReports
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getAllCommentReports', getAllCommentReports);

/**
 * @swagger
 * /api/commentReport/getCommentReport/{commentReportId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a comment report by id.
 *     tags: [CommentReport]
 *     parameters:
 *       - in: path
 *         name: commentReportId
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
 *                 path: /api/commentReport/getCommentReport
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
 *                 path: /api/commentReport/getCommentReport
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
 *                 path: /api/commentReport/getCommentReport
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getCommentReport/:commentReportId', getCommentReport);

/**
 * @swagger
 * /api/commentReport/getCommentReportsByAuthor:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all comment reports by an author.
 *     tags: [CommentReport]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorId:
 *                 type: integer
 *                 description: The id of the author whose comment reports are being retrieved.
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
 *                 path: /api/commentReport/getCommentReportsByAuthor
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
 *                 path: /api/commentReport/getCommentReportsByAuthor
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getCommentReportsByAuthor/', getCommentReportsByAuthor);

/**
 * @swagger
 * /api/commentReport/deleteCommentReport/{commentReportId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete an comment report by id.
 *     tags: [CommentReport]
 *     parameters:
 *       - in: path param
 *         name: commentReportId
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
 *                 path: /api/commentReport/deleteCommentReport
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
 *                 path: /api/commentReport/deleteCommentReport
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
 *                 path: /api/commentReport/deleteCommentReport
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/deleteCommentReport/:commentReportId', deleteCommentReport);

export default router;
