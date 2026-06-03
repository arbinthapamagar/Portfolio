import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import {
    adminLogin,
    refreshtokenController,
    adminLogOut,
    avatarUpload,
    getAvatar,
    editAvatar,
    avatarDelete,
} from '../controller/admin.controller.js';

const adminRouter = Router();

const avatar = upload.fields({ name: 'avatar', maxCount: 1 });

adminRouter.route('/login').post(adminLogin);
adminRouter.route('/refresh-token').post(refreshtokenController);
adminRouter.route('/logout').post(verifyJwt, adminLogOut);
adminRouter.route('/avatarUpload').post(verifyJwt, avatarUpload);
adminRouter.route('/getAvatar').get(verifyJwt, getAvatar);
adminRouter.route('/editAvatar').patch(avatar,verifyJwt,editAvatar);
adminRouter.route('/deleteAvatar').delete(verifyJwt,avatarDelete)

export { adminRouter };
