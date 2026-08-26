import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';

import { upsertFooter, getFooter } from '../controller/footer.controller.js';

const footerRouter = Router();

footerRouter.route('/getFooter').get(getFooter);
footerRouter.route('/footer').post(verifyJwt, upsertFooter);

export { footerRouter };
