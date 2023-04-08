import express from 'express';
import moderatorMiddleware from '../middleware/moderatorMiddleware';
import {
    createOrUpdatePostReaction,
    getAllPostReactions,
    getPostReaction,
    deletePostReaction,
    getPostReactionsByAuthor,
} from '../controllers/postReactionController';

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
 *     ReactionType:
 *       type: string
 *       enum: [UPVOTE, DOWNVOTE]
 *
 *     post-reaction:
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
 *         type:
 *           $ref: '#/components/schemas/ReactionType'
 *           example: UPVOTE
 *       required:
 *         - author-id
 *         - post-id
 *         - type
 *
 */

/**
 * @swagger
 * /api/post-reaction/createOrUpdatePostReaction:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Create a new post reaction or update an existing one containing the same foreign keys.
 *     tags: [post-reaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/post-reaction'
 *             example:
 *               author-id: 2
 *               post-id: 3
 *               type: UPVOTE
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               reaction:
 *                 id: 1
 *                 author-id: 2
 *                 post-id: 3
 *                 type: UPVOTE
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/post-reaction/createOrUpdatePostReaction
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
 *                 path: /api/post-reaction/createOrUpdatePostReaction
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/createOrUpdatePostReaction', createOrUpdatePostReaction);

/**
 * @swagger
 * /api/post-reaction/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all post reactions.
 *     tags: [post-reaction]
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               reactions: []
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/post-reaction/
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
 *                 path: /api/post-reaction/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/', moderatorMiddleware, getAllPostReactions);

/**
 * @swagger
 * /api/post-reaction/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a post reaction by id.
 *     tags: [post-reaction]
 *     parameters:
 *       - name: post-reaction-id
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
 *               reaction:
 *                 id: 1
 *                 post-id: 1
 *                 author-id: 1
 *                 type: UPVOTE
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/post-reaction/
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
 *                 path: /api/post-reaction/
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
 *                 path: /api/post-reaction/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/:id', getPostReaction);

/**
 * @swagger
 * /api/post-reaction/author/{id}:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all post reactions by an author.
 *     tags: [post-reaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               author-id:
 *                 type: integer
 *                 description: The id of the author whose post reactions are being retrieved.
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
 *               reactions: []
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/post-reaction/
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
 *                 path: /api/post-reaction/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/author/:id', getPostReactionsByAuthor);

/**
 * @swagger
 * /api/post-reaction/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete an post reaction by id.
 *     tags: [post-reaction]
 *     parameters:
 *       - name: post-reaction-id
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
 *                 path: /api/post-reaction/
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
 *                 path: /api/post-reaction/
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
 *                 path: /api/post-reaction/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/:id', deletePostReaction);

export default router;
