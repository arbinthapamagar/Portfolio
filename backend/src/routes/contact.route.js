import {Router} from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { verifyJwt } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'

import {contactController, getContactMessage, deleteContact} from "../controller/contact.controller.js"


const contactRouter = Router();


contactRouter.route('/contact-us').post(contactController);
contactRouter.route('/getContactMessage').get(verifyJwt,getContactMessage)
contactRouter.route('/deleteContact/:id').delete(verifyJwt,deleteContact)







export {contactRouter}






