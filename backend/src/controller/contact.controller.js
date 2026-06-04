import { Contact } from '../models/contact.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';
import dotenv, { parse } from 'dotenv';
dotenv.config();

import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

const contactController = asyncHandler(async (req, res) => {
    const { name, email, message, subject } = req.body;
    if (!name?.trim() || !email?.trim() || subject?.trim() || !meessage?.trim()) {
        throw new apiError(400, ' all foeld are required ! ');
    }

    //validation

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new apiError(400, ' invalid email format ');
    }

    const contact = await Contact.create({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        subject: subject.trim(),
    });
    return res
        .status(200)
        .json(new apiResponse(200, contact, ' Your contact is created successfully ! '));
});

// fetch the contact into admin profile : with pagination of 50

const getContactMessage = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const hasLimit = limit > 0;
    const skip = hasLimit ? (page - 1) * limit : 0;

    let query = await Contact.find().sort({ createdAt: -1 });
    if (hasLimit) {
        query = query.skip(skip).limit(limit);
    }
    const contact = query;
    const total = await Contact.countDocuments();
    return res.status(200).json(
        new apiResponse(
            200,
            {
                message,
                pagination: {
                    currentPage: hasLimit ? page : 1,
                    totalPages: hasLimit ? Math.ceil(total / limit) : 1,
                    totalItems: total,
                    limit: hasLimit ? limit : total,
                },
            },
            'ContactMessageDetails fetched successfully'
        )
    );
});

// delete the contact message getting from client

const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
        throw new apiError(404, ' Mesage not Found !');
    }

    return res.status(200).json(new apiResponse(200, {}, ' Message Deleted successfully '));
});

// note for admin

export { contactController, getContactMessage, deleteContact };
