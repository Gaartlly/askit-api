import express from 'express';
import {
    createUserControl,
    updateUserControl,
    getAllUserControls,
    getUserControl,
    deleteUserControl,
} from '../controllers/userControlController';

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
 *     UserControl:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         reason:
 *           type: string
 *           example: "Violação dos termos de uso."
 *         userId:
 *           type: integer
 *           example: 1
 *       required:
 *         - reason
 *         - userId
 *
 */

/**
 * @swagger
 * /api/userControl/createUserControl:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Create a new userControl.
 *     tags: [UserControl]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/UserControl'
 *
 *           example:
 *             reason: "Violação dos termos de uso."
 *             userId: 1
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               userControl:
 *                 id: 1
 *                 reason: "Violação dos termos de uso."
 *                 userId: 1
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/userControl/createUserControl
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
 *                 path: /api/userControl/createUserControl
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.post('/createUserControl', createUserControl);

/**
 * @swagger
 * /api/userControl/updateUserControl/{userControlId}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     description: Update an userControl by id.
 *     tags: [UserControl]
 *     parameters:
 *       - in: path param
 *         name: userControlId
 *         required: true
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/UserControl'
 *
 *           example:
 *             reason: "Violação dos termos de uso."
 *             userId: 1
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               userControl:
 *                 id: 1
 *                 reason: "Violação dos termos de uso."
 *                 userId: 1
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/userControl/updateUserControl
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
 *                 path: /api/userControl/updateUserControl
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
 *                 path: /api/userControl/updateUserControl
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.put('/updateUserControl/:userControlId', updateUserControl);

/**
 * @swagger
 * /api/userControl/getAllUserControls:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all userControls.
 *     tags: [UserControl]
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               userControls: []
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/userControl/getAllUserControls
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
 *                 path: /api/userControl/getAllUserControls
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getAllUserControls', getAllUserControls);

/**
 * @swagger
 * /api/userControl/getUserControl/{userControlId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a userControl by id.
 *     tags: [UserControl]
 *     parameters:
 *       - in: path param
 *         name: userControlId
 *         required: true
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               response: Successful
 *               userControl:
 *                 id: 1
 *                 reason: "Violação dos termos de uso."
 *                 userId: 1
 *
 *       400:
 *         content:
 *           application/json:
 *             example:
 *               response: Error
 *               error:
 *                 type: BadRequestError
 *                 path: /api/userControl/getUserControl
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
 *                 path: /api/userControl/getUserControl
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
 *                 path: /api/userControl/getUserControl
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.get('/getUserControl/:userControlId', getUserControl);

/**
 * @swagger
 * /api/userControl/deleteUserControl/{userControlId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete an userControl by id.
 *     tags: [UserControl]
 *     parameters:
 *       - in: path param
 *         name: userControlId
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
 *                 path: /api/userControl/deleteUserControl
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
 *                 path: /api/userControl/deleteUserControl
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
 *                 path: /api/userControl/deleteUserControl
 *                 statusCode: 500
 *                 message: Internal Server Error
 *
 */
router.delete('/deleteUserControl/:userControlId', deleteUserControl);

export default router;
