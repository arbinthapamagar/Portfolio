import { Admin } from '../models/admin.model.js';

import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';

const generateAccessTokenAndRefreshToken = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId);
        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();
        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        console.log(' error', error);
        throw new apiError(
            500,
            ' Something went wrong while creating accesstoken and refresh token'
        );
    }
};

const adminLogin = asyncHandler(async (req, res) => {
    const { email, password, phoneNumber, confirmPassword } = req.body;
    if (!email || !password) {
        throw new apiError(400, ' all field are required ');
    }
    const admin = await Admin.findOne({
        $or: [{ email }, { phoneNumber }],
    });

    // if admin is not found say not found

    if (!admin) {
        throw new apiError(404, ' admin not found ');
    }
    const isPasswordCorrect = await admin.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new apiError(400, ' password didnt matched ');
    }

    if (confirmPassword !== password) {
        throw new apiError(400, ' Confirm password and password do not match. ');
    }

    // if all good then send the token into the cookies

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(admin._id);

    const loggedAdmin = await Admin.findById(admin._id).select('-password -refreshToken');

    const option = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie('accessToken', accessToken, option)
        .cookie('refreshToken', refreshToken, option)
        .json(
            new apiResponse(
                200,
                {
                    admin: loggedAdmin,
                    accessToken,
                    refreshToken,
                },
                ' Admin Logged in successfully '
            )
        );
});

//
// refreshtoken rotation
const refreshtokenController = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new apiError(401, 'unauthorized request');
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new apiError(401, 'invalid or expired refresh token');
    }

    const admin = await Admin.findById(decodedToken._id);
    if (!admin) {
        throw new apiError(401, 'admin not found');
    }

    if (incomingRefreshToken !== admin.refreshToken) {
        throw new apiError(401, 'refresh token is expired or already used');
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(admin._id);

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(new apiResponse(200, { accessToken, refreshToken }, 'access token refreshed successfully'));
});

// logout the admin

const adminLogOut = asyncHandler(async (req, res) => {
    await Admin.findByIdAndUpdate(
        req.admin._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new apiResponse(200, {}, 'Admin logged out successfully'));
});

// for avatar
const avatarUpload = asyncHandler(async (req, res) => {
    const avatarPath = req.file?.path;
    if (!avatarPath) {
        throw new apiError(400, ' Avatar is required !');
    }
    const avatar = await uploadOnCloudinary(avatarPath);
    if (!avatar) {
        throw new apiError(400, ' avatar upload failed ');
    }
    let avatarDetails;
    try {
        avatarDetails = await Admin.findByIdAndUpdate(
            req.admin._id,
            { $set: { avatar: avatar.secure_url, avatarId: avatar.public_id } },
            { new: true }
        ).select('avatar avatarId');
    } catch (error) {
        if (avatar.public_id) {
            await deleteFromCloudinary(avatar.public_id);
            throw new apiError(500, 'Failed to create avatar ');
        }
    }
    return res
        .status(201)
        .json(new apiResponse(201, avatarDetails, 'Avatar Uploaded Successfully ! '));
});

// fetech the avatar

const getAvatar = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
        throw new apiError(404, ' admin not found');
    }
    if(!admin.avatar){
        throw new apiError(400, " no avatar found  ")
    }
    console.log('admin is : ===> ', admin);
    return res
        .status(200)
        .json(new apiResponse(201, { avatar: admin.avatar }, 'Avatar Fetched Successfully'));
});

//edit avatar

const editAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new apiError(400, 'Avatar file is required');
    }

    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
        throw new apiError(404, 'admin not found');
    }

    // delete old image if one exists
    if (admin.avatarId) {
        await deleteFromCloudinary(admin.avatarId);
    }

    // upload new
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
    if (!cloudinaryResponse) {
        throw new apiError(500, 'failed while uploading to cloudinary');
    }

    admin.avatar = cloudinaryResponse.secure_url;
    admin.avatarId = cloudinaryResponse.public_id;
    await admin.save();

    return res.status(200).json(new apiResponse(200, admin, 'avatar updated successfully'));
});
//delete avatar ?

const avatarDelete = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
        throw new apiError(404, 'admin not found');
    }

    if (!admin.avatar) {
        throw new apiError(400, 'no avatar to delete');
    }

    await deleteFromCloudinary(admin.avatarId);

    await Admin.findByIdAndUpdate(
        req.admin._id,
        { $unset: { avatar: '', avatarId: '' } }
    );

    return res.status(200).json(new apiResponse(200, {}, 'Avatar deleted successfully'));
});




const getAdminProfile = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.admin._id).select('name email');
    return res.status(200).json(new apiResponse(200, admin, ' admin profile has been fetched !'));
});




const editName = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        throw new apiError(400, '');
    }

    const admin = await Admin.findByIdAndUpdate(
        req.admin._id,
        { $set: { name, email } },
        { new: true }
    ).select('name email');
    return res.status(200).json(new apiResponse(200, admin, ' name updated successfully !'));
});

export {
    adminLogin,
    refreshtokenController,
    adminLogOut,
    avatarUpload,
    getAvatar,
    editAvatar,
    avatarDelete,
};
