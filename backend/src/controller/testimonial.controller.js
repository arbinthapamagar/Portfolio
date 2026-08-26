import { Testimonial } from '../models/testimonial.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

const testimonialController = asyncHandler(async (req, res) => {
    const { name, company, reviewText, rating } = req.body;

    if (!name?.trim() || !company?.trim() || !reviewText?.trim()) {
        throw new apiError(400, ' name, company and reviewText are required ');
    }

    const avatarPath = req.file?.path;
    if (!avatarPath) {
        throw new apiError(400, ' avatar image is required ! ');
    }

    const avatar = await uploadOnCloudinary(avatarPath);
    if (!avatar) {
        throw new apiError(400, ' avatar upload failed ! ');
    }

    let testimonialDetails;
    try {
        testimonialDetails = await Testimonial.create({
            name: name.trim(),
            company: company.trim(),
            reviewText: reviewText.trim(),
            rating: Number(rating) || 0,
            avatar: avatar.secure_url,
            avatarId: avatar.public_id,
        });
    } catch (error) {
        console.log(' Testimonial create error =>', error);
        if (avatar.public_id) await deleteFromCloudinary(avatar.public_id);
        throw new apiError(400, ' failed to create testimonial ! ');
    }

    return res
        .status(201)
        .json(new apiResponse(201, testimonialDetails, ' Testimonial created successfully ! '));
});

const getAllTestimonial = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const hasLimit = limit > 0;
    const skip = hasLimit ? (page - 1) * limit : 0;

    let query = Testimonial.find().sort({ createdAt: -1 });
    if (hasLimit) {
        query = query.skip(skip).limit(limit);
    }
    const testimonials = await query;
    const total = await Testimonial.countDocuments();

    return res.status(200).json(
        new apiResponse(
            200,
            {
                testimonials,
                pagination: {
                    currentPage: hasLimit ? page : 1,
                    totalPages: hasLimit ? Math.ceil(total / limit) : 1,
                    totalItems: total,
                    limit: hasLimit ? limit : total,
                },
            },
            ' testimonials fetched successfully ! '
        )
    );
});

const testimonialEdit = asyncHandler(async (req, res) => {
    const { name, company, reviewText, rating } = req.body;

    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
        throw new apiError(404, ' testimonial not found ! ');
    }

    testimonial.name = name?.trim() || testimonial.name;
    testimonial.company = company?.trim() || testimonial.company;
    testimonial.reviewText = reviewText?.trim() || testimonial.reviewText;
    if (rating !== undefined) {
        testimonial.rating = Number(rating) || 0;
    }

    if (req.file) {
        if (testimonial.avatarId) {
            await deleteFromCloudinary(testimonial.avatarId);
        }
        const uploaded = await uploadOnCloudinary(req.file.path);
        if (!uploaded) {
            throw new apiError(400, ' failed to upload avatar ');
        }
        testimonial.avatar = uploaded.secure_url;
        testimonial.avatarId = uploaded.public_id;
    }

    await testimonial.save();

    return res
        .status(200)
        .json(new apiResponse(200, testimonial, ' Testimonial updated successfully ! '));
});

const testimonialDelete = asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
        throw new apiError(404, ' testimonial not found ! ');
    }

    if (testimonial.avatarId) {
        await deleteFromCloudinary(testimonial.avatarId);
    }
    await Testimonial.findByIdAndDelete(req.params.id);

    return res.status(200).json(new apiResponse(200, {}, ' Testimonial deleted successfully ! '));
});

export { testimonialController, getAllTestimonial, testimonialEdit, testimonialDelete };
