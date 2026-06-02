import { Admin } from '../models/admin.model.js';

import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

const generateAccessTokenAndRefreshToken = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId);
        const accessToken = admin.generateAccessToken();
        const refreshtoken = admin.generateRefreshToken();
        admin.refreshToken = refreshtoken;
        await admin.save({ validateBeforeSave: false });
        return { accessToken, refreshtoken };
    } catch (error) {
        throw new apiError(
            500,
            ' Something went wrong while creating accesstoken and refresh token'
        );
    }
};

const adminLogin = asyncHandler(async (req, res) => {
    const { email, password, phoneNumber } = req.body;
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
});

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

//
// refreshtoken rotation

const refreshtokenController = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookie?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new apiError(401, ' unauthorized request');
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!decodedToken) {
        throw new apiError(401, ' invalid refresh token !');
    }

    const admin = await Admin.findById(decodedToken._id);

    if (!admin) {
        throw new apiError(401, ' invalid refresh token ');
    }

    if (incomingRefreshToken !== admin?.refreshToken) {
        throw new apiError(401, ' Refresh token expired or invalid ');
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(admin._id);

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
                { accessToken, refreshToken },
                ' accesstoken refreshed successfully '
            )
        );
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
const avatarController = asyncHandler(async (req, res) => {
    const avatarPath = req.file?.path;
    if (!avatar) {
        throw new apiError(400, ' Avatar is required !');
    }
    const avatar = await uploadOnCloudinary(avatarPath);
    if (!avatar) {
        throw new apiError(400, ' avatar upload failed ');
    }
    let avatarDetails;
    try {
        avatarDetails = await Admin.create({
            avatar: avatar.secure_url,
            avatarId: avatar.public_id,
        });
    }
     catch (error) {
        if (avatar.public_id) {
            await deleteFromCloudinary(avatar.public_id);
            throw new apiError(500, 'Failed to create avatar ');
        }
    }
    return res 
    .status(201)
    .json(
        new apiResponse(
            201,
            avatarDetails,
            "Avatar Created Successfullyin db "
        )
    )
});


// fetech the avatar


const getAvatar = asyncHandler(async(req,res)=>{
    const admin = await Admin.findById(req.params.id)
    if(!admin){
        throw new apiError(404, " avatar not found")

    }
    console.log('admin is : ===> ',admin)
    return res
    .status(200)
    ,json(
        new apiResponse(
            201,
            {avatar: admin.avatar},
            'Avatar Fetched Successfully'
        )
    )
})

export { adminLogin, refreshtokenController, adminLogOut };
