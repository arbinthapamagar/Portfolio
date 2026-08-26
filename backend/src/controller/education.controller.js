import { Education } from '../models/education.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

// the admin form posts highlights as one-per-line text; the model wants an array
const toLines = (value) => {
    if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
    if (typeof value !== 'string') return undefined;
    return value
        .split('\n')
        .map((line) => line.replace(/^[-*•]\s*/, '').trim())
        .filter(Boolean);
};

const TEXT_FIELDS = [
    'title', 'institution', 'affiliation', 'institutionUrl',
    'location', 'period', 'kind', 'status', 'description', 'techStack',
];

const educationController = asyncHandler(async (req, res) => {
    const { title } = req.body;
    if (!title?.trim()) {
        throw new apiError(400, ' title is required ');
    }

    const payload = {};
    for (const field of TEXT_FIELDS) {
        if (req.body[field] !== undefined) payload[field] = req.body[field];
    }
    const highlights = toLines(req.body.highlights);
    if (highlights) payload.highlights = highlights;
    if (req.body.order !== undefined && req.body.order !== '') {
        payload.order = Number(req.body.order) || 0;
    }
    if (req.body.isActive !== undefined) {
        payload.isActive = req.body.isActive === 'true' || req.body.isActive === true;
    }

    const education = await Education.create(payload);
    return res
        .status(201)
        .json(new apiResponse(201, education, ' Education created successfully ! '));
});

const getAllEducation = asyncHandler(async (req, res) => {
    const education = await Education.find().sort({ order: 1, createdAt: 1 });
    return res
        .status(200)
        .json(new apiResponse(200, { education }, ' education fetched successfully ! '));
});

const educationEdit = asyncHandler(async (req, res) => {
    const education = await Education.findById(req.params.id);
    if (!education) {
        throw new apiError(404, ' education not found ! ');
    }

    // only overwrite what the form actually sent, so a partial edit is safe
    for (const field of TEXT_FIELDS) {
        if (req.body[field] !== undefined) education[field] = req.body[field];
    }
    const highlights = toLines(req.body.highlights);
    if (highlights) education.highlights = highlights;
    if (req.body.order !== undefined && req.body.order !== '') {
        education.order = Number(req.body.order) || 0;
    }
    if (req.body.isActive !== undefined) {
        education.isActive = req.body.isActive === 'true' || req.body.isActive === true;
    }

    await education.save();
    return res
        .status(200)
        .json(new apiResponse(200, education, ' Education updated successfully ! '));
});

const educationDelete = asyncHandler(async (req, res) => {
    const education = await Education.findByIdAndDelete(req.params.id);
    if (!education) {
        throw new apiError(404, ' education not found ! ');
    }
    return res.status(200).json(new apiResponse(200, {}, ' Education deleted successfully ! '));
});

export { educationController, getAllEducation, educationEdit, educationDelete };
