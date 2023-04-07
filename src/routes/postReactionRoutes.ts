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
 *     PostReaction:
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
 *         type:
 *           $ref: '#/components/schemas/ReactionType'
 *           example: UPVOTE
 *       required:
 *         - authorId
 *         - postId
 *         - type
 *
 */

/**
 * @swagger
 * /api/postReaction/createOrUpdatePostReaction:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Create a new post reaction or update an existing one containing the same foreign keys.
 *     tags: [PostReaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostReaction'
 *             example:
 *               authorId: 2
 *               postId: 3
 *               type: UPVOTE
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               reaction:
 *                 id: 1
 *                 authorId: 2
 *                 postId: 3
 *                 type: UPVOTE
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/postReaction/createOrUpdatePostReaction
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
 *                 path: /api/postReaction/createOrUpdatePostReaction
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/createOrUpdatePostReaction', createOrUpdatePostReaction);

/**
 * @swagger
 * /api/postReaction/getAllPostReactions:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all post reactions.
 *     tags: [PostReaction]
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
 *                 path: /api/postReaction/getAllPostReactions
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
 *                 path: /api/postReaction/getAllPostReactions
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getAllPostReactions', moderatorMiddleware, getAllPostReactions);

/**
 * @swagger
 * /api/postReaction/getPostReaction/{postReactionId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a post reaction by id.
 *     tags: [PostReaction]
 *     parameters:
 *       - name: postReactionId
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
 *                 postId: 1
 *                 authorId: 1
 *                 type: UPVOTE
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/postReaction/getPostReaction
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
 *                 path: /api/postReaction/getPostReaction
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
 *                 path: /api/postReaction/getPostReaction
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getPostReaction/:postReactionId', getPostReaction);

/**
 * @swagger
 * /api/postReaction/getPostReactionsByAuthor:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all post reactions by an author.
 *     tags: [PostReaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorId:
 *                 type: integer
 *                 description: The id of the author whose post reactions are being retrieved.
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
 *               reactions: []
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/postReaction/getPostReactionsByAuthor
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
 *                 path: /api/postReaction/getPostReactionsByAuthor
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/getPostReactionsByAuthor/', getPostReactionsByAuthor);

/**
 * @swagger
 * /api/postReaction/deletePostReaction/{postReactionId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete an post reaction by id.
 *     tags: [PostReaction]
 *     parameters:
 *       - name: postReactionId
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
 *                 path: /api/postReaction/deletePostReaction
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
 *                 path: /api/postReaction/deletePostReaction
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
 *                 path: /api/postReaction/deletePostReaction
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/deletePostReaction/:postReactionId', deletePostReaction);

export default router;
