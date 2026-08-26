import mongoose from 'mongoose';

// a "skill group" card on the public site — e.g. Frontend / Backend / Database / Tools
const service = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        // icon name rendered on the frontend (lucide-style key, e.g. 'code', 'server')
        icon: {
            type: String,
            default: 'sparkles',
        },
        // long-form copy shown when a group is expanded on the public site
        details: {
            type: String,
            default: '',
            trim: true,
        },
        // concrete things built with this stack, listed under the detail copy
        highlights: {
            type: [String],
            default: [],
        },
        // the actual tech list shown as chips inside the card
        items: {
            type: [String],
            default: [],
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

const Service = mongoose.model('Service', service);

export { Service };
