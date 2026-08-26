import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';

import {
    upsertSectionHeading,
    getAllSectionHeading,
    sectionHeadingDelete,
} from '../controller/sectionHeading.controller.js';

const sectionHeadingRouter = Router();

sectionHeadingRouter.route('/getSectionHeading').get(getAllSectionHeading);

sectionHeadingRouter.route('/sectionHeading').post(verifyJwt, upsertSectionHeading);
sectionHeadingRouter.route('/sectionHeadingDelete/:section').delete(verifyJwt, sectionHeadingDelete);

export { sectionHeadingRouter };
