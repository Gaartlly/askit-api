import express from 'express';
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
 *         categoryId:
 *           type: integer
 *           example: 1
 *       required:
 *         - key
 *         - categoryId
 *
 */

/**
 * @swagger
 * /api/tag/createTag:
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
 *             categoryId: 1
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               tag:
 *                 id: 1
 *                 key: Matemática Discreta
 *                 categoryId: 1
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/tag/createTag
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
router.post('/createTag', createTag);

/**
 * @swagger
 * /api/tag/updateTag/{tagId}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     description: Update an tag by id.
 *     tags: [Tag]
 *     parameters:
 *       - name: tagId
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
 *             categoryId: 1
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               tag:
 *                 id: 1
 *                 key: Matemática Discreta
 *                 categoryId: 1
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/tag/updateTag
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
 *                 path: /api/tag/updateTag
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
 *                 path: /api/tag/updateTag
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.put('/updateTag/:tagId', updateTag);

/**
 * @swagger
 * /api/tag/getAllTags:
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
 *                 path: /api/tag/getAllTags
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
 *                 path: /api/tag/getAllTags
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getAllTags', getAllTags);

/**
 * @swagger
 * /api/tag/getTag/{tagId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a tag by id.
 *     tags: [Tag]
 *     parameters:
 *       - name: tagId
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
 *                 categoryId: 1
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/tag/getTag
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
 *                 path: /api/tag/getTag
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
 *                 path: /api/tag/getTag
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getTag/:tagId', getTag);

/**
 * @swagger
 * /api/tag/deleteTag/{tagId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete an tag by id.
 *     tags: [Tag]
 *     parameters:
 *       - name: tagId
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
 *                 path: /api/tag/deleteTag
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
 *                 path: /api/tag/deleteTag
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
 *                 path: /api/tag/deleteTag
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/deleteTag/:tagId', deleteTag);

export default router;
