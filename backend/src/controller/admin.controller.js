import {Admin} from "../models/admin.model.js"

import { asyncHandler } from "../utils/asyncHandler";
import { apiError } from "../utils/apiError";
import {apiResponse} from "../utils/apiResponse"
import jwt from "jsonwebtoken";


const generateAccessTokenAndRefreshToken = async()=>{
try {
        const admin =await Admin.findById(adminId);
        const accessToken = admin.generateAccessToken();
        const refreshtoken = admin.generateRefreshToken();
        admin.refreshToken = refreshtoken;
        await admin.save({validateBeforeSave:false});
        return {accessToken, refreshtoken}
} catch (error) {
    throw new apiError(
        500, " Something went wrong while creating accesstoken and refresh token"
    );
    
}

}