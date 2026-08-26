import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

import { upsertAbout, getAbout, uploadResume } from '../controller/about.controller.js';

const aboutRouter = Router();

const aboutPhoto = upload.fields([{ name: 'photo', maxCount: 1 }]);

aboutRouter.route('/getAbout').get(getAbout);
aboutRouter.route('/about').post(verifyJwt, aboutPhoto, upsertAbout);
aboutRouter.route('/resume').post(verifyJwt, upload.single('resume'), uploadResume);

export { aboutRouter };
