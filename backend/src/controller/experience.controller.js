import { Experience } from '../models/experience.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

const experienceController = asyncHandler(async (req, res) => {
    const { title, description, techStack, liveUrl } = req.body;
    if (!title?.trim() || !description?.trim() || !techStack?.trim() || !liveUrl?.trim()) {
        throw new apiError(400, ' all field are required ');
    }
    const imageUrlPath = req.file?.path;
    if (!imageUrlPath) {
        throw new apiError(400, ' image is required ! ');
    }

    const expImage = await uploadOnCloudinary(imageUrlPath);
    if (!expImage) {
        throw new apiError(400, 'expImage upload failed ! ');
    }

    let experienceDetails;
    try {
        experienceDetails = await Experience.create({
            title,
            description,
            techStack,
            liveUrl,
            imageUrl: expImage.secure_url,
            imageId: expImage.public_id,
        });
    } catch (error) {
        console.log(" Upload error is coming from =>", error)
        if (expImage.public_id) await deleteFromCloudinary(expImage.public_id);
        throw new apiError(400, ' failed to create expDetails ! ');
    }

    return res
        .status(200)
        .json(
            new apiResponse(200, experienceDetails, ' Experience Details created successsfully ! ')
        );
});

// fetch the experience , fetch with pagination  for admin pannel

const getAllExperience = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const hasLimit = limit > 0;
    const skip = hasLimit ? (page - 1) * limit : 0;

    let query = Experience.find().sort({ createdAt: -1 });
    if (hasLimit) {
        query = query.skip(skip).limit(limit);
    }
    const experience = await query;
    const total = await Experience.countDocuments();

    return res.status(200).json(
        new apiResponse(
            200,
            {
                experience,
                pagination: {
                    currentPage: hasLimit ? page : 1,
                    totalPages: hasLimit ? Math.ceil(total / limit) : 1,
                    totalItems: total,
                    limit: hasLimit ? limit : total,
                },
            },
            ' experience fetched successfully ! '
        )
    );
});

// edit the experince

const experienceEdit = asyncHandler(async (req, res) => {
    const { title, description, techStack, liveUrl } = req.body;
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
        throw new apiError(400, ' experince Details not found ! ');
    }

    experience.title = title || experience.title;
    experience.description = description || experience.description;
    experience.techStack = techStack || experience.techStack;
    experience.liveUrl = liveUrl || experience.liveUrl;

    // if new image is being uplaoded then

    if (req.file) {
        if (experience.imageId) {
            await deleteFromCloudinary(experience.imageId);
        }

        const cloudinaryResponse = await uploadOnCloudinary(req.file?.path);

        if (!cloudinaryResponse) {
            throw new apiError(400, 'failed to uplad image ');
        }

        experience.imageUrl = cloudinaryResponse.secure_url;
        experience.imageId = cloudinaryResponse.public_id;
    }
    await experience.save();
    console.log(experience);
    return res
        .status(200)
        .json(
            new apiResponse(200, experience, ' ExperienceDetails has been updated Successfully ! ')
        );
});

// for deleting

const experienceDelete = asyncHandler(async (req, res) => {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
        throw new apiError(404, ' experience details not found ! ');
    }

    if (experience.imageId) {
        await deleteFromCloudinary(experience.imageId);
    }
    await Experience.findByIdAndDelete(req.params.id);

    return res
        .status(200)
        .json(new apiResponse(200, {}, ' Experience Details has been deleted successfully ! '));
});

export { experienceController, getAllExperience, experienceEdit, experienceDelete };
