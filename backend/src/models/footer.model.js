import mongoose from 'mongoose';

// single document — stores footer content for the public site
const footerSchema = new mongoose.Schema(
    {
        tagline: {
            type: String,
            default: 'Developed by Arbin Thapa Magar',
        },
       
        email: {
            type: String,
            default: 'hello@portfolio.com',
        },
        phone: {
            type: String,
            default: '+977 9818856764',
        },
        location: {
            type: String,
            default: 'Kathmandu, Nepal',
        },
        locationHe: {
            type: String,
            default: '',
        },
        copyright: {
            type: String,
            default: 'Arbin. All rights reserved.',
        },
        copyrightHe: {
            type: String,
            default: '',
        },
        githubUrl: {
            type: String,
            default: '',
        },
        linkedinUrl: {
            type: String,
            default: '',
        },
        twitterUrl: {
            type: String,
            default: '',
        },
        facebookUrl: {
            type: String,
            default: '',
        },
        instagramUrl: {
            type: String,
            default: '',
        },
        tiktokUrl: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

const Footer = mongoose.model('Footer', footerSchema);
export { Footer };
