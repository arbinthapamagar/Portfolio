import { Footer } from '../models/footer.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';

const EDITABLE = [
    'tagline',
    'email',
    'phone',
    'location',
    'copyright',
    'githubUrl',
    'linkedinUrl',
    'twitterUrl',
    'facebookUrl',
    'instagramUrl',
    'tiktokUrl',
];

const upsertFooter = asyncHandler(async (req, res) => {
    let footer = await Footer.findOne();
    if (!footer) {
        footer = new Footer();
    }

    for (const field of EDITABLE) {
        if (req.body[field] !== undefined) {
            footer[field] = String(req.body[field]).trim();
        }
    }

    await footer.save();

    return res.status(200).json(new apiResponse(200, footer, ' Footer saved successfully ! '));
});

const getFooter = asyncHandler(async (req, res) => {
    // defaults live on the schema, so hand back a fresh doc shape if nothing is saved yet
    const footer = (await Footer.findOne()) || new Footer();
    return res.status(200).json(new apiResponse(200, footer, ' footer fetched successfully ! '));
});

export { upsertFooter, getFooter };
