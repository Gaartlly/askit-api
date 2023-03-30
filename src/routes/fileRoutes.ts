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
 *         postId:
 *           type: integer
 *           example: 4
 *         commentId:
 *           type: integer
 *           example: 25
 *       required:
 *         - title
 *         - path
 *         - postId
 *         - commentId
 *
 */

/**
 * @swagger
 * /api/file/upload-file:
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
 *             postId: 3
 *             commentId: 1
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
 *                 postId: 25
 *                 commentId: 10
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/file-upload
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
 *                 path: /api/file-upload
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/upload-file', uploadFile);

/**
 * @swagger
 * /api/file/get-all-files:
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
 *                 path: /api/get-all-files
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
 *                 path: /api/get-all-files
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/get-all-files', getAllFiles);

/**
 * @swagger
 * /api/file/get-file-by-id/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve file by id.
 *     tags: [File]
 *     parameters:
 *       - in: path param
 *         name: fileId
 *         required: true
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
 *                 postId: 25
 *                 commentId: 10
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/get-file-by-id
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
 *                 path: /api/get-file-by-id
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
 *                 path: /api/get-file-by-id
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/get-file-by-id/:id', getFileById);

/**
 * @swagger
 * /api/file/delete-file/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete file.
 *     tags: [File]
 *     parameters:
 *       - in: path param
 *         name: fileId
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
 *                 path: /api/delete-file
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
 *                 path: /api/delete-file
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
 *                 path: /api/delete-file
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/delete-file/:id', deleteFile);

/**
 * @swagger
 * /api/file/update-file/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     description: Update file.
 *     tags: [File]
 *     parameters:
 *       - in: path param
 *         name: fileId
 *         required: true
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
 *                 postId: 25
 *                 commentId: 10
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/update-file
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
 *                 path: /api/update-file
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
 *                 path: /api/update-file
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.put('/update-file/:id', updateFile);

export default router;