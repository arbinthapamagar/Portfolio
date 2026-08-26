import mongoose from 'mongoose';

const project = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        problemSolved: {
            type: String,
            required: true,
            trim: true,
        },
        stack: {
            type: [String],
            required: true,
            default: [],
        },
        // "your role" from description.md — e.g. 'Solo developer', 'Backend lead'
        role: {
            type: String,
            default: '',
            trim: true,
        },
        screenshots: [
            {
                url: {
                    type: String,
                },
                publicId: {
                    type: String,
                },
            },
        ],
        demoVideo: {
            type: String,
            default: '',
        },
        featured: {
            type: Boolean,
            default: false,
        },
        order: {
            type: Number,
            default: 0,
        },
        links: {
            liveDemo: {
                type: String,
                default: '',
            },
            github: {
                type: String,
                default: '',
            },
        },
    },
    { timestamps: true }
);

const Project = mongoose.model('Project', project);

export { Project };
