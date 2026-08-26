import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';

import {
    educationController,
    getAllEducation,
    educationEdit,
    educationDelete,
} from '../controller/education.controller.js';

const educationRouter = Router();

educationRouter.route('/getEducation').get(getAllEducation);

educationRouter.route('/education').post(verifyJwt, educationController);
educationRouter.route('/educationEdit/:id').patch(verifyJwt, educationEdit);
educationRouter.route('/educationDelete/:id').delete(verifyJwt, educationDelete);

export { educationRouter };
