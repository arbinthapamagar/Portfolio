import { Service } from '../models/services.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

// highlights arrive one-per-line from the admin textarea
const toLines = (value) => {
    if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
    if (typeof value !== 'string') return undefined;
    return value
        .split('\n')
        .map((line) => line.replace(/^[-*\u2022]\s*/, '').trim())
        .filter(Boolean);
};

const toArray = (value) => {
    if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
    if (typeof value === 'string') {
        return value
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean);
    }
    return [];
};

const serviceController = asyncHandler(async (req, res) => {
    const { title, description, details, icon, items, order, isActive } = req.body;

    if (!title?.trim()) {
        throw new apiError(400, ' title is required ');
    }

    const itemList = toArray(items);
    if (!itemList.length) {
        throw new apiError(400, ' at least one item is required ');
    }

    const service = await Service.create({
        title: title.trim(),
        description: description?.trim() || '',
        details: details?.trim() || '',
        highlights: toLines(req.body.highlights) || [],
        icon: icon?.trim() || 'sparkles',
        items: itemList,
        order: Number(order) || 0,
        isActive: isActive === undefined ? true : isActive === 'true' || isActive === true,
    });

    return res.status(201).json(new apiResponse(201, service, ' Service created successfully ! '));
});

const getAllService = asyncHandler(async (req, res) => {
    const services = await Service.find().sort({ order: 1, createdAt: 1 });
    return res
        .status(200)
        .json(new apiResponse(200, { services }, ' services fetched successfully ! '));
});

const serviceEdit = asyncHandler(async (req, res) => {
    const { title, description, details, icon, items, order, isActive } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service) {
        throw new apiError(404, ' service not found ! ');
    }

    service.title = title?.trim() || service.title;
    service.description = description?.trim() ?? service.description;
    if (details !== undefined) service.details = details;
    const highlights = toLines(req.body.highlights);
    if (highlights) service.highlights = highlights;
    service.icon = icon?.trim() || service.icon;

    if (items !== undefined) {
        const itemList = toArray(items);
        if (itemList.length) service.items = itemList;
    }
    if (order !== undefined) {
        service.order = Number(order) || 0;
    }
    if (isActive !== undefined) {
        service.isActive = isActive === 'true' || isActive === true;
    }

    await service.save();

    return res.status(200).json(new apiResponse(200, service, ' Service updated successfully ! '));
});

const serviceDelete = asyncHandler(async (req, res) => {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
        throw new apiError(404, ' service not found ! ');
    }
    return res.status(200).json(new apiResponse(200, {}, ' Service deleted successfully ! '));
});

export { serviceController, getAllService, serviceEdit, serviceDelete };
