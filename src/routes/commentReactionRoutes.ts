import express from 'express';
import {
    createOrUpdateCommentReaction,
    getAllCommentReactions,
    getCommentReaction,
    deleteCommentReaction,
    getCommentReactionsByAuthor,
} from '../controllers/commentReactionController';

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
 *     CommentReaction:
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
 *         type:
 *           $ref: '#/components/schemas/ReactionType'
 *           example: UPVOTE
 *       required:
 *         - authorId
 *         - commentId
 *         - type
 *
 */

/**
 * @swagger
 * /api/commentReaction/createOrUpdateCommentReaction:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Create a new comment reaction or update an existing one containing the same foreign keys.
 *     tags: [CommentReaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentReaction'
 *             example:
 *               authorId: 2
 *               commentId: 3
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
 *                 type: UPVOTE
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/commentReaction/createOrUpdateCommentReaction
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
 *                 path: /api/commentReaction/createOrUpdateCommentReaction
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/createOrUpdateCommentReaction', createOrUpdateCommentReaction);

/**
 * @swagger
 * /api/commentReaction/getAllCommentReactions:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all comment reactions.
 *     tags: [CommentReaction]
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
 *                 path: /api/commentReaction/getAllCommentReactions
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
 *                 path: /api/commentReaction/getAllCommentReactions
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getAllCommentReactions', getAllCommentReactions);

/**
 * @swagger
 * /api/commentReaction/getCommentReaction/{commentReactionId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a comment reaction by id.
 *     tags: [CommentReaction]
 *     parameters:
 *       - name: commentReactionId
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
 *                 commentId: 1
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
 *                 path: /api/commentReaction/getCommentReaction
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
 *                 path: /api/commentReaction/getCommentReaction
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
 *                 path: /api/commentReaction/getCommentReaction
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getCommentReaction/:commentReactionId', getCommentReaction);

/**
 * @swagger
 * /api/commentReaction/getCommentReactionsByAuthor:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all comment reactions by an author.
 *     tags: [CommentReaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorId:
 *                 type: integer
 *                 description: The id of the author whose comment reactions are being retrieved.
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
 *                 path: /api/commentReaction/getCommentReactionsByAuthor
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
 *                 path: /api/commentReaction/getCommentReactionsByAuthor
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/getCommentReactionsByAuthor/', getCommentReactionsByAuthor);

/**
 * @swagger
 * /api/commentReaction/deleteCommentReaction/{commentReactionId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete an comment reaction by id.
 *     tags: [CommentReaction]
 *     parameters:
 *       - name: commentReactionId
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
 *                 path: /api/commentReaction/deleteCommentReaction
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
 *                 path: /api/commentReaction/deleteCommentReaction
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
 *                 path: /api/commentReaction/deleteCommentReaction
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/deleteCommentReaction/:commentReactionId', deleteCommentReaction);

export default router;
