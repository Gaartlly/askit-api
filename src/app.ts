import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import commentRoutes from './routes/commentRoutes';
import fileRoutes from './routes/fileRoutes';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';
import tagRoutes from './routes/tagRoutes';
import cloudinary from 'cloudinary';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;
export const cloud = cloudinary.v2;
cloud.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * App routes
 */
app.use('/api/user', userRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/post', postRoutes);
app.use('/api/tag', tagRoutes);


app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
