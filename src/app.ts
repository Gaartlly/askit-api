import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import commentRoutes from './routes/commentRoutes';
import * as postController from './controllers/PostController';
import * as tagController from './controllers/TagController';
import { createUser, deleteUser, getUsers, updateUserEmail, updateUserName, updateUserPassword } from './controllers/UserController';
import { deleteFile, getAllFiles, getFileById, updateFile, uploadFile } from './controllers/FileController';
import loginRoutes from './routes/loginRoute';
import { verifyAuthentication } from './middleware/authUserMiddleware';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * App routes
 */
app.use('/api', loginRoutes);
app.use('/api/comments', commentRoutes);

// Post routes
app.post('/posts', verifyAuthentication, postController.create);
app.get('/posts', verifyAuthentication, postController.index);
app.get('/posts/:id', verifyAuthentication, postController.show);
app.put('/posts/:id', verifyAuthentication, postController.update);
app.delete('/posts/:id', verifyAuthentication, postController.destroy);

// Tag routes
app.post('/tags', verifyAuthentication, tagController.create);
app.get('/tags', verifyAuthentication, tagController.index);
app.get('/tags/:id', verifyAuthentication, tagController.show);
app.put('/tags/:id', verifyAuthentication, tagController.update);
app.delete('/tags/:id', verifyAuthentication, tagController.destroy);

// User routes
app.get('/user', verifyAuthentication, getUsers);
app.post('/user/create', createUser);
app.put('/user/update/username', verifyAuthentication, updateUserName);
app.put('/user/update/password', verifyAuthentication, updateUserPassword);
app.put('/user/update/email', verifyAuthentication, updateUserEmail);
app.delete('/user/delete/:id', verifyAuthentication, deleteUser);

// File routes
app.get('/files', verifyAuthentication, getAllFiles);
app.get('/files/:id', verifyAuthentication, getFileById);
app.post('/files/upload', verifyAuthentication, uploadFile);
app.delete('/files/delete/:id', verifyAuthentication, deleteFile);
app.put('/files/update', verifyAuthentication, updateFile);

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
