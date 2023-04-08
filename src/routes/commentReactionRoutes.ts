import express from 'express';
import moderatorMiddleware from '../middleware/moderatorMiddleware';
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
 *     comment-reaction:
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
 * /api/comment-reaction/createOrUpdateCommentReaction:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Create a new comment reaction or update an existing one containing the same foreign keys.
 *     tags: [comment-reaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/comment-reaction'
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
 *                 path: /api/comment-reaction/createOrUpdateCommentReaction
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
 *                 path: /api/comment-reaction/createOrUpdateCommentReaction
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/createOrUpdateCommentReaction', createOrUpdateCommentReaction);

/**
 * @swagger
 * /api/comment-reaction/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all comment reactions.
 *     tags: [comment-reaction]
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
 *                 path: /api/comment-reaction/
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
 *                 path: /api/comment-reaction/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/', moderatorMiddleware, getAllCommentReactions);

/**
 * @swagger
 * /api/comment-reaction/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a comment reaction by id.
 *     tags: [comment-reaction]
 *     parameters:
 *       - name: id
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
 *                 comment-id: 1
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
 *                 path: /api/comment-reaction/
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
 *                 path: /api/comment-reaction/
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
 *                 path: /api/comment-reaction/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/:id', getCommentReaction);

/**
 * @swagger
 * /api/comment-reaction/author/{id}:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all comment reactions by an author.
 *     tags: [comment-reaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               author-id:
 *                 type: integer
 *                 description: The id of the author whose comment reactions are being retrieved.
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
 *                 path: /api/comment-reaction/author/
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
 *                 path: /api/comment-reaction/author/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/author/:id/', getCommentReactionsByAuthor);

/**
 * @swagger
 * /api/comment-reaction/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete an comment reaction by id.
 *     tags: [comment-reaction]
 *     parameters:
 *       - name: id
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
 *                 path: /api/comment-reaction/
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
 *                 path: /api/comment-reaction/
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
 *                 path: /api/comment-reaction/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/:id', deleteCommentReaction);

export default router;
