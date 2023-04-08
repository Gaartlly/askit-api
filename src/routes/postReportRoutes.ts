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
 *     post-report:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         author-id:
 *           type: integer
 *           example: 2
 *         post-id:
 *           type: integer
 *           example: 3
 *         reason:
 *           type: string
 *           example: "Violação dos termos de uso."
 *       required:
 *         - author-id
 *         - post-id
 *         - reason
 *
 */

/**
 * @swagger
 * /api/post-report/createOrUpdatePostReport:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Create a new post report or update an existing one containing the same foreign keys.
 *     tags: [post-report]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostReport'
 *             example:
 *               author-id: 2
 *               post-id: 3
 *               type: "Violação dos termos de uso"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               report:
 *                 id: 1
 *                 author-id: 2
 *                 post-id: 3
 *                 type: "Violação dos termos de uso"
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/post-report/createOrUpdatePostReport
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
 *                 path: /api/post-report/createOrUpdatePostReport
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/createOrUpdatePostReport', createOrUpdatePostReport);

/**
 * @swagger
 * /api/post-report/{id}/tag/disconnect/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     description: Update an existing post report disconnecting one of its tags.
 *     tags: [post-report]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post-report-id:
 *                 type: integer
 *                 example: 1
 *               tag-id:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - post-report-id
 *               - tag-id
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               report:
 *                 id: 1
 *                 author-id: 2
 *                 post-id: 3
 *                 type: "Violação dos termos de uso"
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/post-report/
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
 *                 path: /api/post-report/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.put('/:id/tag/disconnect/:id', disconnectTagFromPostReport);

/**
 * @swagger
 * /api/post-report/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all post reports.
 *     tags: [post-report]
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
 *                 path: /api/post-report/
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
 *                 path: /api/post-report/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/', moderatorMiddleware, getAllPostReports);

/**
 * @swagger
 * /api/post-report/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a post report by id.
 *     tags: [post-report]
 *     parameters:
 *       - name: post-report-id
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
 *                 post-id: 1
 *                 author-id: 1
 *                 type: "Violação dos termos de uso"
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/post-report/
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
 *                 path: /api/post-report/
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
 *                 path: /api/post-report/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/:id', getPostReport);

/**
 * @swagger
 * /api/post-report/author/{id}:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all post reports by an author.
 *     tags: [post-report]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               author-id:
 *                 type: integer
 *                 description: The id of the author whose post reports are being retrieved.
 *                 example: 1
 *             required:
 *               - author-id
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
 *                 path: /api/post-report/
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
 *                 path: /api/post-report/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/:id', getPostReportsByAuthor);

/**
 * @swagger
 * /api/post-report/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete an post report by id.
 *     tags: [post-report]
 *     parameters:
 *       - name: post-report-id
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
 *                 path: /api/post-report/
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
 *                 path: /api/post-report/
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
 *                 path: /api/post-report/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/:id', deletePostReport);

export default router;
