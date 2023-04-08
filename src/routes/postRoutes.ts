import express from 'express';
import moderatorMiddleware from '../middleware/moderatorMiddleware';
import {
    createPost,
    updatePost,
    getAllPosts,
    getPost,
    deletePost,
    disconnectTagFromPost,
    getPostsByAuthor,
} from '../controllers/postController';

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
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Título do post"
 *         content:
 *           type: string
 *           example: "Conteúdo do post."
 *         author-id:
 *           type: integer
 *           example: 2
 *       required:
 *         - title
 *         - content
 *         - author-id
 *
 */

/**
 * @swagger
 * /api/post/:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Create a new post.
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *             example:
 *               title: "Título do post"
 *               content: "Conteúdo do post."
 *               author-id: 2
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               post:
 *                 id: 1
 *                 title: "Título do post"
 *                 content: "Conteúdo do post."
 *                 author-id: 2
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/post/
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
 *                 path: /api/post/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/', createPost);

/**
 * @swagger
 * /api/post/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     description: Update a post by id.
 *     tags: [Post]
 *     parameters:
 *       - name: post-id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Post'
 *           example:
 *             title: "Título do post atualizado"
 *             content: "Conteúdo do post atualizado."
 *             author-id: 1
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               post:
 *                 id: 1
 *                 title: "Título do post atualizado"
 *                 content: "Conteúdo do post atualizado."
 *                 author-id: 1
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/post/
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
 *                 path: /api/post/
 *                 statusCode: 404
 *                 message: Post not found
 *
 *       500:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: InternalServerError
 *                 path: /api/post/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.put('/:id', updatePost);

/**
 * @swagger
 * /api/post/{id}/tag/disconnect/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     description: Disconnect a tag from a post.
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post-id:
 *                 type: integer
 *                 example: 1
 *               tag-id:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - post-id
 *               - tag-id
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               post:
 *                 id: 1
 *                 title: "Título do post"
 *                 content: "Conteúdo do post."
 *                 author-id: 2
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/post/
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
 *                 path: /api/post/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.put('/:id/tag/disconnect/:id', disconnectTagFromPost);

/**
 * @swagger
 * /api/post/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all posts.
 *     tags: [Post]
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               posts: []
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/post/
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
 *                 path: /api/post/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/', moderatorMiddleware, getAllPosts);

/**
 * @swagger
 * /api/post/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a post by id.
 *     tags: [Post]
 *     parameters:
 *       - name: post-id
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
 *               post:
 *                 id: 1
 *                 title: "Título do Post"
 *                 content: "Conteúdo do post."
 *                 author-id: 2
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/post/
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
 *                 path: /api/post/
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
 *                 path: /api/post/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/:id', getPost);

/**
 * @swagger
 * /api/post/author/{id}:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all posts by an author.
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               author-id:
 *                 type: integer
 *                 description: The id of the author whose posts are being retrieved.
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
 *               posts: []
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/post/
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
 *                 path: /api/post/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/author/:id', getPostsByAuthor);

/**
 * @swagger
 * /api/post/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete an post by id.
 *     tags: [Post]
 *     parameters:
 *       - name: post-id
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
 *                 path: /api/post/
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
 *                 path: /api/post/
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
 *                 path: /api/post/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/:id', deletePost);

export default router;
