import cloudinary from 'cloudinary';

const cloudinaryConnection = cloudinary.v2;
cloudinaryConnection.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

export default cloudinaryConnection;
