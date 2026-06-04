import mongoose from 'mongoose';

const contact = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
        },
        message: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Contact = mongoose.model('Contact', contact);
export { Contact };
