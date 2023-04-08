import express from 'express';
import moderatorMiddleware from '../middleware/moderatorMiddleware';
import { createTag, updateTag, getAllTags, getTag, deleteTag } from '../controllers/tagController';

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
 *     Tag:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         key:
 *           type: string
 *           example: "Matemática Discreta"
 *         category-id:
 *           type: integer
 *           example: 1
 *       required:
 *         - key
 *         - category-id
 *
 */

/**
 * @swagger
 * /api/tag/:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Create a new tag.
 *     tags: [Tag]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Tag'
 *
 *           example:
 *             key: Matemática Discreta
 *             category-id: 1
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               tag:
 *                 id: 1
 *                 key: Matemática Discreta
 *                 category-id: 1
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/tag/
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
 *                 path: /api/tag/createTag
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/', moderatorMiddleware, createTag);

/**
 * @swagger
 * /api/tag/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     description: Update an tag by id.
 *     tags: [Tag]
 *     parameters:
 *       - name: tag-id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Tag'
 *
 *           example:
 *             key: Matemática Discreta
 *             category-id: 1
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               tag:
 *                 id: 1
 *                 key: Matemática Discreta
 *                 category-id: 1
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/tag/
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
 *                 path: /api/tag/
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
 *                 path: /api/tag/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.put('/:id', moderatorMiddleware, updateTag);

/**
 * @swagger
 * /api/tag/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all tags.
 *     tags: [Tag]
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               tags: []
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/tag/
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
 *                 path: /api/tag/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/', moderatorMiddleware, getAllTags);

/**
 * @swagger
 * /api/tag/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a tag by id.
 *     tags: [Tag]
 *     parameters:
 *       - name: tag-id
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
 *               tag:
 *                 id: 1
 *                 key: Matemática Discreta
 *                 category-id: 1
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/tag/
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
 *                 path: /api/tag/
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
 *                 path: /api/tag/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/:id', moderatorMiddleware, getTag);

/**
 * @swagger
 * /api/tag/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete an tag by id.
 *     tags: [Tag]
 *     parameters:
 *       - name: tag-id
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
 *                 path: /api/tag/
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
 *                 path: /api/tag/
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
 *                 path: /api/tag/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/:id', moderatorMiddleware, deleteTag);

export default router;
