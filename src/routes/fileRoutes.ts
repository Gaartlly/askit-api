import express from 'express';
import { updateFile, getFileById, getAllFiles, uploadFile, deleteFile } from '../controllers/fileController';

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
 *     File:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         title:
 *           type: string
 *           example: "Prova Algoritmos III - 2023/1"
 *         path:
 *           type: string
 *           example: "https://cdn.pixabay.com/photo/2023/03/18/07/55/tawny-owl-7860086_960_720.jpg"
 *         post-id:
 *           type: integer
 *           example: 4
 *         comment-id:
 *           type: integer
 *           example: 25
 *       required:
 *         - title
 *         - path
 *         - post-id
 *         - comment-id
 *
 */

/**
 * @swagger
 * /api/file/:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Upload new file.
 *     tags: [File]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/File'
 *
 *           example:
 *             title: Prova Algoritmos III - 2023/1
 *             path: https://cdn.pixabay.com/photo/2023/03/18/07/55/tawny-owl-7860086_960_720.jpg
 *             post-id: 3
 *             comment-id: 1
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               file:
 *                 id: 10
 *                 title: xyz
 *                 path: https://xyz-example.com
 *                 post-id: 25
 *                 comment-id: 10
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/file/
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
 *                 path: /api/file/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/', uploadFile);

/**
 * @swagger
 * /api/file/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all files.
 *     tags: [File]
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               files: []
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/file/
 *                 status-code: 400
 *                 message: Bad request
 *
 *       500:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: InternalServerError
 *                 path: /api/file/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/', getAllFiles);

/**
 * @swagger
 * /api/file/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve file by id.
 *     tags: [File]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               file:
 *                 id: 10
 *                 title: xyz
 *                 path: https://xyz-example.com
 *                 post-id: 25
 *                 comment-id: 10
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/file/
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
 *                 path: /api/file/
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
 *                 path: /api/file/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/:id', getFileById);

/**
 * @swagger
 * /api/file/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete file.
 *     tags: [File]
 *     parameters:
 *       - in: path
 *         name: file-id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
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
 *                 path: /api/file/
 *                 status-code: 400
 *                 message: Bad request
 *
 *       404:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: NotFoundError
 *                 path: /api/file/
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
 *                 path: /api/file/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/:id', deleteFile);

/**
 * @swagger
 * /api/file/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     description: Update file.
 *     tags: [File]
 *     parameters:
 *       - in: path
 *         name: file-id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               file:
 *                 id: 10
 *                 title: abc
 *                 path: https://abc-example.com
 *                 post-id: 25
 *                 comment-id: 10
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/file/
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
 *                 path: /api/file/
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
 *                 path: /api/file/
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.put('/:id', updateFile);

export default router;
