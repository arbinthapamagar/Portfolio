import { Hero } from '../models/hero.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

// the site only ever shows one hero, so this is an upsert on a single document
const upsertHero = asyncHandler(async (req, res) => {
    const { title, subtitle, buttonText, buttonLink, isActive } = req.body;

    let hero = await Hero.findOne().sort({ createdAt: -1 });

    if (!hero) {
        if (!title?.trim() || !subtitle?.trim() || !buttonText?.trim() || !buttonLink?.trim()) {
            throw new apiError(400, ' title, subtitle, buttonText and buttonLink are required ');
        }
        hero = new Hero({
            title: title.trim(),
            subtitle: subtitle.trim(),
            buttonText: buttonText.trim(),
            buttonLink: buttonLink.trim(),
        });
    } else {
        hero.title = title?.trim() || hero.title;
        hero.subtitle = subtitle?.trim() || hero.subtitle;
        hero.buttonText = buttonText?.trim() || hero.buttonText;
        hero.buttonLink = buttonLink?.trim() || hero.buttonLink;
    }

    if (isActive !== undefined) {
        hero.isActive = isActive === 'true' || isActive === true;
    }

    // replacing the portrait removes the old asset rather than orphaning it
    const photoFile = req.files?.photo?.[0];
    if (photoFile) {
        if (hero.photoId) await deleteFromCloudinary(hero.photoId);
        const uploaded = await uploadOnCloudinary(photoFile.path);
        if (!uploaded) {
            throw new apiError(400, ' failed to upload photo ');
        }
        hero.photo = uploaded.secure_url;
        hero.photoId = uploaded.public_id;
    }

    // badge images are optional, sent as two named single files
    for (const field of ['badgeImage1', 'badgeImage2']) {
        const file = req.files?.[field]?.[0];
        if (file) {
            const uploaded = await uploadOnCloudinary(file.path);
            if (!uploaded) {
                throw new apiError(400, ` failed to upload ${field} `);
            }
            hero[field] = uploaded.secure_url;
        }
    }

    await hero.save();

    return res.status(200).json(new apiResponse(200, hero, ' Hero saved successfully ! '));
});

const getHero = asyncHandler(async (req, res) => {
    const hero = await Hero.findOne().sort({ createdAt: -1 });
    return res.status(200).json(new apiResponse(200, hero, ' hero fetched successfully ! '));
});

export { upsertHero, getHero };
