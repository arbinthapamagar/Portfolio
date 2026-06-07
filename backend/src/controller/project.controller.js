import { Project } from "../models/project.model";
import {asyncHandler} from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const projectController = asyncHandler(async(req,res)=>{
    const {title,description,problemSolved, stack,demoVideo, links}
})