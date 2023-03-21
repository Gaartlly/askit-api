import swaggerAutogen from 'swagger-autogen';

const endpointsFiles = ['./routes/commentRoutes'];

swaggerAutogen('./swagger_output.json', endpointsFiles);