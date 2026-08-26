import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';

import {
    serviceController,
    getAllService,
    serviceEdit,
    serviceDelete,
} from '../controller/service.controller.js';

const serviceRouter = Router();

serviceRouter.route('/getService').get(getAllService);

serviceRouter.route('/service').post(verifyJwt, serviceController);
serviceRouter.route('/serviceEdit/:id').patch(verifyJwt, serviceEdit);
serviceRouter.route('/serviceDelete/:id').delete(verifyJwt, serviceDelete);

export { serviceRouter };
