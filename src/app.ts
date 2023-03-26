import dotenv from 'dotenv';
dotenv.config();
import express, { application } from 'express';
import bodyParser from 'body-parser';
import commentRoutes from './routes/commentRoutes';
import fileRoutes from './routes/fileRoutes';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';
import tagRoutes from './routes/tagRoutes';
import { verifyAuthentication } from './middleware/authUserMiddleware';
import loginRoutes from './routes/loginRoute';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger_output.json';
import { errorResponse } from './utils/responseHandler';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

/**
 * App routes
 */
app.use('/api/user', userRoutes);
app.use('/api/file', verifyAuthentication, fileRoutes);
app.use('/api/comment', verifyAuthentication, commentRoutes);
app.use('/api/post', verifyAuthentication, postRoutes);
app.use('/api/tag', verifyAuthentication, tagRoutes);
app.use('/api', loginRoutes);

app.use(errorResponse);
app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
