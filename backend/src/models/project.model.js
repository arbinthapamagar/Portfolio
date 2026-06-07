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
