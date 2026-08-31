import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
    {
        // the headline — e.g. 'Software Developer Intern'
        title: {
            type: String,
            required: true,
            trim: true,
        },
        company: {
            type: String,
            default: '',
            trim: true,
        },
        companyUrl: {
            type: String,
            default: '',
            trim: true,
        },
        location: {
            type: String,
            default: '',
            trim: true,
        },
        // free text so '2026 — Present' and 'Feb 2026 — Aug 2026' both work
        period: {
            type: String,
            default: '',
            trim: true,
        },
        current: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
            required: true,
        },
        // the detail view renders these as a bulleted list of what was actually shipped
        highlights: {
            type: [String],
            default: [],
        },
        /* One card per company, so the products worked on inside that company live
           on the role rather than each taking a card of their own. */
        products: [
            {
                name: { type: String, trim: true },
                url: { type: String, default: '', trim: true },
                summary: { type: String, default: '', trim: true },
                // what was done on this product specifically, so a role with
                // several products reads as several pieces of work rather than
                // one merged list
                highlights: { type: [String], default: [] },
            },
        ],
        // kept as a string for backwards compatibility — comma separated
        techStack: {
            type: String,
            default: '',
        },
        // optional: a role does not necessarily have a screenshot
        imageUrl: {
            type: String,
            default: '',
        },
        imageId: {
            type: String,
            default: '',
        },
        liveUrl: {
            type: String,
            default: '',
        },
        order: {
            type: Number,
            default: 0,
        },
        featured: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Experience = mongoose.model('Experience', experienceSchema);
