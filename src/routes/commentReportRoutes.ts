import express from 'express';
import moderatorMiddleware from '../middleware/moderatorMiddleware';
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
 *     comment-report:
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
 * /api/comment-report/createOrUpdateCommentReport:
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
 * /api/comment-report/{id}/tag/disconnect/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     description: Update an existing comment report disconnecting one of its tags.
 *     tags: [comment-report]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment-report-id:
 *                 type: integer
 *                 example: 1
 *               tagId:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - comment-report-id
 *               - tag-id
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
 *                 path: /api/comment-report/{id}/tag/disconnect/{id}
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
 *                 path: /api/comment-report/{id}/tag/disconnect/{id}
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.put('/comment-report/:id/tag/disconnect/:id', disconnectTagFromCommentReport);

/**
 * @swagger
 * /api/comment-report/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all comment reports.
 *     tags: [comment-report]
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
 *                 path: /api/comment-report/
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
 *                 path: /api/comment-report/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/', moderatorMiddleware, getAllCommentReports);

/**
 * @swagger
 * /api/comment-report/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a comment report by id.
 *     tags: [comment-report]
 *     parameters:
 *       - name: comment-report-id
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
 *                 path: /api/comment-report/{id}
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
 *                 path: /api/comment-report/{id}
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
 *                 path: /api/comment-report/{id}
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/:id', getCommentReport);

/**
 * @swagger
 * /api/comment-report/author/{id}:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all comment reports by an author.
 *     tags: [comment-report]
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
 *                 path: /api/comment-report/author/{id}
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
 *                 path: /api/comment-report/author/{id}
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/author/{id}', getCommentReportsByAuthor);

/**
 * @swagger
 * /api/comment-report/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete an comment report by id.
 *     tags: [comment-report]
 *     parameters:
 *       - name: comment-report-id
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
 *                 path: /api/comment-report/{id}
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
 *                 path: /api/comment-report/{id}
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
 *                 path: /api/comment-report/{id}
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/:id', deleteCommentReport);

export default router;
