import express from 'express';
import { updateFile, getFileById, getAllFiles, uploadFile, deleteFile } from '../controllers/fileController';

const router = express.Router();

/**
 * @swagger
 * components:
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
 * /api/uploadFile:
 *   post:
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
 *                 path: /api/fileUpload
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
 *                 path: /api/fileUpload
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/uploadFile', uploadFile);

/**
 * @swagger
 * /api/getAllFiles:
 *   get:
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
 *                 path: /api/getAllFiles
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
 *                 path: /api/getAllFiles
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getAllFiles', getAllFiles);

/**
 * @swagger
 * /api/getFileById/{fileId}:
 *   get:
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
 *                 path: /api/getFileById
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
 *                 path: /api/getFileById
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
 *                 path: /api/getFileById
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getFileById/:fileId', getFileById);

/**
 * @swagger
 * /api/deleteFile/{fileId}:
 *   delete:
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
 *                 path: /api/deleteFile
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
 *                 path: /api/deleteFile
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
 *                 path: /api/deleteFile
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/deleteFile/:fileId', deleteFile);

/**
 * @swagger
 * /api/updateFile/{fileId}:
 *   put:
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
 *                 path: /api/updateFile
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
 *                 path: /api/updateFile
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
 *                 path: /api/updateFile
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.put('/updateFile/:fileId', updateFile);

export default router;
