import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

import { upsertHero, getHero } from '../controller/hero.controller.js';

const heroRouter = Router();

const heroImages = upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'badgeImage1', maxCount: 1 },
    { name: 'badgeImage2', maxCount: 1 },
]);

heroRouter.route('/getHero').get(getHero);
heroRouter.route('/hero').post(verifyJwt, heroImages, upsertHero);

export { heroRouter };
