import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

import {
    testimonialController,
    getAllTestimonial,
    testimonialEdit,
    testimonialDelete,
} from '../controller/testimonial.controller.js';

const testimonialRouter = Router();

testimonialRouter.route('/getTestimonial').get(getAllTestimonial);

testimonialRouter
    .route('/testimonial')
    .post(verifyJwt, upload.single('avatar'), testimonialController);
testimonialRouter
    .route('/testimonialEdit/:id')
    .patch(verifyJwt, upload.single('avatar'), testimonialEdit);
testimonialRouter.route('/testimonialDelete/:id').delete(verifyJwt, testimonialDelete);

export { testimonialRouter };
