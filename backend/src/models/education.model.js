import mongoose from 'mongoose';

// a degree, certification or training programme shown in the education timeline
const educationSchema = new mongoose.Schema(
    {
        // e.g. 'Bachelor of Science in Information Technology'
        title: {
            type: String,
            required: true,
            trim: true,
        },
        institution: {
            type: String,
            default: '',
            trim: true,
        },
        // e.g. 'Affiliated with Lincoln University'
        affiliation: {
            type: String,
            default: '',
            trim: true,
        },
        institutionUrl: {
            type: String,
            default: '',
            trim: true,
        },
        location: {
            type: String,
            default: '',
            trim: true,
        },
        // free text so '2022 — 2026' and 'Completed 2026' both work
        period: {
            type: String,
            default: '',
            trim: true,
        },
        // 'degree' | 'training' | 'certification' — drives the icon on the site
        kind: {
            type: String,
            default: 'degree',
            trim: true,
        },
        status: {
            type: String,
            default: '',
            trim: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        // what was actually covered, rendered as a list
        highlights: {
            type: [String],
            default: [],
        },
        // comma separated on the way in, chips with logos on the way out
        techStack: {
            type: String,
            default: '',
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Education = mongoose.model('Education', educationSchema);
export { Education };
