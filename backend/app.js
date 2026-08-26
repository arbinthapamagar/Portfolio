import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// here i use the cors orign because i just want to give the specific url the access

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

// here i wana convert all the json file into the javascript object
app.use(
  express.json({
    limit: '20kb',
  }),
);

// this will let me help in the getting the form value nicely and in format and readable
app.use(
  express.urlencoded({
    extended: true,
    limit: '20kb',
  }),
);
// using the helmet

app.use(helmet());

// make the public folder accessable only needed if the image are in the public folder if i use cloudinary i dont need this because the image will be in the cloud and i will get the url of the image and save it in the database and use it when i need to show the image
app.use(express.static('public'));

// using the cookieparser for the data reciving from the cookie and make it in the format of the javascript object
app.use(cookieParser());

//routes import here **************************
import { adminRouter } from './src/routes/admin.route.js';
import { contactRouter } from './src/routes/contact.route.js';
import { experienceRouter } from './src/routes/experience.route.js';
import { projectRouter } from './src/routes/project.route.js';
import { testimonialRouter } from './src/routes/testimonial.route.js';
import { serviceRouter } from './src/routes/service.route.js';
import { clientRouter } from './src/routes/client.route.js';
import { heroRouter } from './src/routes/hero.route.js';
import { aboutRouter } from './src/routes/about.route.js';
import { footerRouter } from './src/routes/footer.route.js';
import { sectionHeadingRouter } from './src/routes/sectionHeading.route.js';

// route decleration

app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/contact', contactRouter);
app.use('/api/v1/experience', experienceRouter);
app.use('/api/v1/project', projectRouter);
app.use('/api/v1/testimonial', testimonialRouter);
app.use('/api/v1/service', serviceRouter);
app.use('/api/v1/client', clientRouter);
app.use('/api/v1/hero', heroRouter);
app.use('/api/v1/about', aboutRouter);
app.use('/api/v1/footer', footerRouter);
app.use('/api/v1/sectionHeading', sectionHeadingRouter);

export default app;
