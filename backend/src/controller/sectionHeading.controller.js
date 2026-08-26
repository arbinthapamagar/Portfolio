import { SectionHeading } from '../models/sectionHeading.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

// one row per section key ('projects', 'experience', 'testimonials', ...)
const upsertSectionHeading = asyncHandler(async (req, res) => {
    const { section, label, titlePlain, titleHighlight, subtitle } = req.body;

    if (!section?.trim()) {
        throw new apiError(400, ' section key is required ');
    }

    const heading = await SectionHeading.findOneAndUpdate(
        { section: section.trim() },
        {
            $set: {
                label: label?.trim() ?? '',
                titlePlain: titlePlain?.trim() ?? '',
                titleHighlight: titleHighlight?.trim() ?? '',
                subtitle: subtitle?.trim() ?? '',
            },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res
        .status(200)
        .json(new apiResponse(200, heading, ' Section heading saved successfully ! '));
});

// returned as a map keyed by section so the frontend can look up headings directly
const getAllSectionHeading = asyncHandler(async (req, res) => {
    const rows = await SectionHeading.find();

    const headings = {};
    for (const row of rows) {
        headings[row.section] = row;
    }

    return res
        .status(200)
        .json(new apiResponse(200, { headings }, ' section headings fetched successfully ! '));
});

const sectionHeadingDelete = asyncHandler(async (req, res) => {
    const heading = await SectionHeading.findOneAndDelete({ section: req.params.section });
    if (!heading) {
        throw new apiError(404, ' section heading not found ! ');
    }
    return res
        .status(200)
        .json(new apiResponse(200, {}, ' Section heading deleted successfully ! '));
});

export { upsertSectionHeading, getAllSectionHeading, sectionHeadingDelete };
