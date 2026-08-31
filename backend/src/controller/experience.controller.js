import { Experience } from '../models/experience.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

// the admin form posts highlights as one-per-line text; the model wants an array
const parseHighlights = (value) => {
    if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
    if (typeof value !== 'string') return undefined;
    return value
        .split('\n')
        .map((line) => line.replace(/^[-*\u2022]\s*/, '').trim())
        .filter(Boolean);
};

/**
 * Products are written as a product line followed by its own work, dash-marked:
 *
 *   TextMe | https://textme.co.il | SMS marketing for Shopify stores
 *   - took restock notifications from store-wide to per-variant
 *   - fixed scope settings silently persisting "all variants"
 *   ShipOS | https://shipos.co.il | Multi-carrier shipping backend
 *   - surfaced the server IPs in the ip_blocked warning
 *
 * A dashed line attaches to the product above it; anything else starts a new
 * product. Only the name is required — a product with no link and no bullets is
 * still a product.
 */
const parseProducts = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string') return undefined;

    const products = [];
    for (const raw of value.split('\n')) {
        const line = raw.trim();
        if (!line) continue;

        const bullet = line.match(/^[-*\u2022]\s*(.+)$/);
        if (bullet && products.length) {
            products[products.length - 1].highlights.push(bullet[1].trim());
            continue;
        }

        const [name, url = '', summary = ''] = line
            .replace(/^[-*\u2022]\s*/, '')
            .split('|')
            .map((part) => part.trim());
        if (name) products.push({ name, url, summary, highlights: [] });
    }
    return products;
};

// multipart sends every field as a string, so 'false' would otherwise be truthy
const parseBool = (value) => {
    if (typeof value === 'boolean') return value;
    if (value === undefined || value === null || value === '') return undefined;
    return value === 'true' || value === 'on' || value === '1';
};

const TEXT_FIELDS = [
    'title', 'company', 'companyUrl', 'location', 'period',
    'description', 'techStack', 'liveUrl',
];

const experienceController = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    if (!title?.trim() || !description?.trim()) {
        throw new apiError(400, ' title and description are required ');
    }

    const payload = {};
    for (const field of TEXT_FIELDS) {
        if (req.body[field] !== undefined) payload[field] = req.body[field];
    }
    const highlights = parseHighlights(req.body.highlights);
    if (highlights) payload.highlights = highlights;
    const products = parseProducts(req.body.products);
    if (products) payload.products = products;
    const current = parseBool(req.body.current);
    if (current !== undefined) payload.current = current;
    if (req.body.order !== undefined && req.body.order !== '') {
        payload.order = Number(req.body.order) || 0;
    }

    // an image is optional — a role does not necessarily have a screenshot
    let expImage = null;
    if (req.file?.path) {
        expImage = await uploadOnCloudinary(req.file.path);
        if (!expImage) {
            throw new apiError(400, 'expImage upload failed ! ');
        }
        payload.imageUrl = expImage.secure_url;
        payload.imageId = expImage.public_id;
    }

    let experienceDetails;
    try {
        experienceDetails = await Experience.create(payload);
    } catch (error) {
        console.log(' Upload error is coming from =>', error);
        if (expImage?.public_id) await deleteFromCloudinary(expImage.public_id);
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

    let query = Experience.find().sort({ order: 1, createdAt: -1 });
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

// one entry, for the public detail page

const getExperienceById = asyncHandler(async (req, res) => {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
        throw new apiError(404, ' experience not found ! ');
    }
    return res
        .status(200)
        .json(new apiResponse(200, experience, ' experience fetched successfully ! '));
});

// edit the experince

const experienceEdit = asyncHandler(async (req, res) => {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
        throw new apiError(400, ' experince Details not found ! ');
    }

    // only overwrite what the form actually sent, so a partial edit is safe
    for (const field of TEXT_FIELDS) {
        if (req.body[field] !== undefined) experience[field] = req.body[field];
    }
    const highlights = parseHighlights(req.body.highlights);
    if (highlights) experience.highlights = highlights;
    const products = parseProducts(req.body.products);
    if (products) experience.products = products;
    const current = parseBool(req.body.current);
    if (current !== undefined) experience.current = current;
    if (req.body.order !== undefined && req.body.order !== '') {
        experience.order = Number(req.body.order) || 0;
    }

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

export { experienceController, getAllExperience, experienceEdit, experienceDelete, getExperienceById };
