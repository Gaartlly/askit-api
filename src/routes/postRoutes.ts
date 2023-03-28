import express from 'express';
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
 *         authorId:
 *           type: integer
 *           example: 2
 *       required:
 *         - title
 *         - content
 *         - authorId
 *
 */

/**
 * @swagger
 * /api/post/createPost:
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
 *               authorId: 2
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
 *                 authorId: 2
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/post/createPost
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
 *                 path: /api/post/createPost
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/createPost', createPost);

/**
 * @swagger
 * /api/post/updatePost/{postId}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     description: Update a post by id.
 *     tags: [Post]
 *     parameters:
 *       - name: postId
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
 *             authorId: 1
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
 *                 authorId: 1
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/post/updatePost
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
 *                 path: /api/post/updatePost
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
 *                 path: /api/post/updatePost
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.put('/updatePost/:postId', updatePost);

/**
 * @swagger
 * /api/post/disconnectTagFromPost:
 *   post:
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
 *               postId:
 *                 type: integer
 *                 example: 1
 *               tagId:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - postId
 *               - tagId
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
 *                 authorId: 2
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/post/disconnectTagFromPost
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
 *                 path: /api/post/disconnectTagFromPost
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.put('/disconnectTagFromPost/', disconnectTagFromPost);

/**
 * @swagger
 * /api/post/getAllPosts:
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
 *                 path: /api/post/getAllPosts
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
 *                 path: /api/post/getAllPosts
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getAllPosts', getAllPosts);

/**
 * @swagger
 * /api/post/getPost/{postId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a post by id.
 *     tags: [Post]
 *     parameters:
 *       - name: postId
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
 *                 authorId: 2
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/post/getPost/
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
 *                 path: /api/post/getPost/
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
 *                 path: /api/post/getPost/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getPost/:postId', getPost);

/**
 * @swagger
 * /api/post/getPostsByAuthor:
 *   get:
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
 *               authorId:
 *                 type: integer
 *                 description: The id of the author whose posts are being retrieved.
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
 *               posts: []
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/post/getPostsByAuthor
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
 *                 path: /api/post/getPostsByAuthor
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getPostsByAuthor/', getPostsByAuthor);

/**
 * @swagger
 * /api/post/deletePost/{postId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete an post by id.
 *     tags: [Post]
 *     parameters:
 *       - name: postId
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
 *                 path: /api/post/deletePost
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
 *                 path: /api/post/deletePost
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
 *                 path: /api/post/deletePost
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/deletePost/:postId', deletePost);

export default router;
