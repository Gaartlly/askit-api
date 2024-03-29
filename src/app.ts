import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import commentRoutes from './routes/commentRoutes';
import fileRoutes from './routes/fileRoutes';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';
import tagRoutes from './routes/tagRoutes';
import commentReactionRoutes from './routes/commentReactionRoutes';
import postReactionRoutes from './routes/postReactionRoutes';
import commentReportRoutes from './routes/commentReportRoutes';
import postReportRoutes from './routes/postReportRoutes';
import userControlRoutes from './routes/userControlRoutes';
import verifyAuthentication from './middleware/authUserMiddleware';
import loginRoutes from './routes/loginRoute';
import swaggerDocs from './config/swaggerConfig';
import swaggerUi from 'swagger-ui-express';
import { errorResponse } from './utils/responseHandler';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * App routes
 */
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
        explorer: true,
    })
);
app.use('/api/user', userRoutes);
app.use('/api/file', verifyAuthentication, fileRoutes);
app.use('/api/comment', verifyAuthentication, commentRoutes);
app.use('/api/post', verifyAuthentication, postRoutes);
app.use('/api/tag', verifyAuthentication, tagRoutes);
app.use('/api/commentReaction', verifyAuthentication, commentReactionRoutes);
app.use('/api/postReaction', verifyAuthentication, postReactionRoutes);
app.use('/api/commentReport', verifyAuthentication, commentReportRoutes);
app.use('/api/postReport', verifyAuthentication, postReportRoutes);
app.use('/api/userControl', verifyAuthentication, userControlRoutes);
app.use('/api', loginRoutes);

app.use(errorResponse);
app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
