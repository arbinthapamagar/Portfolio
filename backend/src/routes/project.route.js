import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

import {
    projectController,
    getAllProject,
    getProjectById,
    projectEdit,
    projectDelete,
} from '../controller/project.controller.js';

const projectRouter = Router();

// public reads — the portfolio page needs these without a login
projectRouter.route('/getProject').get(getAllProject);
projectRouter.route('/getProject/:id').get(getProjectById);

// admin writes
projectRouter
    .route('/project')
    .post(verifyJwt, upload.array('screenshots', 6), projectController);
projectRouter
    .route('/projectEdit/:id')
    .patch(verifyJwt, upload.array('screenshots', 6), projectEdit);
projectRouter.route('/projectDelete/:id').delete(verifyJwt, projectDelete);

export { projectRouter };
