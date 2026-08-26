import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

import {
    clientController,
    getAllClient,
    clientEdit,
    clientDelete,
} from '../controller/client.controller.js';

const clientRouter = Router();

clientRouter.route('/getClient').get(getAllClient);

clientRouter.route('/client').post(verifyJwt, upload.single('logo'), clientController);
clientRouter.route('/clientEdit/:id').patch(verifyJwt, upload.single('logo'), clientEdit);
clientRouter.route('/clientDelete/:id').delete(verifyJwt, clientDelete);

export { clientRouter };
