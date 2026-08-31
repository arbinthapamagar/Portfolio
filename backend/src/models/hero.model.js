import mongoose, { model } from 'mongoose';

const hero = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
            required: true,
        },
        buttonText: {
            type: String,
            required: true,
        },
        buttonLink: {
            type: String,
            required: true,
        },

        // portrait shown beside the hero copy — when empty the hero falls back
        // to its centred, text-only layout
        photo: {
            type: String,
            default: '',
        },
        photoId: {
            type: String,
            default: '',
        },
        badgeImage1: {
            type: String,
            default: '',
        },
        badgeImage2: {
            type: String,
            default: '',
        },
        isActive: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { timestamps: true }
);

const Hero = mongoose.model('Hero', hero);
export { Hero };
