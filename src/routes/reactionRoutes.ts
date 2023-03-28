import express from 'express';
import {
    createOrUpdateReaction,
    getAllReactions,
    getReaction,
    deleteReaction,
    getReactionsByAuthor,
} from '../controllers/reactionController';

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
 *     Reaction:
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
 *         type:
 *           $ref: '#/components/schemas/ReactionType'
 *           example: UPVOTE
 *       required:
 *         - authorId
 *         - commentId
 *         - postId
 *         - type
 *
 */

/**
 * @swagger
 * /api/reaction/createOrUpdateReaction:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Create a new reaction or update an existing one containing the same foreign keys.
 *     tags: [Reaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reaction'
 *             example:
 *               authorId: 2
 *               commentId: 3
 *               postId: 4
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
 *                 commentId: 3
 *                 postId: 4
 *                 type: UPVOTE
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/reaction/createOrUpdateReaction
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
 *                 path: /api/reaction/createOrUpdateReaction
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/createOrUpdateReaction', createOrUpdateReaction);

/**
 * @swagger
 * /api/reaction/getAllReactions:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all reactions.
 *     tags: [Reaction]
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
 *                 path: /api/reaction/getAllReactions
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
 *                 path: /api/reaction/getAllReactions
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getAllReactions', getAllReactions);

/**
 * @swagger
 * /api/reaction/getReaction/{reactionId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a reaction by id.
 *     tags: [Reaction]
 *     parameters:
 *       - in: path
 *         name: reactionId
 *         required: true
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               reaction:
 *                 id: 1
 *                 commentId: 1
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
 *                 path: /api/reaction/getReaction
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
 *                 path: /api/reaction/getReaction
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
 *                 path: /api/reaction/getReaction
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getReaction/:reactionId', getReaction);

/**
 * @swagger
 * /api/reaction/getReactionByAuthor:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all reactions by an author.
 *     tags: [Reaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorId:
 *                 type: integer
 *                 description: The id of the author whose reactions are being retrieved.
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
 *                 path: /api/reaction/getReactionByAuthor
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
 *                 path: /api/reaction/getReactionByAuthor
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getReactionByAuthor/', getReactionsByAuthor);

/**
 * @swagger
 * /api/reaction/deleteReaction/{reactionId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete an reaction by id.
 *     tags: [Reaction]
 *     parameters:
 *       - in: path param
 *         name: reactionId
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
 *                 path: /api/reaction/deleteReaction
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
 *                 path: /api/reaction/deleteReaction
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
 *                 path: /api/reaction/deleteReaction
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/deleteReaction/:reactionId', deleteReaction);

export default router;
