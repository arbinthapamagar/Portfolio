import { Client } from '../models/client.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

const clientController = asyncHandler(async (req, res) => {
    const { clientName, heading, subtitle } = req.body;

    if (!clientName?.trim() || !heading?.trim() || !subtitle?.trim()) {
        throw new apiError(400, ' all field are required ');
    }

    const logoPath = req.file?.path;
    if (!logoPath) {
        throw new apiError(400, ' logo is required ! ');
    }

    const logo = await uploadOnCloudinary(logoPath);
    if (!logo) {
        throw new apiError(400, ' logo upload failed ! ');
    }

    let client;
    try {
        client = await Client.create({
            clientName: clientName.trim(),
            heading: heading.trim(),
            subtitle: subtitle.trim(),
            logo: logo.secure_url,
            logoId: logo.public_id,
        });
    } catch (error) {
        console.log(' Client create error =>', error);
        if (logo.public_id) await deleteFromCloudinary(logo.public_id);
        throw new apiError(400, ' failed to create client ! ');
    }

    return res.status(201).json(new apiResponse(201, client, ' Client created successfully ! '));
});

const getAllClient = asyncHandler(async (req, res) => {
    const clients = await Client.find().sort({ createdAt: -1 });
    return res
        .status(200)
        .json(new apiResponse(200, { clients }, ' clients fetched successfully ! '));
});

const clientEdit = asyncHandler(async (req, res) => {
    const { clientName, heading, subtitle } = req.body;

    const client = await Client.findById(req.params.id);
    if (!client) {
        throw new apiError(404, ' client not found ! ');
    }

    client.clientName = clientName?.trim() || client.clientName;
    client.heading = heading?.trim() || client.heading;
    client.subtitle = subtitle?.trim() || client.subtitle;

    if (req.file) {
        if (client.logoId) {
            await deleteFromCloudinary(client.logoId);
        }
        const uploaded = await uploadOnCloudinary(req.file.path);
        if (!uploaded) {
            throw new apiError(400, ' failed to upload logo ');
        }
        client.logo = uploaded.secure_url;
        client.logoId = uploaded.public_id;
    }

    await client.save();

    return res.status(200).json(new apiResponse(200, client, ' Client updated successfully ! '));
});

const clientDelete = asyncHandler(async (req, res) => {
    const client = await Client.findById(req.params.id);
    if (!client) {
        throw new apiError(404, ' client not found ! ');
    }

    if (client.logoId) {
        await deleteFromCloudinary(client.logoId);
    }
    await Client.findByIdAndDelete(req.params.id);

    return res.status(200).json(new apiResponse(200, {}, ' Client deleted successfully ! '));
});

export { clientController, getAllClient, clientEdit, clientDelete };
