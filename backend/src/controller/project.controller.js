import { Project } from '../models/project.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

// stack / links arrive as plain strings when the request is multipart form-data,
// so accept both a real array and a comma separated string
const toArray = (value) => {
    if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
    if (typeof value === 'string') {
        return value
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean);
    }
    return [];
};

const projectController = asyncHandler(async (req, res) => {
    const { title, description, problemSolved, stack, role, liveDemo, github, demoVideo, featured, order } =
        req.body;

    if (!title?.trim() || !description?.trim() || !problemSolved?.trim()) {
        throw new apiError(400, ' title, description and problemSolved are required ');
    }

    const stackList = toArray(stack);
    if (!stackList.length) {
        throw new apiError(400, ' at least one stack item is required ');
    }

    // screenshots are optional, multer gives us req.files for an array upload
    const files = req.files || [];
    const screenshots = [];

    for (const file of files) {
        const uploaded = await uploadOnCloudinary(file.path);
        if (!uploaded) {
            // roll back anything already pushed to cloudinary
            for (const shot of screenshots) await deleteFromCloudinary(shot.publicId);
            throw new apiError(400, ' screenshot upload failed ! ');
        }
        screenshots.push({ url: uploaded.secure_url, publicId: uploaded.public_id });
    }

    let projectDetails;
    try {
        projectDetails = await Project.create({
            title: title.trim(),
            description: description.trim(),
            problemSolved: problemSolved.trim(),
            stack: stackList,
            role: role?.trim() || '',
            screenshots,
            demoVideo: demoVideo?.trim() || '',
            featured: featured === 'true' || featured === true,
            order: Number(order) || 0,
            links: {
                liveDemo: liveDemo?.trim() || '',
                github: github?.trim() || '',
            },
        });
    } catch (error) {
        console.log(' Project create error =>', error);
        for (const shot of screenshots) await deleteFromCloudinary(shot.publicId);
        throw new apiError(400, ' failed to create project ! ');
    }

    return res
        .status(201)
        .json(new apiResponse(201, projectDetails, ' Project created successfully ! '));
});

// public + admin listing, featured first then manual order
const getAllProject = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const hasLimit = limit > 0;
    const skip = hasLimit ? (page - 1) * limit : 0;

    let query = Project.find().sort({ featured: -1, order: 1, createdAt: -1 });
    if (hasLimit) {
        query = query.skip(skip).limit(limit);
    }
    const projects = await query;
    const total = await Project.countDocuments();

    return res.status(200).json(
        new apiResponse(
            200,
            {
                projects,
                pagination: {
                    currentPage: hasLimit ? page : 1,
                    totalPages: hasLimit ? Math.ceil(total / limit) : 1,
                    totalItems: total,
                    limit: hasLimit ? limit : total,
                },
            },
            ' projects fetched successfully ! '
        )
    );
});

const getProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        throw new apiError(404, ' project not found ! ');
    }
    return res.status(200).json(new apiResponse(200, project, ' project fetched successfully ! '));
});

const projectEdit = asyncHandler(async (req, res) => {
    const { title, description, problemSolved, stack, role, liveDemo, github, demoVideo, featured, order } =
        req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
        throw new apiError(404, ' project not found ! ');
    }

    project.title = title?.trim() || project.title;
    project.description = description?.trim() || project.description;
    project.problemSolved = problemSolved?.trim() || project.problemSolved;
    project.role = role?.trim() ?? project.role;
    project.demoVideo = demoVideo?.trim() ?? project.demoVideo;

    if (stack !== undefined) {
        const stackList = toArray(stack);
        if (stackList.length) project.stack = stackList;
    }

    if (featured !== undefined) {
        project.featured = featured === 'true' || featured === true;
    }
    if (order !== undefined) {
        project.order = Number(order) || 0;
    }

    if (liveDemo !== undefined) project.links.liveDemo = liveDemo.trim();
    if (github !== undefined) project.links.github = github.trim();

    // new screenshots replace the old set completely
    const files = req.files || [];
    if (files.length) {
        for (const shot of project.screenshots) {
            if (shot.publicId) await deleteFromCloudinary(shot.publicId);
        }

        const screenshots = [];
        for (const file of files) {
            const uploaded = await uploadOnCloudinary(file.path);
            if (!uploaded) {
                throw new apiError(400, ' failed to upload screenshot ');
            }
            screenshots.push({ url: uploaded.secure_url, publicId: uploaded.public_id });
        }
        project.screenshots = screenshots;
    }

    await project.save();

    return res.status(200).json(new apiResponse(200, project, ' Project updated successfully ! '));
});

const projectDelete = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        throw new apiError(404, ' project not found ! ');
    }

    for (const shot of project.screenshots) {
        if (shot.publicId) await deleteFromCloudinary(shot.publicId);
    }
    await Project.findByIdAndDelete(req.params.id);

    return res.status(200).json(new apiResponse(200, {}, ' Project deleted successfully ! '));
});

export { projectController, getAllProject, getProjectById, projectEdit, projectDelete };
