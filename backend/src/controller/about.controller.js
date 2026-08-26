import { About } from '../models/about.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

// stats / tickerItems come in as JSON strings when posted as form-data
const parseJsonField = (value, fallback) => {
    if (value === undefined) return fallback;
    if (Array.isArray(value)) return value;
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch {
        return fallback;
    }
};

const upsertAbout = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        mission,
        headingLine1,
        headingLine2,
        ctaLabel,
        ctaNote,
        stats,
        tickerItems,
        isActive,
    } = req.body;

    let about = await About.findOne().sort({ createdAt: -1 });

    if (!about) {
        if (!title?.trim() || !description?.trim() || !mission?.trim()) {
            throw new apiError(400, ' title, description and mission are required ');
        }
        about = new About({
            title: title.trim(),
            description: description.trim(),
            mission: mission.trim(),
        });
    } else {
        about.title = title?.trim() || about.title;
        about.description = description?.trim() || about.description;
        about.mission = mission?.trim() || about.mission;
    }

    if (headingLine1 !== undefined) about.headingLine1 = headingLine1.trim();
    if (headingLine2 !== undefined) about.headingLine2 = headingLine2.trim();
    if (ctaLabel !== undefined) about.ctaLabel = ctaLabel.trim();
    if (ctaNote !== undefined) about.ctaNote = ctaNote.trim();
    if (stats !== undefined) about.stats = parseJsonField(stats, about.stats);
    if (tickerItems !== undefined) about.tickerItems = parseJsonField(tickerItems, about.tickerItems);
    if (isActive !== undefined) about.isActive = isActive === 'true' || isActive === true;

    const photoFile = req.files?.photo?.[0];
    if (photoFile) {
        if (about.photoId) await deleteFromCloudinary(about.photoId);
        const uploaded = await uploadOnCloudinary(photoFile.path);
        if (!uploaded) {
            throw new apiError(400, ' failed to upload photo ');
        }
        about.photo = uploaded.secure_url;
        about.photoId = uploaded.public_id;
    }

    await about.save();

    return res.status(200).json(new apiResponse(200, about, ' About saved successfully ! '));
});

const getAbout = asyncHandler(async (req, res) => {
    const about = await About.findOne().sort({ createdAt: -1 });
    return res.status(200).json(new apiResponse(200, about, ' about fetched successfully ! '));
});

// resume is a raw (pdf) upload stored on the same singleton
const uploadResume = asyncHandler(async (req, res) => {
    const resumePath = req.file?.path;
    if (!resumePath) {
        throw new apiError(400, ' resume file is required ! ');
    }

    let about = await About.findOne().sort({ createdAt: -1 });
    if (!about) {
        throw new apiError(400, ' create the about section before uploading a resume ');
    }

    if (about.resumeId) {
        await deleteFromCloudinary(about.resumeId);
    }

    const uploaded = await uploadOnCloudinary(resumePath);
    if (!uploaded) {
        throw new apiError(400, ' resume upload failed ! ');
    }

    about.resumeUrl = uploaded.secure_url;
    about.resumeId = uploaded.public_id;
    await about.save();

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                { resumeUrl: about.resumeUrl },
                ' Resume uploaded successfully ! '
            )
        );
});

export { upsertAbout, getAbout, uploadResume };
