import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

import {experienceController,getAllExperience,experienceEdit, experienceDelete} from "../controller/experience.controller.js"



const experienceRouter = Router();

const imageUrl = upload.single({ name: 'imageUrl', maxCount: 1 });

experienceRouter.route('/experience').post(upload.single ('imageUrl'), verifyJwt,experienceController);
experienceRouter.route('/getExperience').get(verifyJwt, getAllExperience);
experienceRouter.route('/experienceEdit/:id').patch(upload.single ('imageUrl'), verifyJwt,experienceEdit);
experienceRouter.route('/experienceDelete/:id').delete(verifyJwt,experienceDelete)



export {experienceRouter}