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
    if (!name?.trim() || !email?.trim() || ! subject?.trim() || !message?.trim()) {
        throw new apiError(400, ' all field are required ! ');
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
    const skip = (page - 1) * limit;

    const contacts = await Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Contact.countDocuments();

    return res.status(200).json(
        new apiResponse(
            200,
            {
                contacts,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: limit,
                },
            },
            'contact messages fetched successfully'
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
